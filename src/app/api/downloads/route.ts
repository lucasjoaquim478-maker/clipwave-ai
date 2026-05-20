import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";

const CLIPS_DIR = path.join(os.tmpdir(), "clipwave", "clips");
const DOWNLOADS_DIR = path.join(os.tmpdir(), "clipwave", "downloads");

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");
  if (!file) {
    return NextResponse.json({ error: "Arquivo não especificado" }, { status: 400 });
  }

  const safeName = path.basename(file);
  const paths = [
    path.join(CLIPS_DIR, safeName),
    path.join(DOWNLOADS_DIR, safeName),
  ];

  for (const filePath of paths) {
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeMap: Record<string, string> = {
        ".mp4": "video/mp4",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".srt": "text/plain",
        ".json": "application/json",
      };

      const buffer = fs.readFileSync(filePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mimeMap[ext] || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${safeName}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }
  }

  return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
}
