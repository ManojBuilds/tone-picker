import { ToneConfig } from "@/types";

export const TONE_CONFIGS: ToneConfig[] = [
  {
    id: "formal-professional",
    label: "Formal",
    description: "Professional and structured",
    prompt:
      "Rewrite this text in a formal, professional tone suitable for business communication.",
    position: { x: 0, y: 0 },
    icon: "📑",
  },
  {
    id: "casual-friendly",
    label: "Casual",
    description: "Relaxed and conversational",
    prompt:
      "Rewrite this text in a casual, friendly tone as if talking to a friend.",
    position: { x: 1, y: 0 },
    icon: "😊",
  },
  {
    id: "persuasive-compelling",
    label: "Persuasive",
    description: "Convincing and influential",
    prompt:
      "Rewrite this text in a persuasive, compelling tone that motivates action.",
    position: { x: 0, y: 1 },
    icon: "🚀",
  },
  {
    id: "empathetic-warm",
    label: "Empathetic",
    description: "Understanding and supportive",
    prompt:
      "Rewrite this text in an empathetic, warm tone showing understanding and support.",
    position: { x: 1, y: 1 },
    icon: "❤️",
  },
];
