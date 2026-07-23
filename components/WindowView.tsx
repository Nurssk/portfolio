"use client";

import { BOOKS, CERTIFICATES, ME, PROJECTS, WATCHLIST, certById, photoById, projectById } from "@/lib/config";
import type { WinState } from "./Portfolio";

export default function WindowView({
  win, openWindow, onClose, onFocus, onTitleDown,
}: {
  win: WinState;
  openWindow: (id: string, title: string) => void;
  onClose: () => void;
  onFocus: () => void;
  onTitleDown: (e: React.MouseEvent) => void;
}) {
  const windowClassName = "win" + (win.id.startsWith("photo") ? " photo-win" : "");

  return (
    <div
      className={windowClassName}
      role="dialog"
      aria-label={win.title}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      onMouseDown={onFocus}
    >
      <div className="win-bar" onMouseDown={onTitleDown}>
        <div className="tl r" aria-label="Close window" onClick={(e) => { e.stopPropagation(); onClose(); }} />
        <div className="tl y" />
        <div className="tl g" />
        <div className="win-title">{win.title}</div>
      </div>
      <div className="win-body">
        <WindowBody id={win.id} openWindow={openWindow} />
      </div>
    </div>
  );
}

function WindowBody({ id, openWindow }: { id: string; openWindow: (id: string, title: string) => void }) {
  if (id.startsWith("photo")) {
    const p = photoById(id);
    if (!p) return null;
    return (
      <div className="photo-view">
        {p.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="photo-full" src={p.img} alt={p.caption || id} draggable={false} />
        ) : (
          <div className="photo-placeholder" style={{ background: p.grad }} />
        )}
        {p.caption && <div style={{ fontWeight: 700, marginTop: 12 }}>{p.caption}</div>}
        {p.location && <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 11, opacity: 0.55, marginTop: 4 }}>✛ {p.location}</div>}
      </div>
    );
  }
  // folder listing — must be checked before the `cert*` single-file branch
  if (id === "certificates") {
    return (
      <div>
        <div className="meta" style={{ marginBottom: 12 }}>{CERTIFICATES.length} ITEMS</div>
        <div className="folder-grid">
          {CERTIFICATES.map((c) => (
            <div key={c.id} className="folder-file" title={c.title} onClick={() => openWindow(c.id, c.label)}>
              <div className="thumb-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.title} loading="lazy" />
              </div>
              <div className="fname">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // a single certificate, opened in its own window
  if (id.startsWith("cert")) {
    const c = certById(id);
    if (!c) return null;
    return (
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.src} alt={c.title} style={{ width: "100%", display: "block", borderRadius: 10, background: "#fff" }} />
        <div style={{ fontWeight: 700, marginTop: 12 }}>{c.title}</div>
        <a href={c.src} download className="link" style={{ display: "inline-block", marginTop: 10 }}>↓ Download</a>
      </div>
    );
  }
  // my_projects folder → each project is a sub-folder
  if (id === "projects") {
    return (
      <div>
        <div className="meta" style={{ marginBottom: 12 }}>{PROJECTS.length} ITEMS</div>
        <div className="folder-grid">
          {PROJECTS.map((p) => (
            <div key={p.id} className="folder-file" title={p.title} onClick={() => openWindow(p.id, p.name)}>
              <div className="folder-glyph">📁</div>
              <div className="fname">{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // a project folder → readme + github + link files
  if (projectById(id)) {
    const p = projectById(id)!;
    return (
      <div>
        <div className="meta" style={{ marginBottom: 12 }}>{p.name}</div>
        <div className="folder-grid">
          <FileTile label="readme.txt" bg="#fff" fg="#c0392b" icon={<DocIcon />} onClick={() => openWindow(id + "__readme", "readme.txt")} />
          <FileTile label="github" bg="#111" fg="#fff" icon={<GithubIcon />} href={p.github} />
          {p.link && <FileTile label="open link" bg="var(--accent)" fg="#fff" icon={<LinkIcon />} href={p.link} />}
        </div>
      </div>
    );
  }
  // a project readme
  if (id.endsWith("__readme")) {
    const p = projectById(id.replace("__readme", ""));
    if (!p) return null;
    return (
      <div>
        <h3 style={{ fontSize: 18 }}>{p.title}</h3>
        <div className="par">{p.what}</div>
        <div className="lbl">Stack</div>
        <div className="tags">{p.stack.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        <div className="links">
          <a href={p.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer">Live ↗</a>}
        </div>
      </div>
    );
  }
  if (id === "cv") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{ME.name} — CV</div>
            <div style={{ opacity: 0.6, fontSize: 12 }}>{ME.role}</div>
          </div>
          <a href="/cv/cv.pdf" download className="link"
             style={{ flexShrink: 0, padding: "9px 16px", borderRadius: 999, background: "var(--accent)", color: "#fff" }}>
            ↓ Download
          </a>
        </div>
        {/* page rendered to an image so it previews everywhere, incl. mobile */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cv/cv-preview.png" alt={ME.name + " — CV preview"}
             style={{ width: "100%", display: "block", borderRadius: 10, border: "1px solid var(--panelBorder)", background: "#fff" }} />
      </div>
    );
  }
  if (id === "bookshelf") {
    return (
      <div>
        {BOOKS.map((b) => (
          <div key={b.title} className="listrow">
            <div>
              <div style={{ fontWeight: 600 }}>{b.title}</div>
              <div style={{ opacity: 0.6, fontSize: 11.5 }}>{b.author}</div>
            </div>
            <div className="st">{b.status.toUpperCase()}</div>
          </div>
        ))}
      </div>
    );
  }
  if (id === "watchlist") {
    return (
      <div>
        {WATCHLIST.map((w) => (
          <div key={w.title} className="listrow">
            <div>
              <div style={{ fontWeight: 600 }}>{w.title}</div>
              <div style={{ opacity: 0.6, fontSize: 11.5 }}>{w.type}</div>
            </div>
            <div className="st">{w.status.toUpperCase()}</div>
          </div>
        ))}
      </div>
    );
  }
  if (id === "about") {
    return (
      <div>
        <h3 style={{ fontSize: 18 }}>About Me</h3>
        <div className="par">
          I&apos;m a product-minded developer with a strong startup mindset, based in Almaty (GMT+5).
          I focus on product logic, system architecture, and rapid MVP building — turning ideas into
          practical digital products with Flutter, startup thinking, and AI-assisted workflows.
          I like building products that matter and solving real problems through elegant solutions.
        </div>
      </div>
    );
  }
  if (id === "work") {
    return (
      <div>
        <h3 style={{ fontSize: 18 }}>Work</h3>
        {PROJECTS.map((p) => (
          <div key={p.id} className="listrow" style={{ cursor: "pointer" }} onClick={() => openWindow(p.id, p.name)}>
            <div>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div style={{ opacity: 0.6, fontSize: 11.5 }}>{p.stack.join(" · ")}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (id === "contact") {
    return (
      <div>
        <h3 style={{ fontSize: 18 }}>Let&apos;s talk</h3>
        <div className="par">Available for freelance and full-time roles — I&apos;ll reply within a day.</div>
        <a href={"mailto:" + ME.email} className="link" style={{ display: "block", marginBottom: 8 }}>{ME.email}</a>
        <a href={"tel:" + ME.phone.replace(/\s/g, "")} className="link" style={{ display: "block", marginBottom: 8 }}>{ME.phone}</a>
        <a href={ME.github} target="_blank" rel="noopener noreferrer" className="link" style={{ display: "block", marginBottom: 8 }}>GitHub ↗</a>
        <a href={ME.linkedin} target="_blank" rel="noopener noreferrer" className="link" style={{ display: "block" }}>LinkedIn ↗</a>
      </div>
    );
  }
  return <div />;
}

function FileTile({
  label, bg, fg, icon, onClick, href,
}: {
  label: string; bg: string; fg: string; icon: React.ReactNode;
  onClick?: () => void; href?: string;
}) {
  const inner = (
    <>
      <div className="file-ico" style={{ background: bg, color: fg }}>{icon}</div>
      <div className="fname">{label}</div>
    </>
  );
  return href ? (
    <a className="folder-file" href={href} target="_blank" rel="noopener noreferrer" title={label}>{inner}</a>
  ) : (
    <div className="folder-file" onClick={onClick} title={label}>{inner}</div>
  );
}

function DocIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
