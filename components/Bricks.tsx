"use client";

import { useEffect, useRef, useState } from "react";

type Brick = { x: number; y: number; w: number; h: number; alive: boolean };
type Game = {
  bricks: Brick[]; paddleX: number; paddleW: number;
  ballX: number; ballY: number; ballVX: number; ballVY: number; radius: number; running: boolean;
};
type Status = "idle" | "playing" | "over" | "won";

const TXT: Record<Status, string> = {
  idle: "CLICK TO PLAY",
  playing: "",
  over: "GAME OVER — CLICK TO RETRY",
  won: "ALL CLEAR — CLICK TO REPLAY",
};

export default function Bricks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const rafRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<Status>("idle");

  const setStat = (s: Status) => { statusRef.current = s; setStatus(s); };

  const draw = () => {
    const cvs = canvasRef.current, g = gameRef.current;
    if (!cvs || !g) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    g.bricks.forEach((b) => { if (b.alive) { ctx.fillStyle = "#ff8fa3"; ctx.fillRect(b.x, b.y, b.w, b.h); } });
    ctx.fillStyle = "#3b7fc4";
    ctx.fillRect(g.paddleX, cvs.height - 8, g.paddleW, 5);
    ctx.beginPath();
    ctx.arc(g.ballX, g.ballY, g.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#1c2b3a";
    ctx.fill();
  };

  const reset = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const W = cvs.width, H = cvs.height, rows = 4, cols = 8, bw = W / cols, bh = 12;
    const bricks: Brick[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        bricks.push({ x: c * bw, y: 18 + r * bh, w: bw - 3, h: bh - 3, alive: true });
    gameRef.current = {
      bricks, paddleX: W / 2 - 20, paddleW: 40,
      ballX: W / 2, ballY: H - 30, ballVX: 2.4, ballVY: -2.6, radius: 3.5, running: false,
    };
    scoreRef.current = 0;
    setScore(0);
    setStat("idle");
    draw();
  };

  const end = (s: Status) => {
    const g = gameRef.current;
    if (g) g.running = false;
    setBest((b) => Math.max(b, scoreRef.current));
    setStat(s);
    draw();
  };

  const step = () => {
    const g = gameRef.current, cvs = canvasRef.current;
    if (!g || !cvs || !g.running) return;
    const W = cvs.width, H = cvs.height;
    g.ballX += g.ballVX; g.ballY += g.ballVY;
    if (g.ballX < g.radius || g.ballX > W - g.radius) g.ballVX *= -1;
    if (g.ballY < g.radius) g.ballVY *= -1;
    if (g.ballY > H - 12 && g.ballY < H - 6 && g.ballX > g.paddleX && g.ballX < g.paddleX + g.paddleW) {
      g.ballVY = -Math.abs(g.ballVY);
      g.ballVX = ((g.ballX - (g.paddleX + g.paddleW / 2)) / (g.paddleW / 2)) * 3;
    }
    let scored = false;
    g.bricks.forEach((b) => {
      if (b.alive && g.ballX > b.x && g.ballX < b.x + b.w && g.ballY > b.y && g.ballY < b.y + b.h) {
        b.alive = false; g.ballVY *= -1; scored = true;
      }
    });
    if (scored) { scoreRef.current += 10; setScore(scoreRef.current); }
    if (g.ballY > H + 10) { end("over"); return; }
    if (g.bricks.every((b) => !b.alive)) { end("won"); return; }
    draw();
    rafRef.current = requestAnimationFrame(step);
  };

  const start = () => {
    if (statusRef.current !== "playing" && statusRef.current !== "idle") reset();
    const g = gameRef.current;
    if (!g || g.running) return;
    g.running = true;
    setStat("playing");
    step();
  };

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const g = gameRef.current, cvs = canvasRef.current;
    if (!g || !cvs) return;
    const rect = cvs.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (cvs.width / rect.width);
    g.paddleX = Math.max(0, Math.min(cvs.width - g.paddleW, x - g.paddleW / 2));
    if (!g.running) draw();
  };

  // load best score + init board
  useEffect(() => {
    try {
      const b = parseInt(localStorage.getItem("nsp-bricks-best") || "0", 10);
      if (!isNaN(b)) setBest(b);
    } catch {}
    reset();
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist best
  useEffect(() => {
    try { localStorage.setItem("nsp-bricks-best", String(best)); } catch {}
  }, [best]);

  return (
    <div className="card">
      <div className="bricks-head">
        <div className="wlabel">BRICKS</div>
        <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 10, opacity: 0.6 }}>
          SCORE {score} · BEST {best}
        </div>
      </div>
      <div className="bricks-wrap">
        <canvas ref={canvasRef} width={208} height={150} onMouseMove={onMove} onClick={start} />
        {status !== "playing" && (
          <div className="bricks-ov" onClick={start}>{TXT[status]}</div>
        )}
      </div>
    </div>
  );
}
