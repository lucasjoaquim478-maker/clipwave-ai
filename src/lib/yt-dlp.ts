import fs from "fs";
import path from "path";
import os from "os";

const OUTPUT_DIR = path.join(os.tmpdir(), "clipwave", "downloads");

export interface YouTubeInfo {
  title: string;
  duration: number;
  thumbnail: string;
  channel: string;
  format: string;
  resolution: string;
  videoId: string;
}

function extractVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || "";
}

export async function ensureDirectories() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
}

export async function getVideoInfo(url: string): Promise<YouTubeInfo> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("URL do YouTube inválida");

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY não configurada");

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
  );
  const data = await res.json();

  if (!data.items?.[0]) throw new Error("Vídeo não encontrado");

  const item = data.items[0];
  const duration = parseDuration(item.contentDetails.duration);

  return {
    title: item.snippet.title,
    duration,
    thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || "",
    channel: item.snippet.channelTitle,
    format: "mp4",
    resolution: "1920x1080",
    videoId,
  };
}

export async function downloadVideo(_url: string): Promise<string> {
  await ensureDirectories();
  const path = `${OUTPUT_DIR}/demo_video.mp4`;
  if (!fs.existsSync(path)) fs.writeFileSync(path, "");
  return path;
}

export async function downloadAudio(_url: string): Promise<string> {
  await ensureDirectories();
  const path = `${OUTPUT_DIR}/demo_audio.mp3`;
  if (!fs.existsSync(path)) fs.writeFileSync(path, "");
  return path;
}

export function cleanupFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {}
}

function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  return hours * 3600 + minutes * 60 + seconds;
}
