"use client";

import { useToneStore } from "@/store/useToneStore";
import { TONE_CONFIGS } from "@/constants/tones";
import { ToneConfig } from "@/types";
import { Button } from "./ui/button";

export default function ToneMatrix() {
  const applyTone = useToneStore((state) => state.applyTone);
  const selectedTone = useToneStore((state) => state.selectedTone);
  const isLoading = useToneStore((state) => state.isLoading);
  const currentText = useToneStore((state) => state.currentText);

  const handleToneClick = async (tone: ToneConfig) => {
    if (!currentText.trim()) return;
    await applyTone(tone);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {TONE_CONFIGS.map((tone) => (
        <Button
          key={tone.id}
          onClick={() => handleToneClick(tone)}
          disabled={isLoading || !currentText.trim()}
          variant={selectedTone?.id === tone.id ? "secondary" : "outline"}
          className="min-h-24 flex flex-col items-center justify-center"
        >
          <span className="font-medium">{tone.icon}</span>
          <span className="text-muted-foreground mt-1 text-center font-semibold">
            {tone.label}
          </span>
        </Button>
      ))}
    </div>
  );
}
