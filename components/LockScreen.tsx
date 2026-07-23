"use client";

import { useEffect, useRef, useState } from "react";
import { ME, fmtDate, fmtTime } from "@/lib/config";

export default function LockScreen({ now, onUnlock }: { now: Date | null; onUnlock: () => void }) {
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const go = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setTimeout(onUnlock, 480);
  };

  // Unlock on ANY keyboard interaction (no focus needed).
  useEffect(() => {
    const onKey = () => go();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={"lock" + (closing ? " closing" : "")}
      role="button"
      tabIndex={0}
      aria-label="Click to unlock desktop"
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      }}
    >
      <div className="lock-photo" />
      <div className="lock-scrim" />
      <div className="lock-date" suppressHydrationWarning>{now ? fmtDate(now) : ""}</div>
      <div className="lock-time" suppressHydrationWarning>{now ? fmtTime(now) : "--:--"}</div>
      <div style={{ flex: 1, minHeight: 0 }} />
      <div className="lock-foot">
        <div className="lock-name">{ME.name}</div>
        <div className="lock-role">{ME.role}</div>
        <div className="lock-btn">CLICK TO UNLOCK</div>
        <div className="lock-hint">CLICK ANYWHERE TO UNLOCK</div>
      </div>
    </div>
  );
}
