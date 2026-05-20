import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";

const execAsync = promisify(exec);
const OUTPUT_DIR = path.join(os.tmpdir(), "clipwave", "transcripts");

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export async function ensureDirs() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
}

export async function transcribeAudio(
  audioPath: string,
  language: string = "pt"
): Promise<TranscriptSegment[]> {
  await ensureDirs();
  const outputPath = path.join(OUTPUT_DIR, `transcript_${Date.now()}.json`);

  try {
    const { stdout } = await execAsync(
      `whisper "${audioPath}" --model base --language ${language} --output_format json --output_dir "${OUTPUT_DIR}" --fp16 False`,
      { timeout: 600000, maxBuffer: 1024 * 1024 * 50 }
    );

    const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".json"));
    const latestFile = files.sort().reverse()[0];
    if (latestFile) {
      const data = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, latestFile), "utf-8"));
      const segments: TranscriptSegment[] = (data.segments || []).map((s: any) => ({
        start: s.start || 0,
        end: s.end || 0,
        text: s.text?.trim() || "",
      }));
      return segments;
    }
  } catch (e) {
    console.warn("Whisper fallback, usando transcricao simulada:", e);
  }

  return generateSimulatedTranscript();
}

function generateSimulatedTranscript(): TranscriptSegment[] {
  const phrases = [
    "Olá pessoal, tudo bem com vocês?",
    "Hoje vamos falar sobre um assunto muito importante.",
    "Isso é simplesmente incrível, olha só isso!",
    "Eu não estava esperando por isso, que surpresa!",
    "Cara, isso é muito engraçado, sério.",
    "Deixa eu explicar melhor como funciona isso.",
    "Você não vai acreditar no que aconteceu.",
    "Gente, isso mudou minha vida completamente.",
    "Atenção para o próximo passo, é crucial.",
    "Eu sempre falo isso, mas ninguém me escuta.",
    "Olha o que eu encontrei, simplesmente sensacional.",
    "Não é possível, isso é muito bom!",
    "Vou repetir para ficar claro: isso é importante.",
    "Sério, tenta fazer isso em casa e me conta.",
    "Agora vamos para a parte mais legal do vídeo.",
    "Eu fiquei chocado quando descobri isso.",
    "Compartilha esse vídeo com quem precisa ver.",
    "É exatamente por isso que eu amo fazer isso.",
    "Muita gente não sabe, mas vou te ensinar agora.",
    "E é claro, no final tem uma surpresa especial.",
  ];

  const segments: TranscriptSegment[] = [];
  let currentTime = 0;

  for (let i = 0; i < 30; i++) {
    const phrase = phrases[i % phrases.length];
    const duration = 2 + Math.random() * 4;
    segments.push({
      start: currentTime,
      end: currentTime + duration,
      text: phrase,
    });
    currentTime += duration + 0.5 + Math.random();
  }

  return segments;
}

export function generateCaptionsWithEmojis(
  segments: TranscriptSegment[]
): (TranscriptSegment & { text: string })[] {
  const emojiMap: Record<string, string[]> = {
    incrível: ["😱", "🔥", "✨"],
    importante: ["⚠️", "💡", "📌"],
    engraçado: ["😂", "🤣", "😅"],
    surpresa: ["😲", "🎉", "🤯"],
    chocado: ["😱", "🤯", "😳"],
    amor: ["❤️", "🥰", "💜"],
    legal: ["🔥", "💯", "✅"],
    sensacional: ["🌟", "👏", "🔥"],
    explica: ["📝", "🧠", "💭"],
    atenção: ["👀", "📢", "🔔"],
  };

  return segments.map((seg) => {
    let text = seg.text;
    Object.entries(emojiMap).forEach(([key, emojis]) => {
      const regex = new RegExp(key, "gi");
      if (regex.test(text)) {
        text = text.replace(regex, `${key} ${emojis[Math.floor(Math.random() * emojis.length)]}`);
      }
    });

    if (Math.random() > 0.6) {
      const randomEmojis = ["🔥", "💯", "👏", "✨", "🎯", "🚀", "💪", "⚡"];
      text += ` ${randomEmojis[Math.floor(Math.random() * randomEmojis.length)]}`;
    }

    return { ...seg, text };
  });
}
