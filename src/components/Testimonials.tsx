"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    name: "Lucas Silva",
    handle: "@lucassilva",
    role: "Streamer — 2M seguidores",
    text: "Desde que comecei a usar ClipWave, meus cortes no TikTok cresceram 340%. A IA acha momentos que eu nem lembrava que existiam.",
    rating: 5,
  },
  {
    name: "Ana Oliveira",
    handle: "@anaoliveira",
    role: "Criadora de Conteúdo",
    text: "Eu passava 3 horas editando cortes. Agora são 5 minutos. A qualidade das legendas animadas é surreal.",
    rating: 5,
  },
  {
    name: "Pedro Costa",
    handle: "@pedrocosta",
    role: "Agência de Marketing",
    text: "Gerenciamos 12 criadores e a ClipWave nos salvou. O plano Pro com múltiplos canais foi um game changer.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="section-title mb-4">
            O que nossos <span className="gradient-text">criadores</span> dizem
          </h2>
          <p className="section-subtitle">
            Mais de 10 mil criadores já estão viralizando com ClipWave.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="card h-full flex flex-col">
                <Quote className="w-8 h-8 text-primary-500/30 mb-4" />
                <p className="text-white/70 leading-relaxed mb-6 flex-1 text-sm">
                  {t.text}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg
                      key={j}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-neon-purple flex items-center justify-center text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">
                        {t.name}
                      </p>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
