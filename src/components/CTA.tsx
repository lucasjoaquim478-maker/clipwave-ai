"use client";

import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 animated-gradient-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-white/[0.06] text-white/60 border border-white/[0.08] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00d4ff]" />
            <span>Limited Beta Spots</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Ready to{" "}
            <span className="gradient-text">Go Viral?</span>
          </h2>

          <p className="text-base sm:text-lg text-white/40 mb-10 max-w-xl mx-auto leading-relaxed">
            Join 10,000+ creators already using ClipWave AI to transform their streams into viral clips.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-primary text-base sm:text-lg !px-10 !py-4 group"
            >
              <Zap className="w-5 h-5" />
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="btn-secondary text-base sm:text-lg !px-8 !py-4">
              View Plans
            </Link>
          </div>

          <p className="text-xs text-white/20 mt-6">
            • No credit card required • 3 free clips • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
