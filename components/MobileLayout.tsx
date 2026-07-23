"use client";

import {
  ME, ICONS, DOCK, WALLPAPER_IMG, CERTIFICATES, photoById, projectById,
  type IconDef, type ThemeKey,
} from "@/lib/config";
import Weather from "./Weather";

// Extra "apps" that have no desktop icon but deserve a home-screen tile.
const EXTRA: { id: string; label: string }[] = [
  { id: "contact", label: "Contact" },
];

export default function MobileLayout({
  openWindow, theme,
}: {
  openWindow: (id: string, title: string) => void;
  theme: ThemeKey;
}) {
  return (
    <div className="mobile">
      <div className="ios-bg" style={{ backgroundImage: `url('${WALLPAPER_IMG[theme]}')` }} />
      <div className="ios-scrim" />

      <div className="ios">
        {/* widget row — live weather, same card as the desktop */}
        <div className="ios-widgets">
          <Weather />
          <div className="ios-socials" aria-label="Social links">
            {ME.socials.map((s) => (
              <a key={s.name} className="ios-social" href={s.href} target="_blank" rel="noopener noreferrer" title={s.name}>
                <SocialGlyph name={s.name} />
                <span>{s.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* app grid */}
        <div className="ios-grid">
          {ICONS.map((def) => (
            <AppTile key={def.id} def={def} onOpen={() => openWindow(def.id, def.label)} />
          ))}
          {EXTRA.map((e) => (
            <div key={e.id} className="ios-app" onClick={() => openWindow(e.id, e.label.toLowerCase())}>
              <div className="tile" style={{ background: "linear-gradient(160deg,#5b8bc4,#3b5f9e)", color: "#fff", fontWeight: 700, fontSize: 20 }}>
                {e.label[0]}
              </div>
              <div className="lbl">{e.label}</div>
            </div>
          ))}
        </div>

        {/* dock — tech stack */}
        <div className="ios-dock">
          {DOCK.map((a) => (
            <div key={a.name} className="ios-dock-app" title={a.name}>
              {a.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.logo} alt={a.name} />
              ) : (
                <span style={{ background: a.color, color: "#fff" }}>{a.initials}</span>
              )}
            </div>
          ))}
        </div>

        <div className="ios-foot">© 2026 {ME.name}</div>
      </div>
    </div>
  );
}

function SocialGlyph({ name }: { name: string }) {
  if (name === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function AppTile({ def, onOpen }: { def: IconDef; onOpen: () => void }) {
  const isFolder = def.kind === "folder";
  return (
    <div className="ios-app" onClick={onOpen}>
      <div className={isFolder ? "tile folder-tile" : "tile"} style={tileStyle(def)}>{tileContent(def)}</div>
      <div className="lbl">{def.label.replace(/\.(jpg|pdf)$/, "")}</div>
    </div>
  );
}

function tileStyle(def: IconDef): React.CSSProperties {
  if (def.kind === "photo") return { background: "#111" };
  if (def.kind === "doc") return { background: "#fff" };
  if (def.kind === "note") return { background: "linear-gradient(160deg,#ffe9a8,#f6d264)" };
  if (def.kind === "list") return { background: "linear-gradient(160deg,#f4f4f6,#dcdce2)" };
  if (def.kind === "folder") return { background: "transparent", boxShadow: "none" };
  return { background: "linear-gradient(160deg,#7f8cff,#4a5bd6)" };
}

function tileContent(def: IconDef) {
  if (def.kind === "photo") {
    const p = photoById(def.id);
    // eslint-disable-next-line @next/next/no-img-element
    return p?.img ? <img src={p.img} alt={def.label} /> : null;
  }
  if (def.kind === "doc") return <span style={{ color: "#c0392b", fontWeight: 800, fontSize: 14 }}>PDF</span>;
  if (def.kind === "note") return <span style={{ fontSize: 24 }}>🗒️</span>;
  if (def.kind === "list") return <span style={{ fontSize: 24 }}>{def.emoji}</span>;
  if (def.kind === "folder") return <MobileFolderPreview def={def} />;
  return null;
}

type FolderPreviewItem =
  | { kind: "image"; label: string; src: string }
  | { kind: "text"; label: string; text: string; bg: string; fg?: string };

function MobileFolderPreview({ def }: { def: IconDef }) {
  const items = folderPreviewItems(def);
  return (
    <div className="mobile-folder" aria-hidden="true">
      <div className="folder-mini-grid">
        {items.slice(0, 4).map((item) => (
          <div key={item.label} className="folder-mini" style={item.kind === "text" ? { background: item.bg, color: item.fg || "#fff" } : undefined}>
            {item.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt="" draggable={false} />
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}
      </div>
      <div className="folder-badge">{folderBadgeCount(def)}</div>
    </div>
  );
}

function folderPreviewItems(def: IconDef): FolderPreviewItem[] {
  if (def.id === "certificates") {
    return CERTIFICATES.slice(0, 4).map((c) => ({ kind: "image", label: c.id, src: c.src }));
  }

  const project = projectById(def.id);
  if (!project) {
    return [{ kind: "text", label: "folder", text: "DIR", bg: "linear-gradient(160deg,#7f8cff,#4a5bd6)" }];
  }

  const liveItem: FolderPreviewItem = project.link
    ? { kind: "text", label: "live", text: "↗", bg: "linear-gradient(160deg,#31c48d,#12805c)" }
    : { kind: "text", label: "code", text: project.stack[0]?.slice(0, 2).toUpperCase() || "</>", bg: "linear-gradient(160deg,#4f46e5,#27318f)" };

  return [
    { kind: "text", label: "readme", text: "TXT", bg: "linear-gradient(160deg,#ffffff,#dfe4ea)", fg: "#ba2b2b" },
    { kind: "text", label: "github", text: "GH", bg: "#111", fg: "#fff" },
    liveItem,
  ];
}

function folderBadgeCount(def: IconDef) {
  if (def.id === "certificates") return CERTIFICATES.length;
  const project = projectById(def.id);
  if (!project) return 1;
  return project.link ? 3 : 2;
}
