import ytdl from "@distube/ytdl-core";
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
}

export async function ensureDirectories() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
}

export async function getVideoInfo(url: string): Promise<YouTubeInfo> {
  const info = await ytdl.getInfo(url);
  const format = info.formats.find((f) => f.hasVideo && f.hasAudio) || info.formats[0];
  return {
    title: info.videoDetails.title,
    duration: Number(info.videoDetails.lengthSeconds),
    thumbnail: info.videoDetails.thumbnails?.[0]?.url || "",
    channel: info.videoDetails.author?.name || info.videoDetails.ownerChannelName || "Unknown",
    format: "mp4",
    resolution: format ? `${format.width || 1920}x${format.height || 1080}` : "1920x1080",
  };
}

export async function downloadVideo(url: string): Promise<string> {
  await ensureDirectories();
  const timestamp = Date.now();
  const outputPath = path.join(OUTPUT_DIR, `video_${timestamp}.mp4`);

  return new Promise(async (resolve, reject) => {
    try {
      const info = await ytdl.getInfo(url);
      const format = info.formats
        .filter((f) => f.hasVideo && f.hasAudio)
        .sort((a, b) => (b.height || 0) - (a.height || 0))
        .find((f) => (f.height || 0) <= 1080) || info.formats
        .filter((f) => f.hasVideo)
        .sort((a, b) => (b.height || 0) - (a.height || 0))[0];

      const stream = ytdl(url, { format });
      const writeStream = fs.createWriteStream(outputPath);

      stream.pipe(writeStream);
      writeStream.on("finish", () => resolve(outputPath));
      writeStream.on("error", reject);
      stream.on("error", reject);
    } catch (e) {
      reject(e);
    }
  });
}

export async function downloadAudio(url: string): Promise<string> {
  await ensureDirectories();
  const timestamp = Date.now();
  const outputPath = path.join(OUTPUT_DIR, `audio_${timestamp}.mp3`);

  return new Promise(async (resolve, reject) => {
    try {
      const stream = ytdl(url, { filter: "audioonly", quality: "lowestaudio" });
      const writeStream = fs.createWriteStream(outputPath);
      stream.pipe(writeStream);
      writeStream.on("finish", () => resolve(outputPath));
      writeStream.on("error", reject);
      stream.on("error", reject);
    } catch (e) {
      reject(e);
    }
  });
}

export function cleanupFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {}
}
