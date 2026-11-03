"use client";
import { useEffect, useState } from "react";

const SETS = [["mo", "vi", "men", "to"], ["li", "ber", "da", "de"], ["mi", "ni", "ma", "lis", "mo"]];

export default function PalavrasHero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % SETS.length), 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero-words" aria-hidden="true" key={i}>
      {SETS[i].map((s, j) => <span key={j} style={{ animationDelay: `${j * 110}ms` }}>{s}</span>)}
    </div>
  );
}
