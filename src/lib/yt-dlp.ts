import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";

const execAsync = promisify(exec);

const OUTPUT_DIR = path.join(os.tmpdir(), "clipwave", "downloads");

export interface YouTubeInfo {
  title: string;
  duration: number;
  thumbnail: string;
  channel: string;
  format: string;
  resolution: string;
}

export async function ensureDirectories() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
}

export async function getVideoInfo(url: string): Promise<YouTubeInfo> {
  const { stdout } = await execAsync(
    `yt-dlp --dump-json --no-download "${url}"`,
    { timeout: 30000 }
  );
  const info = JSON.parse(stdout);
  return {
    title: info.title || "Untitled Video",
    duration: info.duration || 0,
    thumbnail: info.thumbnail || "",
    channel: info.channel || info.uploader || "Unknown",
    format: "mp4",
    resolution: `${info.width || 1920}x${info.height || 1080}`,
  };
}

export async function downloadVideo(
  url: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  await ensureDirectories();
  const timestamp = Date.now();
  const outputPath = path.join(OUTPUT_DIR, `video_${timestamp}.mp4`);

  const { stdout } = await execAsync(
    `yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" --merge-output-format mp4 -o "${outputPath}" "${url}" 2>&1`,
    { timeout: 300000, maxBuffer: 1024 * 1024 * 50 }
  );

  return outputPath;
}

export async function downloadAudio(url: string): Promise<string> {
  await ensureDirectories();
  const timestamp = Date.now();
  const outputPath = path.join(OUTPUT_DIR, `audio_${timestamp}.wav`);

  await execAsync(
    `yt-dlp -x --audio-format wav -o "${outputPath}" "${url}"`,
    { timeout: 300000 }
  );

  return outputPath;
}

export function cleanupFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {}
}
