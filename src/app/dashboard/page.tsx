"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Film,
  BarChart3,
  Settings,
  LogOut,
  Youtube,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import VideoProcessor from "@/components/VideoProcessor";

const stats = [
  { label: "Vídeos Processados", value: "12", change: "+3", color: "from-neon-blue to-cyan-400" },
  { label: "Cortes Gerados", value: "47", change: "+12", color: "from-primary-500 to-neon-purple" },
  { label: "Score Viral Médio", value: "86%", change: "+5%", color: "from-green-400 to-emerald-500" },
  { label: "Visualizações", value: "284K", change: "+22.5K", color: "from-amber-500 to-orange-500" },
];

const navItems = [
  { icon: Film, label: "Meus Cortes", active: true },
  { icon: Youtube, label: "Novo Processamento", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Configurações", active: false },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("process");

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 glass rounded-xl"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 p-4 z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}>
        <Link href="/" className="flex items-center gap-2 mb-8 px-2 mt-4 lg:mt-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue via-primary-500 to-neon-purple flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-display font-bold">
            ClipWave<span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.label === "Novo Processamento" ? "process" : "clips");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.active
                  ? "bg-primary-500/10 text-primary-400 font-medium"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="glass rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">Créditos</span>
            <span className="text-xs text-white/60 font-medium">Creator</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" />
          </div>
          <p className="text-xs text-white/30 mt-1">42/50 cortes este mês</p>
        </div>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-all">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-white/50">{stat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${stat.color} text-white font-medium`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-display font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("process")}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              activeTab === "process"
                ? "bg-primary-500/10 text-primary-400 font-medium"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Youtube className="inline w-4 h-4 mr-1.5" />
            Processar Vídeo
          </button>
          <button
            onClick={() => setActiveTab("clips")}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              activeTab === "clips"
                ? "bg-primary-500/10 text-primary-400 font-medium"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Film className="inline w-4 h-4 mr-1.5" />
            Meus Cortes
          </button>
        </div>

        {activeTab === "process" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="process"
          >
            <div className="mb-6">
              <h2 className="text-xl font-display font-semibold mb-1">
                Criar Novos Cortes
              </h2>
              <p className="text-sm text-white/50">
                Cole o link de qualquer vídeo ou live do YouTube para começar
              </p>
            </div>
            <VideoProcessor />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="clips"
          >
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-neon-purple p-4">
                <Film className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                Nenhum corte ainda
              </h3>
              <p className="text-sm text-white/50 mb-6">
                Processe seu primeiro vídeo para ver os cortes aqui
              </p>
              <button
                onClick={() => setActiveTab("process")}
                className="btn-primary"
              >
                <Sparkles className="inline w-4 h-4 mr-2" />
                Processar Vídeo
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
