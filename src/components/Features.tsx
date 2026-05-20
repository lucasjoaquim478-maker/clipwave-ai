"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Captions,
  ZoomIn,
  TrendingUp,
  Share2,
  Zap,
  Music,
  Languages,
  Clock,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  {
    icon: Sparkles,
    title: "Detecção Inteligente",
    description:
      "IA encontra automaticamente os momentos mais engraçados, emocionantes ou impactantes da sua live.",
    gradient: "from-neon-blue to-cyan-400",
  },
  {
    icon: Wand2,
    title: "Cortes Verticais",
    description:
      "Conversão automática para formato 9:16 otimizado para TikTok, Reels e Shorts.",
    gradient: "from-primary-500 to-neon-purple",
  },
  {
    icon: Captions,
    title: "Legendas Animadas",
    description:
      "Transcrição automática com Whisper + legendas animadas estilizadas em tempo real.",
    gradient: "from-neon-purple to-pink-500",
  },
  {
    icon: ZoomIn,
    title: "Zoom Dinâmico",
    description:
      "Acompanhamento inteligente do foco da cena com zoom suave e efeitos profissionais.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Score Viral",
    description:
      "Algoritmo proprietário que classifica cada corte com pontuação de potencial viral.",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    icon: Share2,
    title: "Exportação Única",
    description:
      "Publique diretamente no TikTok, Instagram e YouTube com um clique.",
    gradient: "from-neon-blue to-primary-500",
  },
  {
    icon: Music,
    title: "Trilha Inteligente",
    description:
      "Sugestão automática de músicas e sons em alta para cada tipo de conteúdo.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Languages,
    title: "Multi-idioma",
    description:
      "Legendas e descrições traduzidas automaticamente para alcançar o mundo.",
    gradient: "from-violet-500 to-neon-purple",
  },
  {
    icon: Clock,
    title: "Processamento Rápido",
    description:
      "Uma live de 1 hora processada em menos de 5 minutos. Resultado em tempo recorde.",
    gradient: "from-cyan-400 to-teal-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="section-title mb-4">
            Tudo que você precisa para viralizar
          </h2>
          <p className="section-subtitle">
            Um conjunto completo de ferramentas de IA para criar cortes
            profissionais em segundos.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <div className="card group h-full">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 mb-5 neon-glow group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2 text-white/90">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
