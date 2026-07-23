/* ══════════════════════════════════════════════════════════════════════
   CONFIG + DATA — edit this file to make the portfolio yours.
   ══════════════════════════════════════════════════════════════════════ */

export type Social = { label: string; name: string; href: string };
export type Photo = { id: string; label: string; caption: string; location: string; grad: string; img?: string };
export type ListItem = { title: string; author?: string; type?: string; status: string };
export type DockApp = { name: string; initials: string; color: string; logo?: string };
export type Track = { title: string; artist: string; src: string };
export type WeatherItem = { city: string; cond: string; deg: string; hi: string; lo: string; icon: string };
export type ThemeKey = "day" | "plant" | "city" | "night";
export type Theme = {
  sky1: string; sky2: string; sky3: string; panel: string; panelBorder: string;
  text: string; accent: string; dot: string; iconLabelBg: string; gameBg: string;
};
export type IconDef = {
  id: string; label: string; kind: "folder" | "photo" | "doc" | "note" | "list";
  emoji?: string; x: number; y: number;
};

export const ME = {
  name: "Nursultan Sarsenbay",
  role: "UI/UX Designer · Full-Stack Developer",
  blurb: "I turn ideas into practical digital products — product logic, system architecture, and rapid MVP building. ✨",
  email: "nursultan.sarsenbay@nu.edu.kz",
  phone: "+7 705 408 0664",
  github: "https://github.com/Nurssk",
  linkedin: "https://www.linkedin.com/in/nursultan-sarsenbay-a76b763b3/",
  coords: "43.2220°N, 76.8512°E", // Almaty
  socials: [
    { label: "gh", name: "GitHub", href: "https://github.com/Nurssk" },
    { label: "in", name: "LinkedIn", href: "https://www.linkedin.com/in/nursultan-sarsenbay-a76b763b3/" },
  ] as Social[],
};

export const PHOTOS: Photo[] = [
  { id: "photo1", label: "photo_01.jpg", caption: "", location: "", img: "/my-photo/photo1.jpg", grad: "linear-gradient(135deg,#f0a4c9,#8f9fde)" },
  { id: "photo2", label: "photo_02.jpg", caption: "", location: "", img: "/my-photo/photo2.jpg", grad: "linear-gradient(135deg,#a4e0c9,#5b8bc4)" },
  { id: "photo3", label: "photo_03.jpg", caption: "", location: "", img: "/my-photo/photo3.jpg", grad: "linear-gradient(135deg,#8f9fde,#2b2f52)" },
];

export type Certificate = { id: string; label: string; src: string; title: string };

export const CERTIFICATES: Certificate[] = [
  { id: "cert1", label: "volunteering.png", src: "/certificates/cert1.png", title: "New Wave — 150h Volunteering, 2023–2024" },
  { id: "cert2", label: "startup_orda.png", src: "/certificates/cert2.png", title: "Astana Hub — Startup Orda winner" },
  { id: "cert3", label: "startup_school.png", src: "/certificates/cert3.png", title: "Astana Hub — Startup School" },
  { id: "cert4", label: "teenpreneurs.jpg", src: "/certificates/cert4.jpg", title: "Astana Hub — Teenpreneurs programme" },
];

export const certById = (id: string) => CERTIFICATES.find((c) => c.id === id);

export type Project = {
  id: string; name: string; title: string; what: string;
  stack: string[]; github: string; link?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "zenmahjong", name: "zenmahjong",
    title: "zenmahjong — Mahjong Solitaire platform",
    what: "A Mahjong Solitaire game platform — a tile-matching puzzle built for the web, with a calm, focused feel.",
    stack: ["TypeScript", "JavaScript", "HTML", "CSS"],
    github: "https://github.com/nurssk/zenmahjong",
    link: "https://zenmahjong-rose.vercel.app",
  },
  {
    id: "pavloland", name: "PavloLand",
    title: 'PavloLand — "PavloDAR AI" parody',
    what: 'A parody "aura-score" product — a playful PavloDAR AI take that rates your aura for fun.',
    stack: ["Astro", "JavaScript", "HTML", "CSS"],
    github: "https://github.com/nurssk/PavloLand",
    link: "https://pavlodar.vercel.app",
  },
  {
    id: "notlikeai", name: "NotLikeAi",
    title: "NotLikeAi — BeUniq · Fix your UI",
    what: "A screenshot-based UI reviewer: drop in a UI screenshot and get design feedback to fix AI-generated slop.",
    stack: ["Astro", "TypeScript", "JavaScript", "CSS"],
    github: "https://github.com/nurssk/NotLikeAi",
    link: "https://beuniq.design",
  },
  {
    id: "beuniq-skill", name: "beuniq-design-skill",
    title: "beuniq-design-skill — code-only design skill",
    what: "A code-only design skill that detects AI-generated UI slop and audits frontend quality — no AI APIs, no network calls.",
    stack: ["TypeScript"],
    github: "https://github.com/nurssk/beuniq-design-skill",
  },
];

export const projectById = (id: string) => PROJECTS.find((p) => p.id === id);

export const BOOKS: ListItem[] = [
  { title: "Shape Up", author: "Ryan Singer", status: "Reading" },
  { title: "Designing Interfaces", author: "Jenifer Tidwell", status: "Finished" },
  { title: "A Philosophy of Software Design", author: "John Ousterhout", status: "Finished" },
  { title: "Project Hail Mary", author: "Andy Weir", status: "Reading" },
];
export const WATCHLIST: ListItem[] = [
  { title: "Severance", type: "Series", status: "Watching" },
  { title: "Blade Runner 2049", type: "Film", status: "Rewatched" },
  { title: "Abstract: The Art of Design", type: "Docuseries", status: "Finished" },
];

export const DOCK: DockApp[] = [
  { name: "Astro", initials: "As", color: "#ff5d01", logo: "/stack-logo/astro.png" },
  { name: "Figma", initials: "Fi", color: "#7b5cf0", logo: "/stack-logo/figma.png" },
  { name: "Flutter", initials: "Fl", color: "#42a5f5", logo: "/stack-logo/flutter.webp" },
  { name: "Next.js", initials: "Nx", color: "#111111", logo: "/stack-logo/nextjs.png" },
  { name: "React", initials: "Re", color: "#3b7fc4", logo: "/stack-logo/React-icon.svg.webp" },
  // OpenCode: re-upload a clean square logo to public/stack-logo/ and add `logo:` here.
  { name: "OpenCode", initials: "OC", color: "#1f2937" },
];

export const TRACKS: Track[] = [
  { title: "Late Nights in Figma", artist: "Lo-fi Focus", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Shipping Day", artist: "Lo-fi Focus", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Coffee & Commits", artist: "Lo-fi Focus", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export const WEATHER: WeatherItem[] = [
  { city: "Almaty", cond: "Mostly clear", deg: "27°", hi: "32°", lo: "18°", icon: "🌙" },
  { city: "San Francisco", cond: "Foggy", deg: "17°", hi: "19°", lo: "12°", icon: "🌫️" },
];

export const THEMES: Record<ThemeKey, Theme> = {
  day: { sky1: "#cfe8ff", sky2: "#e7f4ff", sky3: "#f7fbff", panel: "rgba(255,255,255,.55)", panelBorder: "rgba(255,255,255,.6)", text: "#1c2b3a", accent: "#3b7fc4", dot: "rgba(28,43,58,.5)", iconLabelBg: "rgba(255,255,255,.55)", gameBg: "#e7f4ff" },
  plant: { sky1: "#d7ead0", sky2: "#eef6e8", sky3: "#f8fbf3", panel: "rgba(255,255,255,.5)", panelBorder: "rgba(255,255,255,.6)", text: "#233524", accent: "#4c7a4f", dot: "rgba(35,53,36,.5)", iconLabelBg: "rgba(255,255,255,.5)", gameBg: "#eef6e8" },
  city: { sky1: "#c7cbe8", sky2: "#9aa0c9", sky3: "#6f74a8", panel: "rgba(255,255,255,.32)", panelBorder: "rgba(255,255,255,.35)", text: "#252646", accent: "#5b5f97", dot: "rgba(37,38,70,.45)", iconLabelBg: "rgba(255,255,255,.35)", gameBg: "#aab0dd" },
  night: { sky1: "#0c1128", sky2: "#171d3d", sky3: "#232b52", panel: "rgba(24,28,52,.55)", panelBorder: "rgba(255,255,255,.12)", text: "#e8ecff", accent: "#8ea8ff", dot: "rgba(232,236,255,.28)", iconLabelBg: "rgba(24,28,52,.5)", gameBg: "#131834" },
};

export const WALLPAPERS: { key: ThemeKey; name: string; iconColor: string; swatch: string }[] = [
  { key: "day", name: "Day", iconColor: "#e8892b", swatch: "linear-gradient(135deg,#cfe8ff,#f7fbff)" },
  { key: "plant", name: "Plant", iconColor: "#3f7a43", swatch: "linear-gradient(135deg,#d7ead0,#f8fbf3)" },
  { key: "city", name: "City", iconColor: "#ffffff", swatch: "linear-gradient(135deg,#c7cbe8,#6f74a8)" },
  { key: "night", name: "Night", iconColor: "#e8ecff", swatch: "linear-gradient(135deg,#0c1128,#232b52)" },
];

// Photo wallpaper shown on the desktop for each theme.
export const WALLPAPER_IMG: Record<ThemeKey, string> = {
  day: "/wallpapers/white-theme.jpg",
  plant: "/wallpapers/green-theme.jpg",
  city: "/wallpapers/flower-theme.jpg",
  night: "/wallpapers/black-theme.jpg",
};

export const ICONS: IconDef[] = [
  { id: "photo1", label: "photo_01.jpg", kind: "photo", x: 36, y: 188 },
  { id: "photo2", label: "photo_02.jpg", kind: "photo", x: 36, y: 306 },
  { id: "photo3", label: "photo_03.jpg", kind: "photo", x: 36, y: 424 },
  { id: "cv", label: "cv.pdf", kind: "doc", x: 164, y: 188 },
  { id: "about", label: "about_me", kind: "note", x: 164, y: 306 },
  { id: "bookshelf", label: "bookshelf", kind: "list", emoji: "📚", x: 164, y: 424 },
  { id: "watchlist", label: "watchlist", kind: "list", emoji: "🎬", x: 164, y: 542 },
  { id: "certificates", label: "certificates", kind: "folder", x: 292, y: 188 },
  { id: "zenmahjong", label: "zenmahjong", kind: "folder", x: 420, y: 188 },
  { id: "pavloland", label: "PavloLand", kind: "folder", x: 420, y: 306 },
  { id: "notlikeai", label: "NotLikeAi", kind: "folder", x: 420, y: 424 },
  { id: "beuniq-skill", label: "beuniq-skill", kind: "folder", x: 420, y: 542 },
];

export const WIN_SIZE: Record<string, [number, number]> = {
  cv: [560, 660], photo1: [520, 460], photo2: [520, 460], photo3: [520, 460],
  bookshelf: [380, 440], watchlist: [380, 400],
  about: [480, 420], contact: [420, 360], work: [440, 380],
  certificates: [560, 460],
  cert1: [660, 520], cert2: [660, 520], cert3: [660, 520], cert4: [660, 520],
  projects: [560, 430],
};

// Window size that also covers the dynamically-keyed project + readme windows.
export function winSize(id: string): [number, number] {
  if (WIN_SIZE[id]) return WIN_SIZE[id];
  if (id.endsWith("__readme")) return [480, 420];
  if (projectById(id)) return [460, 320];
  return [500, 420];
}

export const photoById = (id: string) => PHOTOS.find((p) => p.id === id);

/* live clock helpers */
const pad = (n: number) => (n < 10 ? "0" + n : "" + n);
export const fmtTime = (d: Date) => pad(d.getHours()) + ":" + pad(d.getMinutes());
export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
