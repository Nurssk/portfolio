"use client";

import { useRef, useState } from "react";
import { TRACKS } from "@/lib/config";

export default function NowPlaying() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = TRACKS[idx];

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play().catch(() => {}); setPlaying(true); }
  };
  const step = (dir: number) => {
    const next = (idx + dir + TRACKS.length) % TRACKS.length;
    setIdx(next);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.src = TRACKS[next].src;
      if (playing) el.play().catch(() => {});
    }
  };

  return (
    <div className="card">
      <div className="wlabel" style={{ marginBottom: 8 }}>NOW PLAYING</div>
      <div className="np-head">
        <div className="np-art" />
        <div className="np-meta">
          <div className="np-title">{track.title}</div>
          <div className="np-artist">{track.artist}</div>
        </div>
      </div>
      <div className="np-ctrl">
        <button aria-label="Previous track" onClick={() => step(-1)}>⏮</button>
        <button className="play" aria-label="Play or pause" onClick={toggle}>{playing ? "❚❚" : "▶"}</button>
        <button aria-label="Next track" onClick={() => step(1)}>⏭</button>
      </div>
      <audio ref={audioRef} src={track.src} preload="none" />
    </div>
  );
}
