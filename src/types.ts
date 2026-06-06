export interface ProfileAnalysisInput {
  username: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  avgLikes: number;
  avgComments: number;
  consecutiveNumbers: boolean;
  noAvatar: boolean;
  linkInBio: string;
  sampleComments: string;
}

export interface FlagIndicator {
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  indicator?: string;
}

export interface ProfileAnalysisResult {
  botScore: number;
  riskCategory: "LOW" | "MEDIUM" | "HIGH";
  verdict: string;
  engagementRate: number;
  engagementStatus: "NORMAL" | "SUSPICIOUS_LOW" | "SUSPICIOUS_HIGH";
  flags: FlagIndicator[];
  patternsDetected: string[];
  recommendations: string[];
}

export interface AuditedComment {
  text: string;
  isBot: boolean;
  category: "LEGITIMATE" | "CRYPTO_SCAM" | "COLLAB_SPAM" | "EMOJI_BOT" | "REPETITIVE_POD" | "SUSPICIOUS";
  confidence: number;
  explanation: string;
}

export interface CommentsAnalysisResult {
  overallSpamPercent: number;
  summary: string;
  auditedComments: AuditedComment[];
}

export interface VisualFlag {
  indicatorName: string;
  evidenceSource: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface ScreenshotAnalysisResult {
  screenshotType: "PROFILE_PAGE" | "COMMENTS_FEED" | "DM_CONVERSATION" | "OTHER";
  subjectUsername: string;
  detectedBotScore: number;
  visualVerdict: string;
  ocrExtractedBioOrText: string;
  visualFlags: VisualFlag[];
  recommendingActions: string[];
}

// Predefined quick-test profiles for a 1-click sandbox demonstration
export interface MockProfilePreset {
  name: string;
  description: string;
  data: ProfileAnalysisInput;
  likelyOutcome: string;
}

export const MOCK_PROFILE_PRESETS: MockProfilePreset[] = [
  {
    name: "Crypto Promoter Bot",
    description: "Suspicious account pitching high yield investment advice in comments with high numbers in handle.",
    likelyOutcome: "HIGH RISK (Bot Score ~90%)",
    data: {
      username: "alex_crypto_rich_83829",
      bio: "💸 Helping you make 10k/week passively! 📈 Dm for Forex & Bitcoin course. Registered Broker in Marshall Islands 📊 👇",
      followers: 120,
      following: 3450,
      posts: 6,
      avgLikes: 2,
      avgComments: 0,
      consecutiveNumbers: true,
      noAvatar: false,
      linkInBio: "bit.ly/crypto-rich-free-scam",
      sampleComments: "Check DM mate! I can show you how to trade",
    },
  },
  {
    name: "Bought Followers Fanpage",
    description: "Huge followers count, standard username, zero engagement, no bio link.",
    likelyOutcome: "MEDIUM/HIGH RISK (Bought Followers Pod ~75%)",
    data: {
      username: "travel_gazer_best",
      bio: "Just a travel lover gazing at the sky. DM for credits.",
      followers: 48900,
      following: 154,
      posts: 12,
      avgLikes: 8,
      avgComments: 0,
      consecutiveNumbers: false,
      noAvatar: false,
      linkInBio: "",
      sampleComments: "Nice picture",
    },
  },
  {
    name: "Brand Ambassador Seeker Bot",
    description: "Generic bio and copy-paste automated collab outreach comments.",
    likelyOutcome: "HIGH RISK (Ambassador Spam Network ~85%)",
    data: {
      username: "aurora.luxury.jewelry.scout",
      bio: "✨ Sparkle like a Diamond! Ambassador Search Active! 💎 We collaborate with elite models worldwide. DM main hub @auroradarlings",
      followers: 430,
      following: 6800,
      posts: 110,
      avgLikes: 14,
      avgComments: 89, // bizarrely high comment ratio for low followers
      consecutiveNumbers: false,
      noAvatar: false,
      linkInBio: "linktr.ee/scout-forms-77",
      sampleComments: "Hey babe! 😍 Real gem! DM us to collab on @fashionspotlight!",
    },
  },
  {
    name: "Authentic Creator Pro",
    description: "Organically grown personal creator account with standard high engagement ratios.",
    likelyOutcome: "LOW RISK (Bot Score <15%)",
    data: {
      username: "designer_sarah_c",
      bio: "Product designer & visual enthusiast. Crafting nice UI/UX in Seattle. 🎨 Co-founder of PixelSpace.",
      followers: 3200,
      following: 650,
      posts: 245,
      avgLikes: 412, // ~13% active engagement rate
      avgComments: 42,
      consecutiveNumbers: false,
      noAvatar: false,
      linkInBio: "sarahchen.design",
      sampleComments: "Stunning colors in this mockup Sarah! Can't wait to read the case study",
    },
  },
];

export const SAMPLE_COMMENT_BLOCKS = [
  {
    label: "Normal organic post comments",
    text: `sarah_k: Wow this is an incredible shot, what lens did you use?
travel_bugs: Definitely adding this to my bucket list!
lucas_dev: Clean layout, love the typography palette
nature_lover_99: 🙌 Awesome place`
  },
  {
    label: "Severe Crypto / Forex spam",
    text: `rich_crypto_mindset: Check out @mr_investor_brian who helped me recover all my loss and make $14,000 in 3 days. God bless you sir!
success_path_77: Yes, @mr_investor_brian is the real deal! I was skeptical but my wallet is proof.
crypto_queen_02: DM'ed him and got started immediately, trade is moving well!
richard_g: Same here, Brian is absolute savior.`
  },
  {
    label: "Mixed Brand Ambassador bots & Collab spam",
    text: `chloe_chic_jewelry: Hey beauty! 💎 Your vibe is gorgeous. We'd love to collaborate, DM us at @chloe_luxury_brand to get your free gifts!
moly_fashion_hub: OMG gorgeous look! Send this pic on @lillian_closet_spot to get featured!
alex_run_fast: Sick run dude!
brand_scouter_bot1: Collab? Check your DM right away box!`
  }
];
