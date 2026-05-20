export interface ProcessingJob {
  id: string;
  url: string;
  status: "queued" | "downloading" | "analyzing" | "processing" | "transcribing" | "rendering" | "complete" | "error";
  progress: number;
  error?: string;
  createdAt: string;
  videoInfo?: VideoInfo;
  clips?: Clip[];
}

export interface VideoInfo {
  title: string;
  duration: number;
  thumbnail: string;
  channel: string;
  format: string;
  resolution: string;
}

export interface Clip {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  title: string;
  viralScore: number;
  description: string;
  thumbnail: string | null;
  captions: Caption[];
  exportFormats: ExportFormat[];
  emojis: string[];
  zoomTarget: { x: number; y: number; scale: number } | null;
}

export interface Caption {
  id: string;
  start: number;
  end: number;
  text: string;
  translatedText?: string;
}

export interface ExportFormat {
  platform: "tiktok" | "reels" | "shorts";
  url?: string;
  status: "pending" | "ready" | "exported";
}

export interface ViralMoment {
  start: number;
  end: number;
  score: number;
  reason: string;
  type: "emotional" | "funny" | "exciting" | "surprising" | "educational";
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface ProcessingProgress {
  stage: "downloading" | "analyzing" | "processing" | "transcribing" | "rendering";
  progress: number;
  message: string;
}
