"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { useToneStore } from "@/store/useToneStore";
import { ToneConfig } from "@/types";

export default function ToneAdjuster() {
  const applyTone = useToneStore((state) => state.applyTone);
  const reset = useToneStore((state) => state.reset);
  const knobIndex = useToneStore((state) => state.knobIndex);
  const updateKnobIndex = useToneStore((state) => state.updateKnobIndex);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const getSnapPoint = (index: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const { width, height } = containerRef.current.getBoundingClientRect();
    const cellWidth = width / 3;
    const cellHeight = height / 3;
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      x: col * cellWidth + cellWidth / 2,
      y: row * cellHeight + cellHeight / 2,
    };
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      setKnobPosition(getSnapPoint(knobIndex));
    }
  }, [knobIndex]);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    if (!containerRef.current) return;

    const { width, height, left, top } =
      containerRef.current.getBoundingClientRect();
    const cellWidth = width / 3;
    const cellHeight = height / 3;

    const x = info.point.x - left;
    const y = info.point.y - top;

    const col = Math.min(2, Math.max(0, Math.floor(x / cellWidth)));
    const row = Math.min(2, Math.max(0, Math.floor(y / cellHeight)));

    const index = row * 3 + col;
    updateKnobIndex(index);

    const highlightedTones = getHighlightedTones(index);

    if (highlightedTones.length > 0) {
      const isSingleTone = highlightedTones.length === 1;
      const toneLabel = highlightedTones.join(" and ");

      const newToneConfig: ToneConfig = {
        id: highlightedTones.join("-").toLowerCase(),
        label: highlightedTones.join(", "),
        description: isSingleTone
          ? `A ${toneLabel} tone.`
          : `A combination of ${toneLabel} tones.`,
        prompt: `Rewrite this text to be more ${toneLabel}.`,
        icon: "⚙️",
      };
      applyTone(newToneConfig);
    }
  };

  const renderTone = (index: number) => {
    switch (index) {
      case 1:
        return "Professional";
      case 3:
        return "Concise";
      case 5:
        return "Expanded";
      case 7:
        return "Casual";
      default:
        return "";
    }
  };

  const getHighlightedTones = (index: number) => {
    const highlights = [];
    const row = Math.floor(index / 3);
    const col = index % 3;

    if (row === 0) {
      highlights.push("Professional");
    } else if (row === 2) {
      highlights.push("Casual");
    }

    if (col === 0) {
      highlights.push("Concise");
    } else if (col === 2) {
      highlights.push("Expanded");
    }

    return highlights;
  };

  const highlightedTones = getHighlightedTones(knobIndex);
  const isKnobNotAtCenter = knobIndex !== 4;

  const handleReset = () => {
    reset();
  };

  return (
    <div ref={containerRef} className="w-full aspect-square relative">
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-gray-100 rounded-lg overflow-hidden">
        {new Array(9).fill(null).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-full aspect-square bg-gray-50 border border-gray-100 text-sm flex items-center justify-center p-2",
              {
                "items-start": index === 1,
                "items-end": index === 7,
                "-rotate-90 items-start": index === 3,
                "rotate-90 items-start": index === 5,
              },
            )}
          >
            {index === 4 &&
              (isKnobNotAtCenter && !isDragging ? (
                <RotateCw
                  className="w-5 h-5 text-muted-foreground cursor-pointer"
                  onClick={handleReset}
                />
              ) : null)}
            <span
              className={cn(
                "text-muted-foreground transition-colors duration-300",
                {
                  "text-primary font-bold": highlightedTones.includes(
                    renderTone(index),
                  ),
                },
              )}
            >
              {renderTone(index)}
            </span>
          </div>
        ))}
      </div>

      {knobPosition && (
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="w-8 h-8 bg-primary rounded-full border-4 border-white absolute cursor-grab active:cursor-grabbing shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
          style={{
            top: 0,
            left: 0,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{
            x: knobPosition.x,
            y: knobPosition.y,
          }}
          animate={{
            x: knobPosition.x,
            y: knobPosition.y,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
    </div>
  );
}
