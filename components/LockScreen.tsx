"use client";

import { useEffect, useRef, useState } from "react";
import { ME, fmtDate, fmtTime } from "@/lib/config";

export default function LockScreen({ now, onUnlock }: { now: Date | null; onUnlock: () => void }) {
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const pointerStart = useRef<{ x: number; y: number; type: string } | null>(null);

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

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: e.clientX, y: e.clientY, type: e.pointerType };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const distance = Math.hypot(dx, dy);
    const isMobileViewport = window.matchMedia("(max-width: 819px)").matches;

    if (start.type === "touch" || isMobileViewport) {
      if (distance > 56 && Math.abs(dy) > 36) go();
      return;
    }

    if (distance < 8) go();
  };

  return (
    <div
      className={"lock" + (closing ? " closing" : "")}
      role="button"
      tabIndex={0}
      aria-label="Swipe to unlock"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
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
        <div className="lock-btn"><span className="desktop-unlock-copy">CLICK</span><span className="mobile-unlock-copy">SWIPE</span> TO UNLOCK</div>
        <div className="lock-hint"><span className="desktop-unlock-copy">CLICK ANYWHERE</span><span className="mobile-unlock-copy">SWIPE UP</span> TO UNLOCK</div>
      </div>
    </div>
  );
}
