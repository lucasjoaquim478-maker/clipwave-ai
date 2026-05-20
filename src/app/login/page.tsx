"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 bg-grid">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue via-primary-500 to-neon-purple flex items-center justify-center neon-glow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">
                ClipWave<span className="gradient-text">AI</span>
              </span>
            </Link>
            <h1 className="text-2xl font-display font-bold mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-white/50">
              Entre na sua conta para continuar
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field !pl-10 !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/40 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                Lembrar-me
              </label>
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Esqueceu a senha?
              </a>
            </div>

            <button type="submit" className="btn-primary w-full !py-3.5 group">
              Entrar
              <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              Ainda não tem conta?{" "}
              <a
                href="#"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Criar conta grátis
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
