"use client";

import { useEffect, useState } from "react";
import { Redo, RotateCw, Undo } from "lucide-react";
import { Button } from "./ui/button";
import { TooltipWrapper } from "./TooltipWrapper";
import { useToneStore } from "@/store/useToneStore";

const ControlPannel = () => {
  const [modifierKey, setModifierKey] = useState("Ctrl");

  const canUndo = useToneStore((state) => state.currentRevisionIndex > 0);
  const canRedo = useToneStore(
    (state) => state.currentRevisionIndex < state.revisions.length - 1,
  );
  const undo = useToneStore((state) => state.undo);
  const redo = useToneStore((state) => state.redo);
  const reset = useToneStore((state) => state.reset);

  useEffect(() => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    setModifierKey(isMac ? "⌘" : "Ctrl");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const modifierKeyPressed = isMac ? event.metaKey : event.ctrlKey;

      if (modifierKeyPressed && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo]);

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex items-center gap-2 justify-center text-muted-foreground">
      <TooltipWrapper content={`Undo (${modifierKey}+Z)`}>
        <Button
          disabled={!canUndo}
          onClick={() => undo()}
          size={"icon"}
          variant={"outline"}
        >
          <Undo />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content={`Reset (${modifierKey}+R)`}>
        <Button onClick={handleReset} size={"icon"} variant={"outline"}>
          <RotateCw />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content={`Redo (${modifierKey}+Shift+Z)`}>
        <Button
          disabled={!canRedo}
          onClick={() => redo()}
          size={"icon"}
          variant={"outline"}
        >
          <Redo />
        </Button>
      </TooltipWrapper>
    </div>
  );
};

export default ControlPannel;
