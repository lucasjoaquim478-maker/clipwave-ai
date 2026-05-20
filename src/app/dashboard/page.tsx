"use client";

import { useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Film, BarChart3, Settings, LogOut, Youtube, Sparkles,
  Menu, X, User, Play, TrendingUp, Download, LayoutDashboard,
  Clapperboard, History, Bell, Search, HelpCircle,
} from "lucide-react";
import Link from "next/link";
import VideoProcessor from "@/components/VideoProcessor";
import YouTubePlayer from "@/components/YouTubePlayer";
import type { Clip } from "@/lib/types";

const stats = [
  { label: "Videos Processed", value: "12", change: "+3", color: "from-[#00d4ff] to-[#06b6d4]" },
  { label: "Clips Generated", value: "47", change: "+12", color: "from-[#6366f1] to-[#7c3aed]" },
  { label: "Avg Viral Score", value: "86%", change: "+5%", color: "from-[#10b981] to-[#059669]" },
  { label: "Total Views", value: "284K", change: "+22.5K", color: "from-[#f59e0b] to-[#f97316]" },
];

const sidebarItems = [
  { id: "process", label: "New Processing", icon: Youtube },
  { id: "clips", label: "My Clips", icon: Clapperboard },
  { id: "history", label: "History", icon: History },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("process");
  const [allClips, setAllClips] = useState<Clip[]>([]);

  const handleClipsComplete = useCallback((clips: Clip[]) => {
    setAllClips((prev) => [...clips, ...prev]);
    setActiveTab("clips");
  }, []);

  const handleExport = (clip: Clip, _platform: string) => {
    const url = `/api/downloads?videoId=${clip.videoId}&start=${Math.round(clip.startTime)}&end=${Math.round(clip.endTime)}`;
    window.open(url, "_blank");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#07070d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] p-2.5 animate-pulse">
            <Zap className="w-full h-full text-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-2 rounded-full bg-white/[0.04] animate-pulse" />
            <div className="w-24 h-2 rounded-full bg-white/[0.02] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#07070d] flex">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl"
      >
        {sidebarOpen ? <X className="w-4 h-4 text-white/60" /> : <Menu className="w-4 h-4 text-white/60" />}
      </button>

      <aside className={`fixed lg:static left-0 top-0 bottom-0 w-64 bg-[#0a0a12] border-r border-white/[0.06] p-4 z-40 transition-all duration-300 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <Link href="/" className="flex items-center gap-2 mb-8 px-2 mt-4 lg:mt-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#00d4ff] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-display font-bold tracking-tight">
            ClipWave<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {user?.image ? (
            <img src={user.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1]/20 to-[#7c3aed]/20 flex items-center justify-center">
              <User className="w-4 h-4 text-[#818cf8]" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-white/80">{user?.name || "User"}</p>
            <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === item.id
                  ? "bg-[#6366f1]/10 text-[#818cf8] font-medium"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === "clips" && allClips.length > 0 && (
                <span className="ml-auto text-[10px] bg-[#6366f1]/20 text-[#818cf8] px-2 py-0.5 rounded-full font-medium">
                  {allClips.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="rounded-xl bg-gradient-to-br from-[#6366f1]/5 to-[#7c3aed]/5 border border-white/[0.06] p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/30 tracking-wider uppercase">Credits</span>
            <span className="text-[10px] text-white/50 font-medium">Creator</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-[#6366f1] to-[#00d4ff]" />
          </div>
          <p className="text-[10px] text-white/20 mt-1.5">42/50 clips this month</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/50 hover:bg-white/[0.02] transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              {activeTab === "process" ? "Create New Clips" : activeTab === "clips" ? "My Clips" : activeTab === "history" ? "History" : "Analytics"}
            </h1>
            <p className="text-sm text-white/30 mt-1">
              {activeTab === "process" ? "Paste any YouTube link to get started" : `You have ${allClips.length} clips`}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="btn-ghost p-2.5 rounded-xl">
              <Search className="w-4 h-4" />
            </button>
            <button className="btn-ghost p-2.5 rounded-xl">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="card-premium"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] text-white/30 tracking-wider uppercase">{stat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${stat.color} text-white font-medium`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-display font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit">
          {sidebarItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === item.id
                  ? "bg-white/[0.06] text-white shadow-sm"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              <item.icon className="inline w-3.5 h-3.5 mr-1.5" />
              {item.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "process" ? (
            <motion.div
              key="process"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <VideoProcessor onClipsComplete={handleClipsComplete} />
            </motion.div>
          ) : activeTab === "clips" ? (
            <motion.div
              key="clips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {allClips.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {allClips.map((clip, index) => (
                    <motion.div
                      key={clip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-premium !p-0 overflow-hidden"
                    >
                      <div className="relative aspect-video bg-black">
                        <YouTubePlayer videoId={clip.videoId} start={clip.startTime} end={clip.endTime} />
                        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                          <span className="glass-strong px-2 py-1 rounded-full text-[10px] text-white/80 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-[#10b981]" />
                            {clip.viralScore}%
                          </span>
                          <span className="glass-strong px-2 py-1 rounded-full text-[10px] text-white/50">
                            {Math.round(clip.duration)}s
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-medium text-white/80 line-clamp-1 flex-1">{clip.title}</h3>
                          <div className="flex gap-1 ml-2">
                            {clip.emojis.slice(0, 3).map((e, i) => (
                              <span key={i} className="text-sm">{e}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/30 mb-3 line-clamp-1">{clip.description}</p>
                        <div className="flex items-center gap-2">
                          {clip.exportFormats.map((fmt) => (
                            <button
                              key={fmt.platform}
                              onClick={() => handleExport(clip, fmt.platform)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-strong text-[10px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                            >
                              {fmt.platform === "tiktok" ? "TikTok" : fmt.platform === "reels" ? "Reels" : "Shorts"}
                              <Download className="w-3 h-3" />
                            </button>
                          ))}
                          <button
                            onClick={() => handleExport(clip, "mp4")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-strong text-[10px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all ml-auto"
                          >
                            <Download className="w-3 h-3" /> MP4
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] p-4">
                    <Clapperboard className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2">No clips yet</h3>
                  <p className="text-sm text-white/30 mb-6">Process your first video to see clips here</p>
                  <button onClick={() => setActiveTab("process")} className="btn-primary">
                    <Sparkles className="w-4 h-4" /> Process Video
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
