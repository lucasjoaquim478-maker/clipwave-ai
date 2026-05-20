"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#07070d] flex items-center justify-center">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] p-2 animate-pulse">
          <Zap className="w-full h-full text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070d] flex items-center justify-center p-4 bg-dot-grid relative">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#6366f1]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7c3aed]/8 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card-premium p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#00d4ff] flex items-center justify-center neon-glow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">
                ClipWave<span className="gradient-text">AI</span>
              </span>
            </Link>
            <h1 className="text-2xl font-display font-bold mb-2">Welcome Back</h1>
            <p className="text-sm text-white/40">Sign in to continue to your dashboard</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all text-sm font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="divider my-6" />

          <p className="text-xs text-center text-white/20">
            By signing in, you agree to our{" "}
            <a href="#" className="text-[#818cf8] hover:text-[#a5b4fc] transition-colors">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-[#818cf8] hover:text-[#a5b4fc] transition-colors">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
