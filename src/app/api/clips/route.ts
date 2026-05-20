import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clipId = req.nextUrl.searchParams.get("clipId");
  return NextResponse.json({
    message: "Download disponível apenas ao rodar em um servidor com FFmpeg instalado (VPS)",
    clipId,
    solucao: "Implante em um VPS e configure as variáveis de ambiente para habilitar o processamento real.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { clipId, platform } = await req.json();
    return NextResponse.json({
      success: true,
      message: `Clip ${clipId} preparado para exportação no ${platform}.`,
      downloadUrl: null,
      observacao: "O processamento real de vídeo requer um servidor VPS com yt-dlp, FFmpeg e Whisper instalados.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
