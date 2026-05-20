"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, BarChart3, Check, ChevronDown } from "lucide-react";
import Link from "next/link";

const floatingElements = [
  { icon: Sparkles, label: "IA Detection", x: "15%", y: "25%", delay: 0, color: "from-[#6366f1] to-[#7c3aed]" },
  { icon: BarChart3, label: "Viral Score 94%", x: "80%", y: "35%", delay: 0.5, color: "from-[#00d4ff] to-[#06b6d4]" },
  { icon: Zap, label: "Auto Clips", x: "10%", y: "65%", delay: 1, color: "from-[#ec4899] to-[#f43f5e]" },
  { icon: Check, label: "Ready 4 Export", x: "75%", y: "70%", delay: 1.5, color: "from-[#10b981] to-[#059669]" },
];

function FloatingParticle() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/[0.03] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dot-grid-large">
      <FloatingParticle />

      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7c3aed]/8 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-[#00d4ff]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#ec4899]/5 rounded-full blur-[120px]" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Now in Public Beta</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] tracking-tight mb-6"
        >
          Transform Lives Into{" "}
          <span className="gradient-text">Viral Clips</span>
          <br />
          <span className="text-white/30">With AI Precision</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          ClipWave AI automatically detects the most engaging moments from your streams 
          and creates ready-to-post clips for TikTok, Reels, and Shorts in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/dashboard"
            className="btn-primary text-base sm:text-lg !px-8 !py-4 group"
          >
            <span>Start Free — No Credit Card</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="btn-secondary text-base sm:text-lg !px-8 !py-4 group">
            <Play className="w-5 h-5" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-1">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#1e1b4b]/80 via-[#07070d] to-[#1a0a2e]/60 flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] flex items-center justify-center transition-all group-hover:bg-white/[0.12] group-hover:border-white/[0.2]"
                >
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
                    <Zap className="w-3 h-3 text-[#00d4ff]" />
                    <span className="text-[10px] text-white/70 font-medium">AI Processing Pipeline</span>
                  </div>
                  <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
                    <BarChart3 className="w-3 h-3 text-[#10b981]" />
                    <span className="text-[10px] text-white/70 font-medium">Viral Score: 94%</span>
                  </div>
                </div>
                <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#00d4ff]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white/20 text-xs font-medium tracking-[0.2em] uppercase"
        >
          {["TikTok", "Instagram Reels", "YouTube Shorts", "Twitter/X"].map((platform) => (
            <span key={platform} className="hover:text-white/40 transition-colors duration-300">
              {platform}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
