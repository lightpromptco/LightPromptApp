export interface Bot {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  tier: string;
  available: boolean;
}

export const BOTS: Bot[] = [
  {
    id: "lightpromptbot",
    name: "LightPromptBot",
    tagline: "Your reflection, in real-time.",
    description: "The core soul-tech mirror bot — built to reflect your emotional tone, reveal patterns, and offer grounded alignment prompts based on what you say and how you say it.",
    icon: "fas fa-mirror",
    gradient: "bot-gradient",
    tier: "Free",
    available: true,
  },
  {
    id: "bodymirror",
    name: "BodyMirror",
    tagline: "Your body. Your rhythm. Reflected.",
    description: "A wellness tracker that reflects your physical and emotional energy. Gives supportive suggestions for movement, mood, food, and flow based on how you're feeling.",
    icon: "fas fa-heart",
    gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
    tier: "$29+",
    available: true,
  },
  {
    id: "woowoo",
    name: "WooWoo",
    tagline: "Your cosmic mirror & metaphysical guide.",
    description: "Your highest self reflected through metaphysical wisdom. Knows personalities, gene keys, astrology, oracle knowledge, and cosmic insights. Honest, insightful, and fun - never lies or deceives, a true mirror of consciousness.",
    icon: "fas fa-star",
    gradient: "bg-gradient-to-br from-purple-400 to-pink-500",
    tier: "Free+",
    available: true,
  },
  {
    id: "geoprompt",
    name: "GeoPrompt",
    tagline: "Location-based wisdom.",
    description: "Connect with meaningful places through AI-guided location reflections. Share your current space and receive contextual prompts based on where you are and how you're feeling.",
    icon: "fas fa-map-marker-alt",
    gradient: "bg-gradient-to-br from-green-400 to-teal-500",
    tier: "Free",
    available: true,
  },
  {
    id: "visionquest",
    name: "VisionQuest",
    tagline: "Train your perception.",
    description: "An inner-training bot that delivers gamified quests, intuitive exercises, and subtle challenges to develop your clarity, intuition, and self-trust.",
    icon: "fas fa-eye",
    gradient: "bg-gradient-to-br from-indigo-400 to-purple-600",
    tier: "Quest",
    available: true,
  },
  {
    id: "lightprompteD",
    name: "LightPrompt:Ed",
    tagline: "Course reflection & integration.",
    description: "Your dedicated learning companion for the LightPrompt:Ed course. Guides you through reflective prompts, helps integrate module insights, and supports your conscious AI journey.",
    icon: "fas fa-graduation-cap",
    gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
    tier: "Course",
    available: true,
  },
];

export function getBotById(id: string): Bot | undefined {
  return BOTS.find(bot => bot.id === id);
}
