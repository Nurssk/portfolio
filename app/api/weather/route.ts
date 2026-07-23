import { NextResponse } from "next/server";

// Almaty — change these to relocate the widget.
const LAT = 43.222;
const LON = 76.8512;

// Refetch upstream at most every 15 minutes (server-side cache).
export const revalidate = 900;

export async function GET() {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,weather_code,is_day` +
    `&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
  try {
    const r = await fetch(url, { next: { revalidate: 900 } });
    if (!r.ok) throw new Error("upstream " + r.status);
    const d = await r.json();
    return NextResponse.json({
      temp: Math.round(d.current.temperature_2m),
      code: d.current.weather_code,
      isDay: d.current.is_day === 1,
      hi: Math.round(d.daily.temperature_2m_max[0]),
      lo: Math.round(d.daily.temperature_2m_min[0]),
    });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
