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
  addCaptions?: boolean;
  captionFile?: string;
  zoomTarget?: { x: number; y: number; scale: number };
}

export async function getVideoDimensions(inputPath: string): Promise<{ width: number; height: number }> {
  const { stdout } = await execAsync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${inputPath}"`,
    { timeout: 10000 }
  );
  const [width, height] = stdout.trim().split("x").map(Number);
  return { width, height };
}

export async function createVerticalClip(config: ClipConfig): Promise<string> {
  await ensureDirs();
  const outputPath = path.join(OUTPUT_DIR, `${config.outputName}.mp4`);
  const duration = config.endTime - config.startTime;

  const dims = await getVideoDimensions(config.inputPath);
  const targetWidth = 1080;
  const targetHeight = 1920;
  const cropSize = Math.min(dims.width, dims.height);
  const cropX = config.zoomTarget
    ? Math.max(0, Math.min(config.zoomTarget.x - cropSize / 2 / config.zoomTarget.scale, dims.width - cropSize / config.zoomTarget.scale))
    : (dims.width - cropSize) / 2;
  const cropY = config.zoomTarget
    ? Math.max(0, Math.min(config.zoomTarget.y - cropSize / 2 / config.zoomTarget.scale, dims.height - cropSize / config.zoomTarget.scale))
    : (dims.height - cropSize) / 2;
  const scale = config.zoomTarget?.scale || 1;

  const filter = `[0:v]crop=${cropSize / scale}:${cropSize / scale}:${cropX}:${cropY},scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=increase,crop=${targetWidth}:${targetHeight}[v]`;

  const cmd = [
    `ffmpeg -ss ${config.startTime} -i "${config.inputPath}"`,
    `-t ${duration}`,
    `-filter_complex "${filter}"`,
    `-map "[v]" -map 0:a?`,
    `-c:v libx264 -preset fast -crf 22`,
    `-c:a aac -b:a 128k`,
    `-y "${outputPath}"`,
  ].join(" ");

  await execAsync(cmd, { timeout: 120000, maxBuffer: 1024 * 1024 * 100 });
  return outputPath;
}

export async function addCaptionsToClip(
  videoPath: string,
  captions: { start: number; end: number; text: string }[],
  outputName: string
): Promise<string> {
  await ensureDirs();
  const outputPath = path.join(OUTPUT_DIR, `${outputName}_captioned.mp4`);
  const srtPath = path.join(OUTPUT_DIR, `${outputName}.srt`);

  const srtContent = captions
    .map((c, i) => {
      const fmt = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${sec.toFixed(3).replace(".", ",")}`;
      };
      return `${i + 1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text}\n`;
    })
    .join("\n");

  fs.writeFileSync(srtPath, srtContent, "utf-8");

  const cmd = [
    `ffmpeg -i "${videoPath}"`,
    `-vf "subtitles='${srtPath}':fontsdir=/usr/share/fonts:force_style='FontName=Inter,FontSize=18,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=1,Shadow=0,Alignment=2,MarginV=40'"`,
    `-c:a copy`,
    `-y "${outputPath}"`,
  ].join(" ");

  await execAsync(cmd, { timeout: 60000 });
  return outputPath;
}

export async function extractThumbnail(
  videoPath: string,
  timeSeconds: number,
  outputName: string
): Promise<string> {
  await ensureDirs();
  const outputPath = path.join(OUTPUT_DIR, `${outputName}_thumb.jpg`);
  await execAsync(
    `ffmpeg -ss ${timeSeconds} -i "${videoPath}" -vframes 1 -q:v 3 -y "${outputPath}"`,
    { timeout: 15000 }
  );
  return outputPath;
}

export function cleanupFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {}
}
