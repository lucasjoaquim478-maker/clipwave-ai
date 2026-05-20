import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";

const CLIPS_DIR = path.join(os.tmpdir(), "clipwave", "clips");

export async function GET(req: NextRequest) {
  const clipId = req.nextUrl.searchParams.get("clipId");
  const platform = req.nextUrl.searchParams.get("platform") || "mp4";

  if (!clipId) {
    return NextResponse.json({ error: "clipId é obrigatório" }, { status: 400 });
  }

  const patterns = [
    `${clipId}.mp4`,
    `${clipId}_captioned.mp4`,
    `export_${platform}_${clipId}_captioned.mp4`,
    `export_${platform}_${clipId}.mp4`,
  ];

  for (const pattern of patterns) {
    const filePath = path.join(CLIPS_DIR, pattern);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": `attachment; filename="${clipId}_${platform}.mp4"`,
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "no-cache",
        },
      });
    }
  }

  return NextResponse.json({ error: "Clip não encontrado ou ainda processando" }, { status: 404 });
}

export async function POST(req: NextRequest) {
  try {
    const { clipId, platform } = await req.json();
    if (!clipId || !platform) {
      return NextResponse.json({ error: "clipId e platform são obrigatórios" }, { status: 400 });
    }

    const sourcePath = path.join(CLIPS_DIR, `${clipId}_captioned.mp4`);
    const exportPath = path.join(CLIPS_DIR, `export_${platform}_${clipId}_captioned.mp4`);

    if (!fs.existsSync(sourcePath)) {
      return NextResponse.json({ error: "Clip fonte não encontrado" }, { status: 404 });
    }

    fs.copyFileSync(sourcePath, exportPath);

    return NextResponse.json({
      success: true,
      message: `Clip exportado para ${platform}`,
      downloadUrl: `/api/clips?clipId=${clipId}&platform=${platform}`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
