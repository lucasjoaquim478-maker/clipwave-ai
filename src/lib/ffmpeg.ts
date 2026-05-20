import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";

const execAsync = promisify(exec);
const OUTPUT_DIR = path.join(os.tmpdir(), "clipwave", "clips");

export async function ensureDirs() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
}

export interface ClipConfig {
  inputPath: string;
  startTime: number;
  endTime: number;
  outputName: string;
  zoomTarget?: { x: number; y: number; scale: number };
}

function getFfmpegPath(): string {
  try {
    return require("@ffmpeg-installer/ffmpeg").path;
  } catch {
    return "ffmpeg";
  }
}

function getFfprobePath(): string {
  try {
    return require("@ffmpeg-installer/ffmpeg").path.replace("ffmpeg", "ffprobe");
  } catch {
    return "ffprobe";
  }
}

export async function getVideoDimensions(inputPath: string): Promise<{ width: number; height: number }> {
  const ffprobe = getFfprobePath();
  const { stdout } = await execAsync(
    `"${ffprobe}" -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${inputPath}"`,
    { timeout: 15000 }
  );
  const [width, height] = stdout.trim().split("x").map(Number);
  return { width: width || 1920, height: height || 1080 };
}

export async function createVerticalClip(config: ClipConfig): Promise<string> {
  await ensureDirs();
  const ffmpeg = getFfmpegPath();
  const outputPath = path.join(OUTPUT_DIR, `${config.outputName}.mp4`);
  const duration = config.endTime - config.startTime;

  const dims = await getVideoDimensions(config.inputPath);
  const targetWidth = 1080;
  const targetHeight = 1920;
  const cropSize = Math.min(dims.width, dims.height);
  const scale = config.zoomTarget?.scale || 1;
  const cx = config.zoomTarget?.x ?? dims.width / 2;
  const cy = config.zoomTarget?.y ?? dims.height / 2;

  const cropW = cropSize / scale;
  const cropH = cropSize / scale;
  const cropX = Math.max(0, Math.min(cx - cropW / 2, dims.width - cropW));
  const cropY = Math.max(0, Math.min(cy - cropH / 2, dims.height - cropH));

  const filter = `crop=${cropW}:${cropH}:${cropX}:${cropY},scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2`;

  const cmd = `"${ffmpeg}" -ss ${config.startTime} -i "${config.inputPath}" -t ${Math.min(duration, 60)} -vf "${filter}" -c:v libx264 -preset ultrafast -crf 28 -c:a aac -b:a 64k -y "${outputPath}"`;

  await execAsync(cmd, { timeout: 60000 });
  return outputPath;
}

export async function extractThumbnail(videoPath: string, timeSeconds: number, outputName: string): Promise<string> {
  await ensureDirs();
  const ffmpeg = getFfmpegPath();
  const outputPath = path.join(OUTPUT_DIR, `${outputName}_thumb.jpg`);
  await execAsync(
    `"${ffmpeg}" -ss ${timeSeconds} -i "${videoPath}" -vframes 1 -q:v 3 -y "${outputPath}"`,
    { timeout: 15000 }
  );
  return outputPath;
}

export function cleanupFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {}
}
