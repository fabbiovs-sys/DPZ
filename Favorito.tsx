"use client";
import { useEffect, useState } from "react";
const KEY = "dz_favoritos";
const ler = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };

export default function Favorito({ slug }: { slug: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(ler().includes(slug)), [slug]);
  function alternar() {
    const l = ler();
    const n = l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug];
    try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {}
    setOn(n.includes(slug));
  }
  return <button className="btn" onClick={alternar} aria-pressed={on}>{on ? "★ Nos favoritos" : "☆ Favoritar"}</button>;
}
