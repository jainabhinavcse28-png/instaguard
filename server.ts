import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parsing with larger limit to accommodate base64 screenshot uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("CRITICAL WARNING: GEMINI_API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper: Ensure API Key exists in routes
const getAiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in the Secrets panel.");
  }
  return ai;
};

// ============================================================================
// API ROUTES
// ============================================================================

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Profile Analyser
app.post("/api/analyze/profile", async (req, res) => {
  try {
    const aiClient = getAiClient();
    const {
      username,
      bio,
      followers,
      following,
      posts,
      avgLikes,
      avgComments,
      consecutiveNumbers,
      noAvatar,
      linkInBio,
      sampleComments,
    } = req.body;

    const profileDataDesc = `
      Username: ${username || "Unknown"}
      Bio: ${bio || "Empty Bio"}
      Followers count: ${followers || 0}
      Following count: ${following || 0}
      Posts count: ${posts || 0}
      Average Likes per post: ${avgLikes || 0}
      Average Comments per post: ${avgComments || 0}
      Has consecutive numbers at end of username: ${consecutiveNumbers ? "Yes" : "No"}
      Has blank/default avatar: ${noAvatar ? "Yes" : "No"}
      Links in bio: ${linkInBio || "None"}
      Sample comments on recent posts: "${sampleComments || "None provided"}"
    `;

    const systemInstruction = 
      "You are a professional social media intelligence audit bot specialized in detecting Instagram bot networks, synthetic profiles, bought follower pods, and automated spam accounts. " +
      "Analyze the provided structured parameters and compute a precise, non-arbitrary bot score (0 to 100), identify warning flags, explain your reasoning, and output a detailed audit assessment.";

    const prompt = `
      Perform a security/authenticity audit on this Instagram user based on these details:
      ${profileDataDesc}
      
      Look for red flags like:
      - Extreme follower-to-following imbalance (e.g., following thousands but very few followers, or reverse if bought followers without engagement)
      - Extremely high or low engagement rates (e.g., thousands of followers but average 0-2 likes, or massive average likes with 0 comments)
      - Suspicious links in bio (link-shorteners, sketchy crypto sites, redirect chains)
      - Bot-like usernames (random characters, trailing numbers like @joshua9482928)
      - Copy-paste style generic comment feedback (like "great pic!", "collaboration soon?", "check DM")
      
      Return a response strictly matching the schema.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            botScore: { type: Type.INTEGER, description: "A calculated percentage probability that this account is a bot (0-100)." },
            riskCategory: { type: Type.STRING, description: "LOW (0-30), MEDIUM (31-70), or HIGH (71-100)." },
            verdict: { type: Type.STRING, description: "A high-level human verdict summary assessing the account's suspiciousness." },
            engagementRate: { type: Type.NUMBER, description: "Calculated engagement rate in percentage based on followers vs likes/comments." },
            engagementStatus: { type: Type.STRING, description: "NORMAL, SUSPICIOUS_LOW, or SUSPICIOUS_HIGH." },
            flags: {
              type: Type.ARRAY,
              description: "Warning flags noticed during the analysis.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "LOW, MEDIUM, or HIGH" },
                  description: { type: Type.STRING },
                  indicator: { type: Type.STRING, description: "The specific metric or evidence triggering this flag" }
                },
                required: ["title", "severity", "description"]
              }
            },
            patternsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific bot behavior patterns identified, e.g., 'Syndicated Commenting', 'Follower Inflation', 'Algorithmic Bio Structure'."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Remediation or security advice for real users, e.g., 'Restrict comments', 'Mute notifications', 'Report as fake account'."
            }
          },
          required: ["botScore", "riskCategory", "verdict", "engagementRate", "engagementStatus", "flags", "patternsDetected", "recommendations"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Profile analysis API error:", error);
    res.status(500).json({ error: error.message || "Unknown error during profile evaluation." });
  }
});

// 3. Comments block scanner
app.post("/api/analyze/comments", async (req, res) => {
  try {
    const aiClient = getAiClient();
    const { commentsText } = req.body;

    if (!commentsText || typeof commentsText !== "string") {
      return res.status(400).json({ error: "Missing or invalid commentsText parameter." });
    }

    const systemInstruction = 
      "You are an automated comment spam classifier for Instagram. Your task is to review a batch of recent comments, " +
      "classify them as bot-generated/spam or legitimate, identify the sub-category of bot (e.g. Crypto/Forex Pitch, Fake Brand Ambassador, Engagement Pod, Generic/Emoji Bot) " +
      "and generate reasons and confidence scores.";

    const prompt = `
      Please audit the listing of Instagram comments below.
      
      Look for:
      - DM pitches, collaboration outreach ("DM us to collaborate", "promote on @...")
      - Cryptocurrency, investment scams, financial schemes, "inbox him" pitches
      - Extreme enthusiasm from account names with no context or generic phrases ("Nice look!", "Awesome capture!", "Super cool!")
      - Double or repeated emojis with no contextual relation to typical user behaviour
      
      Comments to analyze:
      ${commentsText}
      
      Audit each comment and output your classifications as a structured list according to the schema.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSpamPercent: { type: Type.INTEGER, description: "Overall percent of evaluated comments that are judged as bots or spam (0-100)." },
            summary: { type: Type.STRING, description: "A brief professional summary of the comment section pattern." },
            auditedComments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "The original text analyzed" },
                  isBot: { type: Type.BOOLEAN, description: "Whether this comment is highly likely automated, bot, or spam" },
                  category: { type: Type.STRING, description: "LEGITIMATE, CRYPTO_SCAM, COLLAB_SPAM, EMOJI_BOT, REPETITIVE_POD, or SUSPICIOUS" },
                  confidence: { type: Type.INTEGER, description: "Percentage confidence in classification (0-100)" },
                  explanation: { type: Type.STRING, description: "Why this was flagged or verified as legitimate." }
                },
                required: ["text", "isBot", "category", "confidence", "explanation"]
              }
            }
          },
          required: ["overallSpamPercent", "summary", "auditedComments"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Comments analysis API error:", error);
    res.status(500).json({ error: error.message || "Error analyzing comments input." });
  }
});

// 4. Multimodal screenshot scanner
app.post("/api/analyze/screenshot", async (req, res) => {
  try {
    const aiClient = getAiClient();
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 parameter." });
    }

    const cleanMimeType = mimeType || "image/png";
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const systemInstruction = 
      "You are a computer vision social media auditor. You can read screenshots of Instagram profiles, comment feeds, direct message chats, " +
      "or notification centers and extract visual cues, OCR-read text, assess legitimacy, and output diagnostic metrics.";

    const textPart = {
      text: `
        Inspect this screenshot closely. 
        It could be an Instagram Profile page, Comment Feed, or Direct Message (DM).
        
        Isolate visual indicators of automated or malicious bot accounts:
        1. Default empty profile pictures, stock model faces, or highly pixelated avatars.
        2. Unusually formatted usernames heavily laden with sequential digits or incoherent random characters.
        3. Spammer patterns in text: DM copy-paste strings, phishing pitches, cryptocurrency referrals, fake brand endorsements, automated tags.
        4. Visual UI elements showing severe mismatch (e.g. massive following counts compared to follower count).
        
        Determine if the main subject of the screenshot is a bot or displays bot actions.
        Return the result strictly formatted in the requested JSON structure.
      `,
    };

    const imagePart = {
      inlineData: {
        mimeType: cleanMimeType,
        data: cleanBase64,
      },
    };

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            screenshotType: { type: Type.STRING, description: "Type of screenshot scanned, e.g. 'PROFILE_PAGE', 'COMMENTS_FEED', 'DM_CONVERSATION', or 'OTHER'." },
            subjectUsername: { type: Type.STRING, description: "The username being inspected or who sent the suspicious messages. Use 'Unknown' if unreadable." },
            detectedBotScore: { type: Type.INTEGER, description: "Overall assessment bot score (0-100) based on visual cues and content." },
            visualVerdict: { type: Type.STRING, description: "An elegant, descriptive paragraph detailing exactly what the AI saw in the image that led to this verdict." },
            ocrExtractedBioOrText: { type: Type.STRING, description: "Key text, bio, or message contents OCR-extracted from the screenshot." },
            visualFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  indicatorName: { type: Type.STRING, description: "e.g., 'Generic DM Script', 'Imbalanced Follower Count', 'Missing Profile Photo'" },
                  evidenceSource: { type: Type.STRING, description: "Visual or text evidence inside the screenshot" },
                  severity: { type: Type.STRING, description: "LOW, MEDIUM, or HIGH" }
                },
                required: ["indicatorName", "evidenceSource", "severity"]
              }
            },
            recommendingActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["screenshotType", "subjectUsername", "detectedBotScore", "visualVerdict", "ocrExtractedBioOrText", "visualFlags", "recommendingActions"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Screenshot analysis API error:", error);
    res.status(500).json({ error: error.message || "Failed to process screenshot using vision models." });
  }
});


// ============================================================================
// VITE AND DEVELOPMENT PLATFORM INTEGRATION
// ============================================================================

const startServer = async () => {
  // Vite dev mode mounting
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets compiled after standard Vite builds
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[INSTAGUARD SERVER] Listening on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
