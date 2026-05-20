import type { ViralMoment, TranscriptSegment } from "./types";

const VIRAL_KEYWORDS: Record<string, { score: number; type: ViralMoment["type"] }> = {
  incrível: { score: 85, type: "exciting" },
  sensacional: { score: 90, type: "exciting" },
  chocado: { score: 88, type: "surprising" },
  engraçado: { score: 92, type: "funny" },
  hilário: { score: 95, type: "funny" },
  amei: { score: 80, type: "emotional" },
  importante: { score: 75, type: "educational" },
  atenção: { score: 78, type: "educational" },
  mudou: { score: 85, type: "emotional" },
  surpresa: { score: 90, type: "surprising" },
  emocionante: { score: 88, type: "emotional" },
  "não acredito": { score: 92, type: "surprising" },
  perfeito: { score: 82, type: "exciting" },
  arrepiante: { score: 93, type: "emotional" },
  épico: { score: 91, type: "exciting" },
};

function getAudioFeatures(audioLevels?: number[]): number[] {
  const peaks: number[] = [];
  if (audioLevels) {
    for (let i = 1; i < audioLevels.length - 1; i++) {
      if (audioLevels[i] > 0.8 && audioLevels[i] > audioLevels[i - 1] * 1.5) {
        peaks.push(i);
      }
    }
  }
  return peaks;
}

export function detectViralMoments(
  transcript: TranscriptSegment[],
  duration: number,
  audioLevels?: number[]
): ViralMoment[] {
  const moments: ViralMoment[] = [];
  const audioPeaks = getAudioFeatures(audioLevels);

  transcript.forEach((seg, i) => {
    const text = seg.text.toLowerCase();
    let maxScore = 0;
    let maxReason = "";
    let maxType: ViralMoment["type"] = "educational";

    Object.entries(VIRAL_KEYWORDS).forEach(([word, data]) => {
      if (text.includes(word) && data.score > maxScore) {
        maxScore = data.score;
        maxReason = word;
        maxType = data.type;
      }
    });

    if (seg.text.length > 30) maxScore += 5;
    if (seg.text.includes("!")) maxScore += 10;
    if (seg.text.includes("?")) maxScore += 5;
    if (seg.text.length > 50) maxScore += 3;

    if (maxScore >= 70) {
      moments.push({
        start: seg.start,
        end: seg.end,
        score: Math.min(maxScore + Math.floor(Math.random() * 10), 99),
        reason: `Palavra-chave: "${maxReason}"`,
        type: maxType,
      });
    }
  });

  audioPeaks.forEach((peakIndex) => {
    const time = (peakIndex / (audioLevels?.length || 1)) * duration;
    const nearby = moments.find((m) => Math.abs(m.start - time) < 5);
    if (!nearby) {
      moments.push({
        start: Math.max(0, time - 2),
        end: Math.min(duration, time + 3),
        score: 75 + Math.floor(Math.random() * 15),
        reason: "Pico de áudio detectado",
        type: "exciting",
      });
    } else {
      nearby.score = Math.min(nearby.score + 5, 99);
    }
  });

  moments.sort((a, b) => b.score - a.score);

  const uniqueMoments: ViralMoment[] = [];
  moments.forEach((m) => {
    const overlapping = uniqueMoments.find(
      (u) => Math.abs(u.start - m.start) < 3
    );
    if (!overlapping) {
      uniqueMoments.push(m);
    }
  });

  return uniqueMoments.slice(0, 8);
}

export function generateClipTitles(text: string): string[] {
  const templates = [
    `INCRÍVEL! ${text.slice(0, 30)}... 😱`,
    `ISSO É PURO OURO! ${text.slice(0, 25)} 🔥`,
    `NÃO VAI ACREDITAR! ${text.slice(0, 25)} 🤯`,
    `${text.slice(0, 35)}... (MOMENTO ÉPICO) ⚡`,
    `OLHA ISSO! ${text.slice(0, 28)} 💯`,
    `${text.slice(0, 40)} #viral #fy`,
    `O MELHOR MOMENTO: ${text.slice(0, 25)} 🚀`,
    `ISSO SIM É CONTEÚDO! ${text.slice(0, 20)} 👏`,
  ];
  return templates;
}

export function suggestEmojis(text: string): string[] {
  const suggestions: string[] = [];

  const emotionEmojis: Record<string, string[]> = {
    incrível: ["😱", "🔥", "✨"],
    engraçado: ["😂", "🤣", "😅"],
    triste: ["😢", "💔", "🥺"],
    amor: ["❤️", "🥰", "💜"],
    raiva: ["😡", "💢", "🤬"],
    surpresa: ["😲", "🤯", "🎉"],
    feliz: ["😁", "🎊", "🥳"],
    importante: ["📢", "💡", "⚠️"],
  };

  Object.entries(emotionEmojis).forEach(([key, emojis]) => {
    if (text.toLowerCase().includes(key)) {
      suggestions.push(emojis[Math.floor(Math.random() * emojis.length)]);
    }
  });

  if (suggestions.length < 3) {
    const defaults = ["🔥", "💯", "👏", "⚡", "🎯", "🚀", "💪", "✨"];
    while (suggestions.length < 3) {
      const emoji = defaults[Math.floor(Math.random() * defaults.length)];
      if (!suggestions.includes(emoji)) suggestions.push(emoji);
    }
  }

  return suggestions.slice(0, 4);
}

export function calculateViralScore(
  moments: ViralMoment[],
  duration: number
): number {
  if (moments.length === 0) return Math.floor(Math.random() * 30) + 20;

  const avgScore = moments.reduce((s, m) => s + m.score, 0) / moments.length;
  const densityBonus = Math.min((moments.length / (duration / 60)) * 10, 20);
  const varietyBonus = new Set(moments.map((m) => m.type)).size * 5;

  return Math.min(Math.floor(avgScore * 0.7 + densityBonus + varietyBonus), 99);
}
