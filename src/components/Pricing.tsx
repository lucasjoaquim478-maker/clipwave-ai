"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const plans = [
  {
    name: "Starter",
    price: { monthly: "$0", annual: "$0" },
    period: "forever",
    description: "Perfect to test the platform",
    features: [
      "3 clips per month",
      "720p export quality",
      "Auto captions",
      "MP4 export",
      "ClipWave watermark",
    ],
    highlighted: false,
    cta: "Get Started Free",
  },
  {
    name: "Creator",
    price: { monthly: "$29", annual: "$23" },
    period: "/month",
    description: "For creators ready to grow",
    features: [
      "50 clips per month",
      "1080p export quality",
      "Animated captions",
      "Dynamic zoom",
      "Detailed viral score",
      "Direct TikTok/Reels export",
      "No watermark",
      "Priority support",
    ],
    highlighted: true,
    cta: "Subscribe Creator",
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: { monthly: "$79", annual: "$63" },
    period: "/month",
    description: "For agencies & professionals",
    features: [
      "200 clips per month",
      "4K export quality",
      "Everything from Creator",
      "Multiple channels",
      "API access",
      "Auto-translation",
      "AI soundtracks",
      "Dedicated account manager",
    ],
    highlighted: false,
    cta: "Subscribe Pro",
  },
];

function PlanCard({ plan, index, annual }: { plan: typeof plans[0]; index: number; annual: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div
        className={`relative rounded-2xl p-8 h-full transition-all duration-500 ${
          plan.highlighted
            ? "gradient-border bg-gradient-to-b from-[#6366f1]/10 via-[#7c3aed]/5 to-transparent"
            : "card-glass"
        }`}
      >
        {plan.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="px-4 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white shadow-lg">
              {plan.badge}
            </span>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-display font-bold mb-1">{plan.name}</h3>
          <p className="text-sm text-white/40 mb-4">{plan.description}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              {annual ? plan.price.annual : plan.price.monthly}
            </span>
            <span className="text-sm text-white/30">{plan.period}</span>
          </div>
          {annual && plan.price.monthly !== "$0" && (
            <p className="text-xs text-[#10b981] mt-1">
              Save {Math.round((1 - parseInt(plan.price.annual) / parseInt(plan.price.monthly)) * 100)}% annually
            </p>
          )}
        </div>

        <div className="divider mb-6" />

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#10b981]" />
              </div>
              <span className="text-white/50">{feature}</span>
            </li>
          ))}
        </ul>

        {plan.highlighted ? (
          <Link href="/dashboard" className="btn-primary w-full justify-center">
            {plan.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link href="/dashboard" className="btn-secondary w-full justify-center">
            {plan.cta}
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-dot-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070d]/50 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="section-label mb-4">Pricing</div>
          <h2 className="section-title mb-4">
            Invest in Your{" "}
            <span className="gradient-text">Growth</span>
          </h2>
          <p className="section-subtitle mb-8">
            From beginner creator to professional agency. Scale as you grow.
          </p>

          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !annual ? "bg-white/[0.06] text-white shadow-sm" : "text-white/40 hover:text-white/60"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                annual ? "bg-white/[0.06] text-white shadow-sm" : "text-white/40 hover:text-white/60"
              }`}
            >
              Annual
              <span className="ml-1.5 text-[10px] text-[#10b981]">Save up to 20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} index={index} annual={annual} />
          ))}
        </div>
      </div>
    </section>
  );
}
