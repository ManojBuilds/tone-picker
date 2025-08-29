export interface ToneConfig {
  id: string;
  label: string;
  description: string;
  prompt: string;
  position: {
    x: 0 | 1;
    y: 0 | 1;
  };
  icon?: string;
}

export interface TextRevision {
  id: string;
  content: string;
  tone: ToneConfig | null;
}

export interface APIResponse {
  success: boolean;
  content?: string;
  error?: string;
  requestId?: string;
}

export interface ToneRequest {
  text: string;
  tone: ToneConfig;
}

export interface AppState {
  currentText: string;
  // History for undo and redo
  revisions: TextRevision[];
  currentRevisionIndex: number;

  isLoading: boolean;
  selectedTone: ToneConfig | null;
  error: string | null;
}
