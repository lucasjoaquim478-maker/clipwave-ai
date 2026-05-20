import type { TranscriptSegment } from "./types";

export async function transcribeAudio(
  _audioPath: string,
  _language: string = "pt"
): Promise<TranscriptSegment[]> {
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
