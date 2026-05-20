import { NextRequest, NextResponse } from "next/server";
import { getVideoInfo } from "@/lib/yt-dlp";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    const info = await getVideoInfo(url);

    return NextResponse.json({
      title: info.title,
      duration: info.duration,
      thumbnail: info.thumbnail,
      channel: info.channel,
      format: info.format,
      resolution: info.resolution,
      durationFormatted: formatDuration(info.duration),
      estimatedClips: Math.min(Math.floor(info.duration / 120), 12),
    });
  } catch (e: any) {
    return NextResponse.json({ error: `Erro ao analisar vídeo: ${e.message}` }, { status: 500 });
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
