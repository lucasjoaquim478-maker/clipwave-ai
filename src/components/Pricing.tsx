"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const plans = [
  {
    name: "Starter",
    price: "Grátis",
    period: "para sempre",
    description: "Perfeito para testar a plataforma",
    features: [
      "3 cortes por mês",
      "Qualidade 720p",
      "Legendas automáticas",
      "Exportação para MP4",
      "Marca d'água ClipWave",
    ],
    highlighted: false,
    cta: "Começar Grátis",
  },
  {
    name: "Creator",
    price: "R$ 29",
    period: "/mês",
    description: "Para criadores que querem crescer",
    features: [
      "50 cortes por mês",
      "Qualidade 1080p",
      "Legendas animadas",
      "Zoom dinâmico inteligente",
      "Score viral detalhado",
      "Exportação direta TikTok/Reels",
      "Sem marca d'água",
      "Suporte prioritário",
    ],
    highlighted: true,
    cta: "Assinar Creator",
    popular: true,
  },
  {
    name: "Pro",
    price: "R$ 79",
    period: "/mês",
    description: "Para agências e profissionais",
    features: [
      "200 cortes por mês",
      "Qualidade 4K",
      "Tudo do Creator",
      "Múltiplos canais/contas",
      "API de integração",
      "Tradução automática",
      "Trilha sonora IA",
      "Prioridade máxima",
      "Gerente de conta dedicado",
    ],
    highlighted: false,
    cta: "Assinar Pro",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/60 mb-6 border border-white/10">
            <Sparkles className="w-4 h-4 text-neon-blue" />
            <span>Planos e Preços</span>
          </div>
          <h2 className="section-title mb-4">
            Invista no seu <span className="gradient-text">crescimento</span>
          </h2>
          <p className="section-subtitle">
            Do criador iniciante à agência profissional.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div
                className={`relative rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-primary-900/40 via-neon-purple/10 to-black/60 border border-primary-500/30 neon-glow"
                    : "glass border border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-neon-blue to-neon-purple text-white">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-display font-bold mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-white/50 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold">
                      {plan.price}
                    </span>
                    <span className="text-sm text-white/40">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${
                    plan.highlighted
                      ? "btn-primary"
                      : "glass glass-hover text-white/80"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
