"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "API", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Blog", "Tutorials", "Community", "Help Center"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "GDPR"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-16 lg:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#07070d] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#00d4ff] flex items-center justify-center group-hover:neon-glow transition-all duration-500">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold tracking-tight">
                ClipWave<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-white/30 leading-relaxed max-w-xs">
              Transform your streams into viral clips with AI precision.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {["TW", "TT", "IG", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[10px] font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-white/40 tracking-wider uppercase mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} ClipWave AI. All rights reserved.
          </p>
          <p className="text-xs text-white/10">
            Powered by <span className="text-white/20">Next.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
