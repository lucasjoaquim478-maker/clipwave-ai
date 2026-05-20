"use client";

import { useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Zap, Film, BarChart3, Settings, LogOut, Youtube, Sparkles,
  Menu, X, User, Play, TrendingUp, Download, Captions,
} from "lucide-react";
import Link from "next/link";
import VideoProcessor from "@/components/VideoProcessor";
import type { Clip } from "@/lib/types";

const stats = [
  { label: "Vídeos Processados", value: "12", change: "+3", color: "from-neon-blue to-cyan-400" },
  { label: "Cortes Gerados", value: "47", change: "+12", color: "from-primary-500 to-neon-purple" },
  { label: "Score Viral Médio", value: "86%", change: "+5%", color: "from-green-400 to-emerald-500" },
  { label: "Visualizações", value: "284K", change: "+22.5K", color: "from-amber-500 to-orange-500" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("process");
  const [allClips, setAllClips] = useState<Clip[]>([]);

  if (status === "loading") return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" /></div>;
  if (!session) { router.push("/login"); return null; }

  const user = session.user;

  const handleClipsComplete = useCallback((clips: Clip[]) => {
    setAllClips((prev) => [...clips, ...prev]);
    setActiveTab("clips");
  }, []);

  const handleExport = async (clipId: string, platform: string) => {
    try {
      const res = await fetch("/api/clips", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clipId, platform }),
      });
      const data = await res.json();
      if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-black">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2.5 glass rounded-xl">
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className={`fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 p-4 z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}>
        <Link href="/" className="flex items-center gap-2 mb-8 px-2 mt-4 lg:mt-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue via-primary-500 to-neon-purple flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-display font-bold">ClipWave<span className="gradient-text">AI</span></span>
        </Link>

        <div className="flex items-center gap-3 px-3 py-2.5 mb-4 glass rounded-xl">
          {user?.image ? <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
            : <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center"><User className="w-4 h-4 text-primary-400" /></div>}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{user?.name || "Usuário"}</p>
            <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button onClick={() => { setActiveTab("process"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === "process" ? "bg-primary-500/10 text-primary-400 font-medium" : "text-white/40 hover:text-white/60 hover:bg-white/5"}`}>
            <Youtube className="w-4 h-4" /> Novo Processamento
          </button>
          <button onClick={() => { setActiveTab("clips"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === "clips" ? "bg-primary-500/10 text-primary-400 font-medium" : "text-white/40 hover:text-white/60 hover:bg-white/5"}`}>
            <Film className="w-4 h-4" /> Meus Cortes {allClips.length > 0 && <span className="ml-auto text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">{allClips.length}</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-all">
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-all">
            <Settings className="w-4 h-4" /> Configurações
          </button>
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

        <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-all">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </aside>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-white/50">{stat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${stat.color} text-white font-medium`}>{stat.change}</span>
              </div>
              <p className="text-2xl font-display font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setActiveTab("process")}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${activeTab === "process" ? "bg-primary-500/10 text-primary-400 font-medium" : "text-white/40 hover:text-white/60"}`}>
            <Youtube className="inline w-4 h-4 mr-1.5" /> Processar Vídeo
          </button>
          <button onClick={() => setActiveTab("clips")}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${activeTab === "clips" ? "bg-primary-500/10 text-primary-400 font-medium" : "text-white/40 hover:text-white/60"}`}>
            <Film className="inline w-4 h-4 mr-1.5" /> Meus Cortes {allClips.length > 0 && <span className="ml-1 text-xs text-primary-400">({allClips.length})</span>}
          </button>
        </div>

        {activeTab === "process" ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="process">
            <div className="mb-6">
              <h2 className="text-xl font-display font-semibold mb-1">Criar Novos Cortes</h2>
              <p className="text-sm text-white/50">Cole o link de qualquer vídeo ou live do YouTube para começar</p>
            </div>
            <VideoProcessor onClipsComplete={handleClipsComplete} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="clips">
            {allClips.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {allClips.map((clip, index) => (
                  <motion.div key={clip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="glass rounded-2xl overflow-hidden border border-white/10">
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${clip.videoId}?start=${Math.round(clip.startTime)}&end=${Math.round(clip.endTime)}&autoplay=0&controls=1&rel=0`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <span className="glass px-2 py-1 rounded-full text-xs text-white/80 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />{clip.viralScore}%
                        </span>
                        <span className="glass px-2 py-1 rounded-full text-xs text-white/60">{Math.round(clip.duration)}s</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium text-white/90 line-clamp-1 flex-1">{clip.title}</h3>
                        <div className="flex gap-1 ml-2">{clip.emojis.slice(0, 3).map((e, i) => <span key={i} className="text-sm">{e}</span>)}</div>
                      </div>
                      <p className="text-xs text-white/40 mb-3 line-clamp-1">{clip.description}</p>
                      <div className="flex items-center gap-2">
                        {clip.exportFormats.map((fmt) => (
                          <button key={fmt.platform} onClick={() => handleExport(clip.id, fmt.platform)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-xs text-white/60">
                            {fmt.platform === "tiktok" ? "TikTok" : fmt.platform === "reels" ? "Reels" : "Shorts"}
                            <Download className="w-3 h-3" />
                          </button>
                        ))}
                        <button onClick={() => handleExport(clip.id, "mp4")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-xs text-white/60 ml-auto">
                          <Download className="w-3 h-3" /> MP4
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-neon-purple p-4">
                  <Film className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">Nenhum corte ainda</h3>
                <p className="text-sm text-white/50 mb-6">Processe seu primeiro vídeo para ver os cortes aqui</p>
                <button onClick={() => setActiveTab("process")} className="btn-primary">
                  <Sparkles className="inline w-4 h-4 mr-2" /> Processar Vídeo
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
