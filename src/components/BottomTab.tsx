"use client";

import { useToneStore } from "@/store/useToneStore";
import { Check, Loader2, Square, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { motion } from "motion/react";

const BottomTab = () => {
  const isLoading = useToneStore((state) => state.isLoading);
  const currentText = useToneStore((state) => state.currentText);
  const selectedTone = useToneStore((state) => state.selectedTone);

  const resetAll = useToneStore((state) => state.resetAll);
  const applyTone = useToneStore((state) => state.applyTone);

  const isBottomBarVisible = useToneStore((state) => state.isBottomBarVisible);
  const hideBottomBar = useToneStore((state) => state.hideBottomBar);
  const stop = useToneStore((state) => state.stop);
  const error = useToneStore((state) => state.error);

  const handleTryAgain = () => {
    if (selectedTone) {
      applyTone(selectedTone);
    }
  };

  const handleDone = () => {
    navigator.clipboard.writeText(currentText);
    toast.success("Copied to clipboard");
    resetAll();
  };

  if (
    !isBottomBarVisible ||
    (!isLoading && !error && (!currentText || !selectedTone))
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{
        y: 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-2xl shadow-sm bg-background w-fit"
    >
      {isLoading && (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="flex-1">Adjusting tone... </p>
          <Button variant={"destructive"} onClick={stop}>
            <Square fill="white" />
            Stop
          </Button>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2">
          <p className="flex-1 text-red-500 text-wrap sm:text-nowrap">
            {error}
          </p>
          <Button variant={"outline"} onClick={handleTryAgain}>
            Try again
          </Button>
          <Button variant={"ghost"} onClick={hideBottomBar}>
            <X />
          </Button>
        </div>
      )}
      {!isLoading && !error && currentText && selectedTone && (
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} className="flex-1" onClick={handleDone}>
            <Check />
            Done!
          </Button>
          <Button variant={"outline"} onClick={handleTryAgain}>
            Try again
          </Button>
          <Button variant={"ghost"} onClick={hideBottomBar}>
            <X />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default BottomTab;
