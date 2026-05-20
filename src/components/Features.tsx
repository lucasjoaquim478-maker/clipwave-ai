"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles, Wand2, Captions, ZoomIn, TrendingUp, Share2,
  Zap, Music, Languages, Clock, Brain, Video,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Detection",
    description: "AI finds every funny, emotional, or impactful moment from your stream automatically.",
    gradient: "from-[#6366f1] to-[#7c3aed]",
  },
  {
    icon: Wand2,
    title: "Vertical Clips",
    description: "Automatic 9:16 conversion optimized for TikTok, Reels, and Shorts with perfect framing.",
    gradient: "from-[#00d4ff] to-[#06b6d4]",
  },
  {
    icon: Captions,
    title: "Animated Captions",
    description: "Auto-transcription with Whisper + beautifully styled animated captions in real-time.",
    gradient: "from-[#7c3aed] to-[#ec4899]",
  },
  {
    icon: ZoomIn,
    title: "Dynamic Zoom",
    description: "Intelligent focus tracking with smooth zoom effects that keep viewers engaged.",
    gradient: "from-[#f59e0b] to-[#f97316]",
  },
  {
    icon: TrendingUp,
    title: "Viral Score",
    description: "Proprietary algorithm ranks every clip by viral potential with detailed analytics.",
    gradient: "from-[#10b981] to-[#059669]",
  },
  {
    icon: Share2,
    title: "One-Click Export",
    description: "Publish directly to TikTok, Instagram, and YouTube with a single click.",
    gradient: "from-[#6366f1] to-[#00d4ff]",
  },
  {
    icon: Music,
    title: "Smart Soundtrack",
    description: "Auto-suggest trending audio tracks that match your content type perfectly.",
    gradient: "from-[#ec4899] to-[#f43f5e]",
  },
  {
    icon: Languages,
    title: "Multi-Language",
    description: "Auto-translate captions and descriptions to reach a global audience.",
    gradient: "from-[#8b5cf6] to-[#a855f7]",
  },
  {
    icon: Clock,
    title: "Lightning Fast",
    description: "1 hour stream processed in under 5 minutes. Results in record time.",
    gradient: "from-[#06b6d4] to-[#14b8a6]",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="card-premium group h-full">
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 mb-5 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
            <feature.icon className="w-full h-full text-white" />
          </div>
          <h3 className="text-base font-display font-semibold mb-2 text-white/90 group-hover:text-white transition-colors">
            {feature.title}
          </h3>
          <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 lg:py-32 bg-dot-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070d]/50 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Features</div>
          <h2 className="section-title mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Go Viral</span>
          </h2>
          <p className="section-subtitle">
            A complete AI-powered toolkit to create professional clips in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
