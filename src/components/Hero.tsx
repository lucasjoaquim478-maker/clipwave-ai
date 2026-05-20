"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-neon-blue/20 rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/60 mb-8 border border-white/10"
        >
          <Sparkles className="w-4 h-4 text-neon-blue" />
          <span>Lançamento Oficial — IA de nova geração</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-6"
        >
          Transforme suas lives em{" "}
          <span className="gradient-text">cortes virais</span>
          <br />
          <span className="text-white/40">com IA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10"
        >
          A ClipWave AI detecta automaticamente os melhores momentos das suas
          transmissões e cria cortes prontos para TikTok, Reels e Shorts em
          segundos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/login"
            className="btn-primary text-lg !px-8 !py-4 group"
          >
            Começar Gratuitamente
            <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="btn-secondary text-lg !px-8 !py-4 flex items-center gap-2">
            <Play className="w-5 h-5" />
            Ver Demonstração
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto border border-white/10"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary-900/50 via-black to-neon-purple/30 flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3 text-neon-blue" />
                <span>IA detectando momentos virais...</span>
              </div>
              <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2">
                <BarChart3 className="w-3 h-3 text-green-400" />
                <span>Pontuação Viral: 94%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/30 text-sm"
        >
          {["TikTok", "Instagram Reels", "YouTube Shorts", "Twitter/X"].map(
            (platform) => (
              <span key={platform} className="font-medium tracking-wider uppercase">
                {platform}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
