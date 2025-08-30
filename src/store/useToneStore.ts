import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ToneConfig, TextRevision, AppState } from "@/types";

interface ToneStoreActions {
  // Text operations
  updateText: (text: string) => void;
  applyTone: (tone: ToneConfig) => Promise<void>;

  updateKnobIndex: (index: number) => void;

  // History operations
  addRevision: (content: string, tone: ToneConfig | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
  resetAll: () => void;

  // UI state operations
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTone: (tone: ToneConfig | null) => void;
  hideBottomBar: () => void;
  stop: () => void;
}

type ToneStore = AppState & ToneStoreActions;

export const useToneStore = create<ToneStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentText: "",
      knobIndex: 4, // 4 is the center index 3x3 grid
      revisions: [],
      currentRevisionIndex: -1,
      isLoading: false,
      selectedTone: null,
      error: null,
      isBottomBarVisible: true,
      isStopped: false,

      // Text operations
      updateText: (text: string) => {
        set({ currentText: text, error: null });
      },
      updateKnobIndex: (index: number) => {
        set({ knobIndex: index });
      },
      applyTone: async (tone: ToneConfig) => {
        const state = get();

        const isFirstGo = state.revisions.length === 0;
        const textToConvert = isFirstGo
          ? state.currentText
          : state.revisions[0].content;

        if (!textToConvert.trim()) {
          return;
        }

        set({
          isLoading: true,
          selectedTone: tone,
          error: null,
          isStopped: false,
          isBottomBarVisible: true,
        });

        try {
          const response = await fetch("/api/tone", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: textToConvert,
              tone: tone,
            }),
          });

          if (get().isStopped) {
            return;
          }

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to apply tone");
          }

          if (isFirstGo) {
            const initialRevision: TextRevision = {
              id: `revision-${Date.now()}-initial`,
              content: textToConvert,
              tone: null,
              knobIndex: 4,
            };
            const newRevision: TextRevision = {
              id: `revision-${Date.now()}`,
              content: result.content,
              tone,
              knobIndex: state.knobIndex,
            };
            set({
              revisions: [initialRevision, newRevision],
              currentRevisionIndex: 1,
              currentText: result.content,
              isLoading: false,
              selectedTone: tone,
            });
          } else {
            get().addRevision(result.content, tone);
          }
        } catch (error) {
          if (!get().isStopped) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
              isLoading: false,
            });
          }
        }
      },

      addRevision: (content: string, tone: ToneConfig | null) => {
        const state = get();
        const newRevision: TextRevision = {
          id: `revision-${Date.now()}`,
          content,
          tone,
          knobIndex: state.knobIndex,
        };

        const newRevisions = [
          ...state.revisions.slice(0, state.currentRevisionIndex + 1),
          newRevision,
        ];

        set({
          currentText: content,
          revisions: newRevisions,
          currentRevisionIndex: newRevisions.length - 1,
          isLoading: false,
          selectedTone: tone,
        });
      },

      undo: () => {
        const state = get();
        if (state.canUndo()) {
          const newIndex = state.currentRevisionIndex - 1;
          const revision = state.revisions[newIndex];
          set({
            currentText: revision.content,
            currentRevisionIndex: newIndex,
            selectedTone: revision.tone,
            knobIndex: revision.knobIndex,
            error: null,
          });
        }
      },

      redo: () => {
        const state = get();
        if (state.canRedo()) {
          const newIndex = state.currentRevisionIndex + 1;
          const revision = state.revisions[newIndex];
          set({
            currentText: revision.content,
            currentRevisionIndex: newIndex,
            selectedTone: revision.tone,
            knobIndex: revision.knobIndex,
            error: null,
          });
        }
      },

      canUndo: () => get().currentRevisionIndex > 0,
      canRedo: () => get().currentRevisionIndex < get().revisions.length - 1,

      reset: () => {
        const state = get();
        if (state.revisions.length > 0) {
          const originalRevision = state.revisions[0];
          set({
            currentText: originalRevision.content,
            currentRevisionIndex: 0,
            selectedTone: null,
            error: null,
            knobIndex: 4,
          });
        }
      },

      resetAll: () => {
        set({
          currentText: "",
          revisions: [],
          currentRevisionIndex: -1,
          isLoading: false,
          selectedTone: null,
          error: null,
          isBottomBarVisible: true,
          isStopped: false,
          knobIndex: 4,
        });
      },

      // UI operations
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setSelectedTone: (tone: ToneConfig | null) => set({ selectedTone: tone }),
      hideBottomBar: () => set({ isBottomBarVisible: false }),
      stop: () => set({ isLoading: false, isStopped: true }),
    }),
    {
      name: "tone-store",
      partialize: (state) => ({
        currentText: state.currentText,
        revisions: state.revisions,
        currentRevisionIndex: state.currentRevisionIndex,
      }),
    },
  ),
);
