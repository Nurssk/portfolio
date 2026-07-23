"use client";

import { type IconDef, photoById } from "@/lib/config";

export default function DesktopIcon({
  def, pos, onMouseDown, onOpen,
}: {
  def: IconDef;
  pos: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent) => void;
  onOpen: () => void;
}) {
  return (
    <div
      className="icon"
      tabIndex={0}
      role="button"
      aria-label={"Open " + def.label}
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
      onDoubleClick={onOpen}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }}
    >
      <Glyph def={def} />
      <div className="label">{def.label}</div>
    </div>
  );
}

function Glyph({ def }: { def: IconDef }) {
  if (def.kind === "folder") return <div className="glyph">📁</div>;
  if (def.kind === "doc") return <div className="glyph">📄</div>;
  if (def.kind === "note") return <div className="glyph">🗒️</div>;
  if (def.kind === "list") return <div className="glyph">{def.emoji}</div>;
  if (def.kind === "photo") {
    const p = photoById(def.id);
    return (
      <div className="thumb">
        {p?.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.img} alt={p.caption || def.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: p?.grad }} />
        )}
      </div>
    );
  }
  return null;
}
