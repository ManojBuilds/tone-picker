export interface ToneConfig {
  id: string;
  label: string;
  description: string;
  prompt: string;
  icon?: string;
}

export interface TextRevision {
  id: string;
  content: string;
  tone: ToneConfig | null;
  knobIndex: number;
}

export interface ToneRequest {
  text: string;
  tone: ToneConfig;
}

export interface AppState {
  currentText: string;
  knobIndex: number;
  // History for undo and redo
  revisions: TextRevision[];
  currentRevisionIndex: number;

  isLoading: boolean;
  selectedTone: ToneConfig | null;
  error: string | null;
  isBottomBarVisible: boolean;
  isStopped: boolean;
}
