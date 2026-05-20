"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Lucas Silva",
    handle: "@lucassilva",
    role: "Streamer • 2M followers",
    text: "Since I started using ClipWave, my TikTok clips grew 340%. The AI finds moments I didn't even remember existed.",
    rating: 5,
  },
  {
    name: "Ana Oliveira",
    handle: "@anaoliveira",
    role: "Content Creator",
    text: "I used to spend 3 hours editing clips. Now it takes 5 minutes. The animated captions quality is surreal.",
    rating: 5,
  },
  {
    name: "Pedro Costa",
    handle: "@pedrocosta",
    role: "Marketing Agency",
    text: "We manage 12 creators and ClipWave saved us. The Pro plan with multiple channels was a game changer.",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="card-premium h-full flex flex-col">
        <Quote className="w-8 h-8 text-[#6366f1]/20 mb-4" />
        <p className="text-white/60 leading-relaxed mb-6 flex-1 text-sm">
          &ldquo;{t.text}&rdquo;
        </p>
        <StarRating rating={t.rating} />
        <div className="divider my-4" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {t.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-white/90">{t.name}</p>
            <p className="text-xs text-white/30">{t.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7c3aed]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Testimonials</div>
          <h2 className="section-title mb-4">
            Loved by{" "}
            <span className="gradient-text">Creators</span>
          </h2>
          <p className="section-subtitle">
            Join 10,000+ creators already growing with ClipWave.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
