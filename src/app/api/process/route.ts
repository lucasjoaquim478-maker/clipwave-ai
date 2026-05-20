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

    const videoInfo = await getVideoInfo(url);

    const rawTranscript = await transcribeAudio("", "pt");
    const captions = generateCaptionsWithEmojis(rawTranscript);

    const moments = detectViralMoments(rawTranscript, videoInfo.duration);

    const clips: Clip[] = [];

    for (let i = 0; i < Math.min(moments.length, 5); i++) {
      const moment = moments[i];
      const segStart = moment.start;
      const segEnd = Math.min(moment.end, segStart + 45);
      const clipDuration = segEnd - segStart;

      const segCaptions = captions
        .filter((c) => c.start >= segStart && c.end <= segEnd)
        .map((c, idx) => ({
          id: `clip_${i}_cap_${idx}`,
          start: c.start - segStart,
          end: c.end - segStart,
          text: c.text,
        }));

      const titles = generateClipTitles(segCaptions.map((c) => c.text).join(" "));
      const emojis = suggestEmojis(segCaptions.map((c) => c.text).join(" "));

      clips.push({
        id: `clip_${i}`,
        videoId: videoInfo.videoId,
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
    }

    calculateViralScore(moments, videoInfo.duration);

    const job: ProcessingJob = {
      id: `job_${Date.now()}`,
      url,
      status: "complete",
      progress: 100,
      videoInfo,
      clips,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ job });
  } catch (e: any) {
    return NextResponse.json({
      job: {
        id: `job_${Date.now()}`,
        url: "",
        status: "error",
        progress: 0,
        error: e.message,
        createdAt: new Date().toISOString(),
      } as ProcessingJob,
    });
  }
}
