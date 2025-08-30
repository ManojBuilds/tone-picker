"use client";

import { useToneStore } from "@/store/useToneStore";
import TextEditor from "@/components/TextEditor";
import ControlPannel from "@/components/ControlPannel";
import ToneMatrix from "@/components/ToneMatrix";
import BottomTab from "@/components/BottomTab";

export default function TonePickerApp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto sm:p-8 relative w-full min-w-0 rounded-2xl border p-3 border-opacity-[0.01] bg-clip-padding group bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <TextEditor />
            <ControlPannel />
          </div>

          <div>
            <ToneMatrix />
          </div>
        </div>
        <BottomTab />
      </div>
    </div>
  );
}
