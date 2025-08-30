import { ToneConfig } from "@/types";

export const TONE_CONFIGS: ToneConfig[] = [
  {
    id: "professional",
    label: "Professional",
    description: "Formal and business-oriented",
    prompt:
      "Rewrite this text in a formal, professional tone suitable for business communication.",
    icon: "💼",
  },
  {
    id: "concise",
    label: "Concise",
    description: "Short and to the point",
    prompt: "Rewrite this text to be more concise and to the point.",
    icon: "🤏",
  },
  {
    id: "expanded",
    label: "Expanded",
    description: "More detailed and explanatory",
    prompt: "Expand on this text, adding more detail and explanation.",
    icon: "📖",
  },
  {
    id: "casual",
    label: "Casual",
    description: "Relaxed and conversational",
    prompt:
      "Rewrite this text in a casual, friendly tone as if talking to a friend.",
    icon: "😊",
  },
];