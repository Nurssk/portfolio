"use client";

import {
  ME, ICONS, WALLPAPERS, WALLPAPER_IMG, DOCK,
  fmtDate, fmtTime, type ThemeKey,
} from "@/lib/config";
import DesktopIcon from "./DesktopIcon";
import NowPlaying from "./NowPlaying";
import Bricks from "./Bricks";
import Weather from "./Weather";

type Props = {
  now: Date | null;
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  iconPos: Record<string, { x: number; y: number }>;
  startIconDrag: (id: string, e: React.MouseEvent) => void;
  openWindow: (id: string, title: string) => void;
  closeAllWindows: () => void;
};

// Brand marks for the browser-style tabs (inherit `color`).
function SocialIcon({ name }: { name: string }) {
  if (name === "GitHub")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

// macOS-style monochrome glyphs for the wallpaper switcher (inherit `color`).
function WallIcon({ k }: { k: ThemeKey }) {
  const p = { width: 16, height: 16, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  if (k === "day")
    return (
      <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
      </svg>
    );
  if (k === "plant")
    return (
      <svg {...p} fill="currentColor">
        <path d="M20 3c0 8-3.5 13-9 13a6 6 0 0 1-6-6C5 5 12 3 20 3z" opacity=".95" />
        <path d="M8 20c1.5-5 4.5-8 9-10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  if (k === "city")
    return (
      <svg {...p} fill="currentColor">
        <path d="M3 21V10l5-2v3l5-3v4l5-2v11z" />
        <rect x="6" y="13" width="1.6" height="1.6" fill="#6f74a8" />
        <rect x="10.5" y="12" width="1.6" height="1.6" fill="#6f74a8" />
        <rect x="15" y="13" width="1.6" height="1.6" fill="#6f74a8" />
      </svg>
    );
  return (
    <svg {...p} fill="currentColor">
      <path d="M21 12.9A8.5 8.5 0 1 1 11.1 3a6.7 6.7 0 0 0 9.9 9.9z" />
    </svg>
  );
}

export default function Desktop(p: Props) {
  const clock = p.now ? `${fmtDate(p.now)} · ${fmtTime(p.now)}` : "";
  return (
    <div className="desktop desktop-only" onMouseDown={p.closeAllWindows}>
      <div className="desk-photo" style={{ backgroundImage: `url('${WALLPAPER_IMG[p.theme]}')` }} />
      <div className="desk-scrim" />
      <div className="grid-overlay" />

      {/* menu bar */}
      <div className="menubar" onMouseDown={(e) => e.stopPropagation()}>
        <div className="left">
          <div className="brand"><span>{ME.name}</span></div>
          <nav>
            <span onClick={() => p.openWindow("work", "work")}>Work</span>
            <span onClick={() => p.openWindow("about", "about_me")}>About</span>
            <span onClick={() => p.openWindow("contact", "contact")}>Contact</span>
          </nav>
        </div>
        <div className="right">
          <div className="tabs">
            {ME.socials.map((s) => (
              <a key={s.name} className="tab" href={s.href} title={`Open ${s.name}`}
                 target="_blank" rel="noopener noreferrer">
                <SocialIcon name={s.name} />
                <span>{s.name}</span>
              </a>
            ))}
          </div>
          <span className="clock" suppressHydrationWarning>{clock}</span>
        </div>
      </div>

      {/* icons */}
      {ICONS.map((def) => (
        <DesktopIcon
          key={def.id}
          def={def}
          pos={p.iconPos[def.id] || { x: def.x, y: def.y }}
          onMouseDown={(e) => { e.stopPropagation(); p.startIconDrag(def.id, e); }}
          onOpen={() => p.openWindow(def.id, def.label)}
        />
      ))}

      {/* widget column */}
      <div className="widgets" onMouseDown={(e) => e.stopPropagation()}>
        <div className="card">
          <div className="wlabel">WALLPAPER</div>
          <div className="wp-row">
            {WALLPAPERS.map((wp) => (
              <div
                key={wp.key}
                className="wp"
                title={wp.name}
                style={{ background: wp.swatch, borderColor: p.theme === wp.key ? "var(--accent)" : "transparent", color: wp.iconColor }}
                onClick={() => p.setTheme(wp.key)}
              >
                <WallIcon k={wp.key} />
              </div>
            ))}
          </div>
        </div>

        <Weather />

        <NowPlaying />
        <Bricks />
      </div>

      {/* dock */}
      <div className="dock-wrap" onMouseDown={(e) => e.stopPropagation()}>
        <div className="dock-label">TECH STACK</div>
        <div className="dock">
          {DOCK.map((a) => (
            <div key={a.name} className="app" title={a.name} style={a.logo ? { background: "transparent" } : { background: a.color }}>
              {a.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.logo} alt={a.name} />
              ) : (
                a.initials
              )}
            </div>
          ))}
          <div className="sep" />
          <div className="trash" title="Trash">🗑</div>
        </div>
      </div>

      {/* footer */}
      <div className="foot l">✛ {ME.coords}</div>
      <div className="foot r">© 2026 {ME.name.toUpperCase()} ✛</div>
    </div>
  );
}
