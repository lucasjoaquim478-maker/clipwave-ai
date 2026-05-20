"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Zap,
  Film,
  TrendingUp,
  Music,
  Download,
  Share2,
  BarChart3,
  Clock,
  Settings,
  LogOut,
  Play,
  Scissors,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const clips = [
  {
    id: 1,
    title: "Momento épico - reação em cadeia",
    duration: "0:32",
    viralScore: 94,
    views: "12.5K",
    platform: "TikTok",
  },
  {
    id: 2,
    title: "A melhor piada da live",
    duration: "0:28",
    viralScore: 88,
    views: "8.3K",
    platform: "Reels",
  },
  {
    id: 3,
    title: "Plot twist inacreditável",
    duration: "0:45",
    viralScore: 91,
    views: "22.1K",
    platform: "Shorts",
  },
];

export default function DashboardPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploading(false), 500);
          return 100;
        }
        return p + 5;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 p-4 hidden lg:flex flex-col z-40">
        <Link href="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue via-primary-500 to-neon-purple flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-display font-bold">
            ClipWave<span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {[
            { icon: Film, label: "Meus Cortes", active: true },
            { icon: Upload, label: "Upload", active: false },
            { icon: BarChart3, label: "Analytics", active: false },
            { icon: Music, label: "Trilhas", active: false },
            { icon: Settings, label: "Configurações", active: false },
          ].map((item) => (
            <button
              key={item.label}
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

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-all">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">
              Meu <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Gerencie seus cortes virais
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl text-sm">
              <Clock className="w-4 h-4 text-white/40" />
              <span className="text-white/60">12 cortes restantes</span>
            </div>
            <button className="btn-primary text-sm !px-4 !py-2.5">
              Novo Corte
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 border border-dashed border-white/20 mb-8 text-center hover:border-primary-500/50 transition-colors cursor-pointer group"
          onClick={simulateUpload}
        >
          {uploading ? (
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-neon-purple p-4 animate-pulse">
                <Scissors className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-4">
                IA processando seu vídeo...
              </h3>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-neon-blue via-primary-500 to-neon-purple"
                />
              </div>
              <p className="text-sm text-white/40 mt-2">{progress}%</p>
              <div className="mt-4 space-y-2 text-left">
                {[
                  "Analisando frames...",
                  "Detectando momentos virais...",
                  progress > 30 && "Cortando destaques...",
                  progress > 50 && "Aplicando legendas...",
                  progress > 70 && "Adicionando efeitos...",
                  progress > 90 && "Renderizando...",
                ]
                  .filter(Boolean)
                  .map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-white/50">{step}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-blue to-cyan-400 p-4 group-hover:scale-110 transition-transform">
                <Upload className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                Arraste seu vídeo aqui
              </h3>
              <p className="text-sm text-white/50 mb-4">
                ou clique para selecionar • MP4, MOV • Até 4K • 10GB máx
              </p>
              <button className="btn-secondary text-sm !px-6 !py-2.5">
                Selecionar Vídeo
              </button>
            </div>
          )}
        </motion.div>

        {/* Viral Score Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Cortes Gerados", value: "47", change: "+12", color: "from-neon-blue to-cyan-400" },
            { label: "Score Viral Médio", value: "86%", change: "+5%", color: "from-green-400 to-emerald-500" },
            { label: "Visualizações Total", value: "284K", change: "+22.5K", color: "from-primary-500 to-neon-purple" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-white/50">{stat.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${stat.color} text-white font-medium`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-display font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Clips Gallery */}
        <div className="mb-6">
          <h2 className="text-xl font-display font-semibold mb-4">
            Cortes Recentes
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clips.map((clip, index) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card group"
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <Play className="w-12 h-12 text-white/30 group-hover:text-white/60 group-hover:scale-110 transition-all" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs text-white/60 glass px-2 py-1 rounded-full">
                    {clip.duration}
                  </span>
                  <span className="text-xs text-green-400 glass px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {clip.viralScore}%
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-white/90 mb-2 line-clamp-1">
                {clip.title}
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">{clip.views} views</span>
                <span className="text-white/30">{clip.platform}</span>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass glass-hover text-xs text-white/60">
                  <Download className="w-3.5 h-3.5" />
                  Exportar
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass glass-hover text-xs text-white/60">
                  <Share2 className="w-3.5 h-3.5" />
                  Publicar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
