import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipWave AI | Transforme Lives em Cortes Virais",
  description:
    "IA que transforma automaticamente suas lives e vídeos longos em cortes virais prontos para TikTok, Instagram Reels e YouTube Shorts.",
  keywords: [
    "cortes virais",
    "ia video",
    "shorts",
    "reels",
    "tiktok",
    "edição automática",
  ],
  openGraph: {
    title: "ClipWave AI",
    description:
      "Transforme lives em cortes virais com IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
