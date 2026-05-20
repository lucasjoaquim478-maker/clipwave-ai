import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";

const execAsync = promisify(exec);

function getFfmpegPath(): string {
  try {
    return require("@ffmpeg-installer/ffmpeg").path;
  } catch {
    return "ffmpeg";
  }
}

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId");
  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");

  if (!videoId || !start || !end) {
    return NextResponse.json({ error: "Parâmetros obrigatórios: videoId, start, end" }, { status: 400 });
  }

  const tmpDir = path.join(os.tmpdir(), "clipwave-dl");
  await fs.promises.mkdir(tmpDir, { recursive: true });
  const inputPath = path.join(tmpDir, `${videoId}.mp4`);
  const outputPath = path.join(tmpDir, `clip_${videoId}_${start}_${end}.mp4`);

  try {
    if (!fs.existsSync(inputPath)) {
      const { default: ytdl } = await import("@distube/ytdl-core");
      await new Promise<void>((resolve, reject) => {
        const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
          filter: "audioandvideo",
          quality: "lowest",
        });
        const writeStream = fs.createWriteStream(inputPath);
        stream.pipe(writeStream);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
        stream.on("error", reject);
      });
    }

    const ffmpeg = getFfmpegPath();
    const duration = Math.round(Number(end) - Number(start));
    await execAsync(
      `"${ffmpeg}" -ss ${start} -i "${inputPath}" -t ${Math.min(duration, 60)} -c:v libx264 -preset ultrafast -crf 28 -c:a aac -b:a 64k -y "${outputPath}"`,
      { timeout: 60000 }
    );

    const buffer = fs.readFileSync(outputPath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="clip_${videoId}_${start}s.mp4"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    try { fs.unlinkSync(outputPath); } catch {}
    try { fs.unlinkSync(inputPath); } catch {}
  }
}
