"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    q: "Como a ClipWave AI detecta os melhores momentos?",
    a: "Nossa IA analisa áudio, expressões faciais, reações do chat e picos de engajamento para identificar automaticamente os momentos mais interessantes da sua live. O algoritmo é treinado com milhões de horas de conteúdo viral.",
  },
  {
    q: "Quanto tempo leva para processar um vídeo?",
    a: "Uma live de 1 hora é processada em menos de 5 minutos. Vídeos menores ficam prontos em segundos. O processamento é feito em nossos servidores com GPUs dedicadas.",
  },
  {
    q: "Para quais plataformas posso exportar?",
    a: "Você pode exportar diretamente para TikTok, Instagram Reels, YouTube Shorts e Twitter/X. Também oferecemos download em MP4 vertical para publicação manual.",
  },
  {
    q: "Preciso de conhecimento técnico?",
    a: "Não! A ClipWave foi feita para ser usada por qualquer criador. Faça upload do vídeo, escolha os cortes e publique. Tudo automático.",
  },
  {
    q: "Posso cancelar minha assinatura?",
    a: "Sim, você pode cancelar quando quiser. Seu acesso continua até o fim do período já pago. Sem multas ou taxas.",
  },
  {
    q: "Qual a qualidade máxima dos cortes?",
    a: "No plano Starter os cortes saem em 720p. No Creator em 1080p e no Pro em 4K. Todos otimizados para o formato vertical.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/60 mb-6 border border-white/10">
            <Sparkles className="w-4 h-4 text-neon-blue" />
            <span>FAQ</span>
          </div>
          <h2 className="section-title mb-4">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <p className="section-subtitle">
            Tudo que você precisa saber sobre a ClipWave AI.
          </p>
        </AnimatedSection>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white/80 text-sm pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 text-sm text-white/50 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
