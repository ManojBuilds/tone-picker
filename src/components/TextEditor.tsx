// src/components/TextEditor.tsx

"use client";

import { useToneStore } from "@/store/useToneStore";
import { Loader2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
// import LoadingSpinner from './ui/LoadingSpinner';

export default function TextEditor() {
  const currentText = useToneStore((state) => state.currentText);
  const updateText = useToneStore((state) => state.updateText);
  const isLoading = useToneStore((state) => state.isLoading);
  const selectedTone = useToneStore((state) => state.selectedTone);
  const revisions = useToneStore((state) => state.revisions);
  console.log("Revisions:", revisions);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    updateText(newText);
  };

  return (
    <div className="relative">
      <Textarea
        id="text-editor"
        value={currentText}
        onChange={handleTextChange}
        placeholder="Type your text here..."
        disabled={isLoading}
        className={`
            w-full min-h-64 p-4 border rounded-lg resize-none
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            ${selectedTone ? "border-blue-300 bg-blue-50" : "border-gray-300"}
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
          `}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="ml-2 text-muted-foreground">
            Applying {selectedTone?.label} tone...
          </span>
        </div>
      )}
    </div>
  );
}
