import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
      return NextResponse.json({ error: "URL do YouTube inválida" }, { status: 400 });
    }

    const videoInfo = await getVideoInfo(url);
    const rawTranscript = await transcribeAudio("", "pt");
    const captions = generateCaptionsWithEmojis(rawTranscript);
    const moments = detectViralMoments(rawTranscript, videoInfo.duration);

    const clips: Clip[] = [];

    for (let i = 0; i < Math.min(moments.length, 5); i++) {
      const moment = moments[i];
      const clipDuration = Math.min(55, videoInfo.duration);
      const segStart = Math.max(0, moment.start - 5);
      const segEnd = Math.min(videoInfo.duration, segStart + clipDuration);

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
        duration: Math.round(segEnd - segStart),
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
