import { NextRequest, NextResponse } from "next/server";
import { getVideoInfo } from "@/lib/yt-dlp";
import { transcribeAudio, generateCaptionsWithEmojis } from "@/lib/whisper";
import {
  detectViralMoments,
  generateClipTitles,
  suggestEmojis,
  calculateViralScore,
} from "@/lib/viral-detection";
import type { ProcessingJob, Clip } from "@/lib/types";

const jobs = new Map<string, ProcessingJob>();

function generateId(): string {
  return `clip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: NextRequest) {
  try {
    const { url, recaptchaToken } = await req.json();
    if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
      return NextResponse.json({ error: "URL do YouTube inválida" }, { status: 400 });
    }

    if (process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      });
      const recaptchaData = await recaptchaRes.json();
      if (!recaptchaData.success) {
        return NextResponse.json({ error: "Verificação anti-bot falhou. Tente novamente." }, { status: 403 });
      }
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

  try {
    job.status = "analyzing";
    job.progress = 5;
    jobs.set(jobId, job);

    const videoInfo = await getVideoInfo(url);
    job.videoInfo = videoInfo;
    jobs.set(jobId, job);

    await sleep(200);
    job.status = "transcribing";
    job.progress = 50;
    jobs.set(jobId, job);

    const rawTranscript = await transcribeAudio("", "pt");
    const captions = generateCaptionsWithEmojis(rawTranscript);
    await sleep(300);

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

      clips.push({
        id: clipId,
        startTime: segStart,
        endTime: segEnd,
        duration: clipDuration,
        title: titles[i % titles.length],
        viralScore: moment.score,
        description: `Momento ${moment.type} detectado: ${moment.reason}`,
        thumbnail: null,
        captions: segCaptions,
        exportFormats: [
          { platform: "tiktok", status: "pending" },
          { platform: "reels", status: "pending" },
          { platform: "shorts", status: "pending" },
        ],
        emojis,
        zoomTarget: { x: 0, y: 0, scale: 1.0 },
      });

      await sleep(200);
      job.progress = 75 + Math.round(((i + 1) / Math.min(moments.length, 5)) * 20);
      jobs.set(jobId, job);
    }

    calculateViralScore(moments, videoInfo.duration);

    job.status = "complete";
    job.progress = 100;
    job.clips = clips;
    jobs.set(jobId, job);

  } catch (err: any) {
    job.status = "error";
    job.error = err.message;
    job.progress = 0;
    jobs.set(jobId, job);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
