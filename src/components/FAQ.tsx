"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

const faqs = [
  {
    q: "How does ClipWave AI detect the best moments?",
    a: "Our AI analyzes audio patterns, facial expressions, chat reactions, and engagement spikes to automatically identify the most interesting moments from your stream. The algorithm is trained on millions of hours of viral content.",
  },
  {
    q: "How long does it take to process a video?",
    a: "A 1-hour stream is processed in under 5 minutes. Shorter videos are ready in seconds. Processing happens on our servers with dedicated GPU acceleration.",
  },
  {
    q: "Which platforms can I export to?",
    a: "You can export directly to TikTok, Instagram Reels, YouTube Shorts, and Twitter/X. We also offer vertical MP4 download for manual publishing.",
  },
  {
    q: "Do I need technical skills?",
    a: "Not at all! ClipWave was built for creators of all levels. Upload your video, pick your clips, and publish. Everything is automatic.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you can cancel anytime. Your access continues until the end of your billing period. No penalties or hidden fees.",
  },
  {
    q: "What's the maximum export quality?",
    a: "Starter plan exports at 720p, Creator at 1080p, and Pro at 4K. All clips are optimized for vertical format.",
  },
];

function FAQItem({ faq, index, isOpen, onToggle }: { faq: typeof faqs[0]; index: number; isOpen: boolean; onToggle: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="card-glass rounded-xl overflow-hidden border-white/[0.06]"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="font-medium text-white/70 text-sm pr-4">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-6 rounded-lg bg-white/[0.03] flex items-center justify-center flex-shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5 text-white/30" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p className="px-5 pb-5 text-sm text-white/40 leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-dot-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070d]/50 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="section-label mb-4">FAQ</div>
          <h2 className="section-title mb-4">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about ClipWave AI.
          </p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
