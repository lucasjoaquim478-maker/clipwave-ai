"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube, Sparkles, ArrowRight, Loader2, CheckCircle2, AlertCircle,
  BarChart3, Clock, Film, Music, Captions, Scissors, Wand2, Download,
  Play, TrendingUp, Zap, Link, ShieldCheck, Search, Hash,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import YouTubePlayer from "@/components/YouTubePlayer";
import type { ProcessingJob, Clip } from "@/lib/types";

interface Props {
  onClipsComplete?: (clips: Clip[]) => void;
}

export default function VideoProcessor({ onClipsComplete }: Props = {}) {
  const [url, setUrl] = useState("");
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [polling, setPolling] = useState(false);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = useCallback(async () => {
    if (!url.trim() || !recaptchaToken) return;
    setJob(null);
    setSelectedClip(null);
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
    } catch {
      setPolling(false);
    }
  }, [url, recaptchaToken, onClipsComplete]);

  const handleExport = async (clip: Clip, _platform: string) => {
    const dlUrl = `/api/downloads?videoId=${clip.videoId}&start=${Math.round(clip.startTime)}&end=${Math.round(clip.endTime)}`;
    window.open(dlUrl, "_blank");
  };

  if (job?.status === "complete" && job.clips) {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium border-[#10b981]/20 mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h3 className="text-base font-display font-semibold text-[#10b981]">Processing Complete!</h3>
              <p className="text-xs text-white/40">{job.clips.length} clips generated from &ldquo;{job.videoInfo?.title}&rdquo;</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: "Clips Generated", value: job.clips.length, color: "from-[#00d4ff] to-[#06b6d4]" },
            { label: "Total Duration", value: `${Math.round(job.clips.reduce((a, c) => a + c.duration, 0))}s`, color: "from-[#6366f1] to-[#7c3aed]" },
            { label: "Avg Viral Score", value: `${Math.round(job.clips.reduce((a, c) => a + c.viralScore, 0) / job.clips.length)}%`, color: "from-[#10b981] to-[#059669]" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium text-center"
            >
              <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} p-2.5 mb-3`}>
                <BarChart3 className="w-full h-full text-white" />
              </div>
              <p className="text-2xl font-display font-bold tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {job.clips.map((clip, index) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`card-premium !p-0 overflow-hidden transition-all duration-300 ${
                selectedClip?.id === clip.id ? "border-[#6366f1]/30 neon-glow" : ""
              }`}
            >
              <div className="relative aspect-video bg-black">
                <YouTubePlayer videoId={clip.videoId} start={clip.startTime} end={clip.endTime} />
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <span className="glass-strong px-2 py-1 rounded-full text-[10px] text-white/80 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-[#10b981]" />{clip.viralScore}%
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

        <div className="flex justify-center mt-8">
          <button
            onClick={() => { setJob(null); setSelectedClip(null); setUrl(""); }}
            className="btn-primary"
          >
            <Sparkles className="w-4 h-4" /> Process Another Video
          </button>
        </div>
      </div>
    );
  }

  if (polling || (job && ["queued", "downloading", "analyzing", "processing", "transcribing", "rendering"].includes(job.status))) {
    return (
      <div className="card-premium p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] p-4 animate-pulse">
            <Loader2 className="w-full h-full text-white animate-spin" />
          </div>
          <h3 className="text-lg font-display font-semibold mb-2">AI Processing Your Video...</h3>
          <p className="text-sm text-white/40">{job?.videoInfo?.title || "Analyzing content..."}</p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${job?.progress || 0}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#00d4ff]"
            />
          </div>
          <p className="text-right text-[10px] text-white/20 mt-1">{job?.progress || 0}%</p>
        </div>

        <div className="max-w-md mx-auto space-y-2">
          {[
            { label: "Analyzing video", progress: 5 },
            { label: "Downloading video", progress: 15 },
            { label: "Extracting audio", progress: 35 },
            { label: "Transcribing with AI", progress: 50 },
            { label: "Detecting viral moments", progress: 65 },
            { label: "Creating vertical clips", progress: 75 },
            { label: "Generating captions", progress: 90 },
            { label: "Finalizing", progress: 100 },
          ].map((step, i) => {
            const progress = job?.progress || 0;
            const status = progress >= step.progress ? "done" : progress >= step.progress - 10 ? "active" : "pending";
            return (
              <div key={i} className="flex items-center gap-3 text-sm">
                {status === "done" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                ) : status === "active" ? (
                  <Loader2 className="w-4 h-4 text-[#00d4ff] animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/[0.06] flex-shrink-0" />
                )}
                <span className={`${
                  status === "done" ? "text-white/40" : status === "active" ? "text-white/70" : "text-white/20"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (job?.status === "error") {
    return (
      <div className="card-premium border-red-500/20 text-center p-8">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-display font-semibold text-red-400 mb-2">Processing Error</h3>
        <p className="text-sm text-white/50 mb-6">{job.error}</p>
        <button onClick={() => { setJob(null); }} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="card-premium p-6 sm:p-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#06b6d4] p-4">
          <Youtube className="w-full h-full text-white" />
        </div>
        <h3 className="text-xl font-display font-semibold mb-2">Paste a YouTube Link</h3>
        <p className="text-sm text-white/40">AI will download, analyze, and create viral clips automatically</p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
            Process
            <ArrowRight className="ml-2 w-4 h-4" />
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

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/20">
          <ShieldCheck className="w-3 h-3 text-[#10b981]" />
          Anti-bot verification active
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[10px] text-white/20 tracking-wider uppercase">
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Up to 4K</span>
          <span className="flex items-center gap-1.5"><Film className="w-3 h-3" /> Streams up to 3h</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Auto clips</span>
        </div>
      </div>
    </div>
  );
}
