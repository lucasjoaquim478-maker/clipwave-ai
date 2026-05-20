"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Wand2, Download, Check, ArrowRight, Sparkles, Video, Zap } from "lucide-react";

const steps = [
  {
    icon: Video,
    title: "Upload Your Stream",
    description: "Drop your stream recording or paste a YouTube link",
    color: "from-[#00d4ff] to-[#06b6d4]",
    preview: (
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#06b6d4] p-5 neon-glow-blue">
          <Video className="w-full h-full text-white" />
        </div>
        <h3 className="text-lg font-display font-semibold mb-2">Upload Your Content</h3>
        <p className="text-white/40 text-sm mb-6">Drag & drop or paste a YouTube link</p>
        <div className="glass-strong border-2 border-dashed border-white/[0.08] rounded-xl p-8 hover:border-[#6366f1]/30 transition-all cursor-pointer group">
          <Upload className="w-8 h-8 mx-auto mb-3 text-white/20 group-hover:text-white/40 transition-colors" />
          <p className="text-white/20 text-xs">MP4, MOV, YouTube • Up to 4K</p>
        </div>
      </div>
    ),
  },
  {
    icon: Wand2,
    title: "AI Processes Everything",
    description: "Moment detection, clips, captions, and effects applied automatically",
    color: "from-[#6366f1] to-[#7c3aed]",
    preview: (
      <div className="text-center w-full">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] p-5 neon-glow-strong">
          <Wand2 className="w-full h-full text-white" />
        </div>
        <h3 className="text-lg font-display font-semibold mb-4">AI Processing...</h3>
        <div className="space-y-3 text-left max-w-xs mx-auto">
          {[
            "Analyzing 2,430 frames...",
            "Detecting viral moments...",
            "Generating vertical clips...",
            "Applying animated captions...",
            "Adding dynamic zoom...",
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.4 }}
                className="w-1.5 h-1.5 rounded-full bg-[#10b981]"
              />
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.4 }}
                className="text-sm text-white/50"
              >
                {s}
              </motion.span>
            </div>
          ))}
        </div>
        <div className="mt-6 h-1.5 rounded-full bg-white/[0.06] overflow-hidden max-w-xs mx-auto">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#00d4ff]"
          />
        </div>
      </div>
    ),
  },
  {
    icon: Zap,
    title: "Clips Ready to Post",
    description: "Export or publish directly to all your social platforms",
    color: "from-[#10b981] to-[#059669]",
    preview: (
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] p-5">
          <Check className="w-full h-full text-white" />
        </div>
        <h3 className="text-lg font-display font-semibold mb-2">12 Clips Generated!</h3>
        <p className="text-white/40 text-sm mb-6">Average Viral Score: 87%</p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {["TikTok", "Reels", "Shorts", "MP4"].map((p) => (
            <span key={p} className="px-3 py-1.5 rounded-full glass-strong text-xs text-white/50">
              {p}
            </span>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="btn-primary text-sm !px-6 !py-2.5"
        >
          <Download className="w-4 h-4" /> Export All
        </motion.button>
      </div>
    ),
  },
];

export default function Demo() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6366f1]/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">How It Works</div>
          <h2 className="section-title mb-4">
            Three Steps to{" "}
            <span className="gradient-text">Viral</span>
          </h2>
          <p className="section-subtitle">
            From stream to clip in under 5 minutes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#6366f1]/40 via-[#7c3aed]/20 to-transparent hidden lg:block" />
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative w-full text-left p-5 rounded-2xl transition-all duration-500 ${
                    activeStep === index
                      ? "card-premium gradient-border"
                      : "card-glass opacity-50 hover:opacity-80"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} p-2 flex-shrink-0 transition-transform duration-300 ${activeStep === index ? "scale-110" : ""}`}>
                      <step.icon className="w-full h-full text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-white/20 font-mono font-medium">
                          STEP {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <h3 className={`font-display font-semibold text-sm transition-colors ${activeStep === index ? "text-white" : "text-white/70"}`}>
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs text-white/40">{step.description}</p>
                    </div>
                    {activeStep === index && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#10b981]" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-premium p-6 border-white/[0.08] min-h-[400px] flex items-center justify-center relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {steps[activeStep].preview}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
