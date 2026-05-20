"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Clock,
  Film,
  Music,
  Captions,
  Scissors,
  Wand2,
  Download,
  Share2,
  Play,
  TrendingUp,
  Zap,
  Link,
  Hash,
  ShieldCheck,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import type { ProcessingJob, Clip } from "@/lib/types";

interface ProgressStep {
  status: "pending" | "active" | "done" | "error";
  label: string;
  icon: any;
  progress: number;
}

interface Props {
  onClipsComplete?: (clips: Clip[]) => void;
}

export default function VideoProcessor({ onClipsComplete }: Props = {}) {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [editingCaptions, setEditingCaptions] = useState(false);
  const [captionTexts, setCaptionTexts] = useState<Record<string, string>>({});
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const steps: ProgressStep[] = [
    { status: "pending", label: "Analisando vídeo", icon: Search, progress: 5 },
    { status: "pending", label: "Baixando vídeo", icon: Youtube, progress: 15 },
    { status: "pending", label: "Extraindo áudio", icon: Music, progress: 35 },
    { status: "pending", label: "Transcrevendo com IA", icon: Captions, progress: 50 },
    { status: "pending", label: "Detectando momentos virais", icon: TrendingUp, progress: 65 },
    { status: "pending", label: "Criando cortes verticais", icon: Scissors, progress: 75 },
    { status: "pending", label: "Gerando legendas animadas", icon: Wand2, progress: 90 },
    { status: "pending", label: "Finalizando", icon: Sparkles, progress: 100 },
  ];

  const updateSteps = (progress: number): ProgressStep[] => {
    return steps.map((s) => ({
      ...s,
      status: progress >= s.progress ? "done" : progress >= s.progress - 10 ? "active" : "pending",
    }));
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = useCallback(async () => {
    if (!url.trim() || !recaptchaToken) return;

    setJobId(null);
    setJob(null);
    setSelectedClip(null);
    setEditingCaptions(false);
    setPolling(true);

    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), recaptchaToken }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setRecaptchaToken(null);
        setPolling(false);
        return;
      }
      setJob(data.job);
      setPolling(false);
      if (data.job?.status === "complete" && data.job?.clips && onClipsComplete) {
        onClipsComplete(data.job.clips);
      }
    } catch (err) {
      console.error("Erro ao iniciar processamento:", err);
      setPolling(false);
    }
  }, [url, recaptchaToken]);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const handleCaptionEdit = (clipId: string, captionId: string, text: string) => {
    setCaptionTexts((prev) => ({ ...prev, [`${clipId}_${captionId}`]: text }));
  };

  const handleExport = async (clipId: string, platform: string) => {
    try {
      const res = await fetch("/api/clips", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clipId, platform }),
      });
      const data = await res.json();
      if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const currentSteps = job ? updateSteps(job.progress) : steps;

  if (job?.status === "complete" && job.clips) {
    return (
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border border-green-500/20 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-display font-semibold text-green-400">Processamento concluído!</h3>
          </div>
          <p className="text-sm text-white/50">{job.clips.length} cortes gerados a partir de &ldquo;{job.videoInfo?.title}&rdquo;</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: "Cortes Gerados", value: job.clips.length, color: "from-neon-blue to-cyan-400" },
            { label: "Duração Total", value: `${Math.round(job.clips.reduce((a, c) => a + c.duration, 0))}s`, color: "from-primary-500 to-neon-purple" },
            { label: "Score Viral Médio", value: `${Math.round(job.clips.reduce((a, c) => a + c.viralScore, 0) / job.clips.length)}%`, color: "from-green-400 to-emerald-500" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-4 text-center">
              <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} p-2.5 mb-2`}><BarChart3 className="w-full h-full text-white" /></div>
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {job.clips.map((clip, index) => (
            <motion.div key={clip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className={`glass rounded-2xl overflow-hidden border transition-all ${selectedClip?.id === clip.id ? "border-primary-500/50 neon-glow" : "border-white/10"}`}>
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center group cursor-pointer"
                   onClick={() => setSelectedClip(selectedClip?.id === clip.id ? null : clip)}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Play className="w-16 h-16 text-white/30 group-hover:text-white/60 group-hover:scale-110 transition-all z-10" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
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
                <div className="flex items-center gap-2 mb-3">
                  {clip.exportFormats.map((fmt) => (
                    <button key={fmt.platform} onClick={() => handleExport(clip.id, fmt.platform)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-xs text-white/60">
                      {fmt.platform === "tiktok" ? "TikTok" : fmt.platform === "reels" ? "Reels" : "Shorts"}
                      <Download className="w-3 h-3" />
                    </button>
                  ))}
                  <button onClick={() => handleExport(clip.id, "mp4")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-xs text-white/60 ml-auto">
                    <Download className="w-3 h-3" />MP4
                  </button>
                </div>
                <button onClick={() => { setSelectedClip(clip); setEditingCaptions(true); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg glass glass-hover text-xs text-white/50">
                  <Captions className="w-3.5 h-3.5" />Editar Legendas
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button onClick={() => { setJob(null); setJobId(null); setSelectedClip(null); setUrl(""); }} className="btn-primary">
            Processar Outro Vídeo
          </button>
        </div>
      </div>
    );
  }

  if (polling || (job && (job.status === "queued" || job.status === "downloading" || job.status === "analyzing" || job.status === "processing" || job.status === "transcribing" || job.status === "rendering"))) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-neon-purple p-4 animate-pulse">
            <Loader2 className="w-full h-full text-white animate-spin" />
          </div>
          <h3 className="text-xl font-display font-semibold mb-2">IA processando seu vídeo...</h3>
           <p className="text-sm text-white/50">{job?.videoInfo?.title || "Analisando conteúdo..."}</p>
        </div>
        <div className="max-w-xl mx-auto mb-8">
          <div className="h-3 rounded-full bg-white/5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${job?.progress || 0}%` }} transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-neon-blue via-primary-500 to-neon-purple" />
          </div>
          <p className="text-right text-xs text-white/30 mt-1">{job?.progress || 0}%</p>
        </div>
        <div className="max-w-md mx-auto space-y-3">
          {currentSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              {step.status === "done" ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                : step.status === "active" ? <Loader2 className="w-4 h-4 text-neon-blue animate-spin flex-shrink-0" />
                : <div className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0" />}
              <span className={`${step.status === "done" ? "text-white/60" : step.status === "active" ? "text-white/80" : "text-white/30"}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (job?.status === "error") {
    return (
      <div className="glass rounded-2xl p-8 border border-red-500/20 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-display font-semibold text-red-400 mb-2">Erro no processamento</h3>
        <p className="text-sm text-white/50 mb-6">{job.error}</p>
        <button onClick={() => { setJob(null); setJobId(null); }} className="btn-primary">Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-blue to-cyan-400 p-4">
          <Youtube className="w-full h-full text-white" />
        </div>
        <h3 className="text-xl font-display font-semibold mb-2">Cole o link do YouTube</h3>
        <p className="text-sm text-white/50">A IA vai baixar, analisar e criar cortes virais automáticos</p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="url" value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="input-field !pl-10 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!url.trim() || !recaptchaToken}
            className="btn-primary !px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Processar
            <ArrowRight className="inline ml-2 w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={handleRecaptchaChange}
            theme="dark"
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
          <ShieldCheck className="w-3 h-3 text-green-400" />
          Verificação anti-bot ativada
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/30">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Até 4K</span>
          <span className="flex items-center gap-1"><Film className="w-3 h-3" /> Lives de até 3h</span>
          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Cortes automáticos</span>
        </div>
      </div>
    </div>
  );
}

function Search(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
