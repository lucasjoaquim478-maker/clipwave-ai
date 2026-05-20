"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "./AnimatedSection";

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 animated-gradient opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/60 mb-8 border border-white/10">
            <Sparkles className="w-4 h-4 text-neon-blue" />
            <span>Vagas limitadas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Pronto para{" "}
            <span className="gradient-text">viralizar?</span>
          </h2>
          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
            Junte-se a mais de 10 mil criadores que já estão usando ClipWave AI
            para transformar suas lives em cortes virais.
          </p>
          <Link
            href="/login"
            className="btn-primary text-lg !px-10 !py-4 group inline-flex items-center gap-2"
          >
            Criar Conta Gratuita
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-white/30 mt-4">
            • Sem cartão de crédito • 3 cortes grátis • Cancele quando quiser
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
