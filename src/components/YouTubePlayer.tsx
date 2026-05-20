"use client";

import { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  start: number;
  end: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function YouTubePlayer({ videoId, start, end }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(tag, firstScript);

    window.onYouTubeIframeAPIReady = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: {
          start: Math.round(start),
          end: Math.round(end),
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              const checkTime = setInterval(() => {
                if (!playerRef.current) { clearInterval(checkTime); return; }
                try {
                  const currentTime = playerRef.current.getCurrentTime();
                  if (currentTime >= end) {
                    playerRef.current.pauseVideo();
                    playerRef.current.seekTo(start, true);
                    clearInterval(checkTime);
                  }
                } catch {}
              }, 200);
            }
          },
        },
      });
    };

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [videoId, start, end]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}
