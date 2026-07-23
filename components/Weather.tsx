"use client";

import { useEffect, useState } from "react";

// Display name only — coordinates live in app/api/weather/route.ts
const CITY = "Almaty";

type Now = { temp: number; hi: number; lo: number; code: number; isDay: boolean };

// WMO weather codes → label + emoji (day/night aware).
function describe(code: number, isDay: boolean): { text: string; icon: string } {
  const clear = isDay ? "☀️" : "🌙";
  const partly = isDay ? "⛅" : "☁️";
  if (code === 0) return { text: isDay ? "Clear sky" : "Clear", icon: clear };
  if (code === 1) return { text: "Mainly clear", icon: clear };
  if (code === 2) return { text: "Partly cloudy", icon: partly };
  if (code === 3) return { text: "Overcast", icon: "☁️" };
  if (code === 45 || code === 48) return { text: "Fog", icon: "🌫️" };
  if (code >= 51 && code <= 57) return { text: "Drizzle", icon: "🌦️" };
  if (code >= 61 && code <= 67) return { text: "Rain", icon: "🌧️" };
  if (code >= 71 && code <= 77) return { text: "Snow", icon: "🌨️" };
  if (code >= 80 && code <= 82) return { text: "Rain showers", icon: "🌦️" };
  if (code >= 85 && code <= 86) return { text: "Snow showers", icon: "🌨️" };
  if (code >= 95) return { text: "Thunderstorm", icon: "⛈️" };
  return { text: "—", icon: clear };
}

export default function Weather() {
  const [w, setW] = useState<Now | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async (attempt = 0): Promise<void> => {
      try {
        const r = await fetch("/api/weather", { cache: "no-store" });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const d = await r.json();
        if (d.error) throw new Error(d.error);
        if (!alive) return;
        setW({ temp: d.temp, code: d.code, isDay: d.isDay, hi: d.hi, lo: d.lo });
        setErr(false);
      } catch {
        if (!alive) return;
        if (attempt < 2) { setTimeout(() => load(attempt + 1), 1500); return; }
        setErr(true);
      }
    };
    load();
    // refresh every 15 min while the page stays open
    const t = setInterval(() => load(), 15 * 60 * 1000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const info = w ? describe(w.code, w.isDay) : { text: err ? "Unavailable" : "Loading…", icon: "" };

  return (
    <div className="card weather">
      <div className="wlabel" style={{ marginBottom: 10 }}>WEATHER — NOW</div>
      <div className="w-city">
        {CITY}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
        </svg>
      </div>
      <div className="w-temp" suppressHydrationWarning>{w ? `${w.temp}°` : "—"}</div>
      {info.icon && <div className="w-icon">{info.icon}</div>}
      <div className="w-cond">{info.text}</div>
      {w && (
        <div className="w-hilo">
          <span>↓ {w.lo}°</span>
          <span>↑ {w.hi}°</span>
        </div>
      )}
    </div>
  );
}
