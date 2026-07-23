"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ICONS, THEMES, winSize, type ThemeKey } from "@/lib/config";
import LockScreen from "./LockScreen";
import Desktop from "./Desktop";
import MobileLayout from "./MobileLayout";
import WindowView from "./WindowView";

export type WinState = { id: string; title: string; x: number; y: number; w: number; h: number; z: number };
type Drag = { type: "icon" | "win"; id: string; offX: number; offY: number } | null;
const ICON_LAYOUT_STORAGE_KEY = "nsp-icon-pos-v2";

const iconDefault = (id: string) => {
  const d = ICONS.find((i) => i.id === id);
  return d ? { x: d.x, y: d.y } : { x: 40, y: 200 };
};

export default function Portfolio() {
  const [locked, setLocked] = useState(true);
  const [theme, setTheme] = useState<ThemeKey>("day");
  const [iconPos, setIconPos] = useState<Record<string, { x: number; y: number }>>({});
  const [windows, setWindows] = useState<WinState[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [loaded, setLoaded] = useState(false);
  const nextZ = useRef(10);
  const drag = useRef<Drag>(null);
  const userPicked = useRef(false);

  // hydrate saved icon positions + start the live clock
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(ICON_LAYOUT_STORAGE_KEY) || "{}");
      if (saved && typeof saved === "object") setIconPos(saved);
    } catch {}
    setLoaded(true);
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // follow the OS theme on load (dark → night, light → day) and keep following
  // system changes until the user manually picks a wallpaper.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { if (!userPicked.current) setTheme(mq.matches ? "night" : "day"); };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // persist icon positions
  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(ICON_LAYOUT_STORAGE_KEY, JSON.stringify(iconPos)); } catch {}
    }
  }, [iconPos, loaded]);

  // global drag listeners (desktop only)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const d = drag.current;
      if (!d) return;
      const x = Math.max(0, e.clientX - d.offX);
      const y = Math.max(44, e.clientY - d.offY);
      if (d.type === "icon") setIconPos((p) => ({ ...p, [d.id]: { x, y } }));
      else setWindows((ws) => ws.map((w) => (w.id === d.id ? { ...w, x, y } : w)));
    };
    const up = () => { drag.current = null; };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, []);

  const startIconDrag = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const pos = iconPos[id] || iconDefault(id);
    drag.current = { type: "icon", id, offX: e.clientX - pos.x, offY: e.clientY - pos.y };
  }, [iconPos]);

  const focusWindow = useCallback((id: string) => {
    nextZ.current += 1;
    const z = nextZ.current;
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z } : w)));
  }, []);

  const openWindow = useCallback((id: string, title: string) => {
    setWindows((ws) => {
      nextZ.current += 1;
      const z = nextZ.current;
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, z } : w));
      const [w, h] = winSize(id);
      const count = ws.length;
      return [...ws, { id, title, x: 260 + (count * 34) % 260, y: 90 + (count * 28) % 160, w, h, z }];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const closeAllWindows = useCallback(() => {
    setWindows([]);
  }, []);

  const startWinDrag = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    focusWindow(id);
    setWindows((ws) => {
      const w = ws.find((x) => x.id === id);
      if (w) drag.current = { type: "win", id, offX: e.clientX - w.x, offY: e.clientY - w.y };
      return ws;
    });
  }, [focusWindow]);

  const pickTheme = useCallback((t: ThemeKey) => {
    userPicked.current = true;
    setTheme(t);
  }, []);

  // theme CSS variables applied to the root so everything inherits them
  const t = THEMES[theme];
  const themeVars = Object.fromEntries(
    Object.entries(t).map(([k, v]) => ["--" + k, v])
  ) as React.CSSProperties;

  return (
    <div className="root" style={themeVars}>
      {locked ? (
        <LockScreen now={now} onUnlock={() => setLocked(false)} />
      ) : (
        <>
          <Desktop
            now={now}
            theme={theme}
            setTheme={pickTheme}
            iconPos={iconPos}
            startIconDrag={startIconDrag}
            openWindow={openWindow}
            closeAllWindows={closeAllWindows}
          />
          <MobileLayout openWindow={openWindow} theme={theme} />
          {windows.map((w) => (
            <WindowView
              key={w.id}
              win={w}
              openWindow={openWindow}
              onClose={() => closeWindow(w.id)}
              onFocus={() => focusWindow(w.id)}
              onTitleDown={(e) => startWinDrag(w.id, e)}
            />
          ))}
        </>
      )}
    </div>
  );
}
