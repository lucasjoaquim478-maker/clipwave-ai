"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Wand2,
  Download,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    icon: Upload,
    title: "Upload do Vídeo",
    description: "Faça upload da sua live ou vídeo longo",
    color: "from-neon-blue to-cyan-400",
  },
  {
    icon: Wand2,
    title: "IA Processa",
    description: "Detecção de momentos, cortes, legendas e efeitos",
    color: "from-primary-500 to-neon-purple",
  },
  {
    icon: Download,
    title: "Cortes Prontos",
    description: "Exporte ou publique direto nas redes sociais",
    color: "from-green-400 to-emerald-500",
  },
];

export default function Demo() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/60 mb-6 border border-white/10">
            <Sparkles className="w-4 h-4 text-neon-blue" />
            <span>Veja como funciona</span>
          </div>
          <h2 className="section-title mb-4">
            Três passos para o <span className="gradient-text">viral</span>
          </h2>
          <p className="section-subtitle">
            Da live ao corte pronto em menos de 5 minutos.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ${
                    activeStep === index
                      ? "glass border border-primary-500/30 neon-glow"
                      : "glass opacity-60 hover:opacity-80"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} p-2 flex-shrink-0`}
                    >
                      <step.icon className="w-full h-full text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-white/30 font-mono">
                          0{index + 1}
                        </span>
                        <h3 className="font-display font-semibold text-white/90">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-white/50">
                        {step.description}
                      </p>
                    </div>
                    {activeStep === index && (
                      <Check className="w-5 h-5 text-green-400 ml-auto flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="glass rounded-2xl p-6 border border-white/10 min-h-[400px] flex items-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-blue to-cyan-400 p-5">
                      <Upload className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2">
                      Upload do Vídeo
                    </h3>
                    <p className="text-white/50 text-sm mb-6">
                      Arraste sua live ou clique para selecionar
                    </p>
                    <div className="glass border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-primary-500/50 transition-colors cursor-pointer">
                      <p className="text-white/30 text-sm">
                        MP4, MOV, AVI • Até 4K
                      </p>
                    </div>
                  </motion.div>
                )}
                {activeStep === 1 && (
                  <motion.div
                    key="process"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center w-full"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-neon-purple p-5">
                      <Wand2 className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-4">
                      IA Processando...
                    </h3>
                    <div className="space-y-3 text-left">
                      {[
                        "Analisando 2.430 frames...",
                        "Detectando momentos virais...",
                        "Gerando cortes verticais...",
                        "Aplicando legendas animadas...",
                        "Adicionando zoom dinâmico...",
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-sm text-white/60">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-neon-blue via-primary-500 to-neon-purple"
                      />
                    </div>
                  </motion.div>
                )}
                {activeStep === 2 && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 p-5">
                      <Check className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2">
                      12 Cortes Gerados!
                    </h3>
                    <p className="text-white/50 text-sm mb-6">
                      Pontuação viral média: 87%
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["TikTok", "Reels", "Shorts"].map((p) => (
                        <span
                          key={p}
                          className="px-3 py-1 rounded-full glass text-xs text-white/60 border border-white/10"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
