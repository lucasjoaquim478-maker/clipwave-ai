"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue via-primary-500 to-neon-purple flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold">
                ClipWave<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Transforme suas lives em cortes virais com inteligência artificial.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/60 mb-4">
              Produto
            </h4>
            <ul className="space-y-2">
              {["Funcionalidades", "Planos", "API", "Status"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/60 mb-4">
              Recursos
            </h4>
            <ul className="space-y-2">
              {["Blog", "Tutoriais", "Comunidade", "Ajuda"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/60 mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {["Privacidade", "Termos", "Cookies"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2026 ClipWave AI. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "TikTok", "Instagram", "YouTube"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
