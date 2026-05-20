import { NextRequest, NextResponse } from "next/server";
import { getVideoInfo, downloadVideo, downloadAudio, cleanupFile } from "@/lib/yt-dlp";
import { transcribeAudio, generateCaptionsWithEmojis } from "@/lib/whisper";
import {
  detectViralMoments,
  generateClipTitles,
  suggestEmojis,
  calculateViralScore,
} from "@/lib/viral-detection";
import { createVerticalClip, extractThumbnail } from "@/lib/ffmpeg";
import type { ProcessingJob, Clip, Caption } from "@/lib/types";
import path from "path";
import os from "os";
import fs from "fs";

const jobs = new Map<string, ProcessingJob>();
const OUTPUT_DIR = path.join(os.tmpdir(), "clipwave", "clips");

function generateId(): string {
  return `clip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: NextRequest) {
  try {
    const { url, recaptchaToken } = await req.json();
    if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
      return NextResponse.json({ error: "URL do YouTube inválida" }, { status: 400 });
    }

    const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });
    const recaptchaData = await recaptchaRes.json();
    if (!recaptchaData.success) {
      return NextResponse.json({ error: "Verificação anti-bot falhou. Tente novamente." }, { status: 403 });
    }

    const jobId = generateId();
    const job: ProcessingJob = {
      id: jobId,
      url,
      status: "queued",
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    jobs.set(jobId, job);

    processJob(jobId, url).catch((err) => {
      const j = jobs.get(jobId);
      if (j) {
        j.status = "error";
        j.error = err.message;
        j.progress = 0;
      }
    });

    return NextResponse.json({ jobId, status: "queued" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId || !jobs.has(jobId)) {
    return NextResponse.json({ error: "Job não encontrado" }, { status: 404 });
  }
  return NextResponse.json(jobs.get(jobId));
}

async function processJob(jobId: string, url: string) {
  const job = jobs.get(jobId)!;
  let videoPath: string | null = null;
  let audioPath: string | null = null;

  try {
    job.status = "analyzing";
    job.progress = 5;
    const videoInfo = await getVideoInfo(url);
    job.videoInfo = videoInfo;
    jobs.set(jobId, job);

    job.status = "downloading";
    job.progress = 15;
    jobs.set(jobId, job);
    videoPath = await downloadVideo(url);

    job.progress = 35;
    jobs.set(jobId, job);
    audioPath = await downloadAudio(url);

    job.status = "transcribing";
    job.progress = 50;
    jobs.set(jobId, job);
    const rawTranscript = await transcribeAudio(audioPath, "pt");
    const captions = generateCaptionsWithEmojis(rawTranscript);

    job.status = "processing";
    job.progress = 65;
    jobs.set(jobId, job);
    const moments = detectViralMoments(rawTranscript, videoInfo.duration);

    job.progress = 75;
    jobs.set(jobId, job);
    const clips: Clip[] = [];

    for (let i = 0; i < Math.min(moments.length, 5); i++) {
      const moment = moments[i];
      const clipId = `${jobId}_${i}`;
      const segStart = moment.start;
      const segEnd = Math.min(moment.end, segStart + 45);
      const clipDuration = segEnd - segStart;

      const segCaptions = captions
        .filter((c) => c.start >= segStart && c.end <= segEnd)
        .map((c, idx) => ({
          id: `${clipId}_cap_${idx}`,
          start: c.start - segStart,
          end: c.end - segStart,
          text: c.text,
        }));

      const titles = generateClipTitles(segCaptions.map((c) => c.text).join(" "));
      const emojis = suggestEmojis(segCaptions.map((c) => c.text).join(" "));

      let clipVideoPath: string | null = null;
      let clipCaptionedPath: string | null = null;
      let thumbnailPath: string | null = null;

      try {
        clipVideoPath = await createVerticalClip({
          inputPath: videoPath!,
          startTime: segStart,
          endTime: segEnd,
          outputName: clipId,
          zoomTarget: { x: 0, y: 0, scale: 1.0 },
        });

        clipCaptionedPath = clipVideoPath;

        thumbnailPath = await extractThumbnail(videoPath!, segStart + 1, clipId);
      } catch (clipErr) {
        console.warn(`Clip ${i} processing error, continuing:`, clipErr);
      }

      clips.push({
        id: clipId,
        startTime: segStart,
        endTime: segEnd,
        duration: clipDuration,
        title: titles[i % titles.length],
        viralScore: moment.score,
        description: `Momento ${moment.type} detectado: ${moment.reason}`,
        thumbnail: thumbnailPath
          ? `/api/downloads?file=${encodeURIComponent(path.basename(thumbnailPath))}`
          : null,
        captions: segCaptions,
        exportFormats: [
          { platform: "tiktok", status: clipCaptionedPath ? exportToPlatform(clipCaptionedPath, "tiktok") : "pending" },
          { platform: "reels", status: "pending" },
          { platform: "shorts", status: "pending" },
        ],
        emojis,
        zoomTarget: { x: 0, y: 0, scale: 1.0 },
      });

      if (i === 0) cleanupFile(clipVideoPath || "");
      if (i === 0) cleanupFile(clipCaptionedPath || "");

      job.progress = 75 + Math.round(((i + 1) / Math.min(moments.length, 5)) * 20);
      jobs.set(jobId, job);
    }

    const overallScore = calculateViralScore(moments, videoInfo.duration);

    job.status = "complete";
    job.progress = 100;
    job.clips = clips;
    jobs.set(jobId, job);

  } catch (err: any) {
    job.status = "error";
    job.error = err.message;
    job.progress = 0;
    jobs.set(jobId, job);
  } finally {
    if (videoPath) cleanupFile(videoPath);
    if (audioPath) cleanupFile(audioPath);
  }
}

function exportToPlatform(videoPath: string, platform: string): "pending" | "ready" {
  try {
    const exportPath = path.join(OUTPUT_DIR, `export_${platform}_${path.basename(videoPath)}`);
    if (fs.existsSync(videoPath)) {
      fs.copyFileSync(videoPath, exportPath);
      return "ready";
    }
    return "pending";
  } catch {
    return "pending";
  }
}
