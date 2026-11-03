"use client";
import { useEffect, useState } from "react";

/** Imagem da prova: arte Drop Zero (sempre disponível) que se alterna com a imagem oficial quando ela foi enviada no painel. */
export default function ImagemProva({ nome, banner, tag = "RUA", grande = false, controles = false }: {
  nome: string; banner?: string | null; tag?: string; grande?: boolean; controles?: boolean;
}) {
  const [alt, setAlt] = useState(false);
  const [manual, setManual] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!banner || manual || hover) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => { if (!document.hidden) setAlt((a) => !a); }, 3800);
    return () => clearInterval(t);
  }, [banner, manual, hover]);
  return (
    <div className={`arte${grande ? " grande" : ""}${alt ? " alt" : ""}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="arte-dz" aria-hidden={banner ? true : undefined}>
        <span className="anel" /><span className="tag-rua">{tag}</span>
        <div className="tit">{nome}</div>
      </div>
      {banner && <img className="arte-orig" src={banner} alt={nome} loading="lazy" />}
      {banner && controles && (
        <span className="art-dots" role="group" aria-label="Imagens da prova">
          <button type="button" className={alt ? "" : "on"} aria-label="Mostrar a primeira imagem" onClick={() => { setManual(true); setAlt(false); }} />
          <button type="button" className={alt ? "on" : ""} aria-label="Mostrar a segunda imagem" onClick={() => { setManual(true); setAlt(true); }} />
        </span>
      )}
    </div>
  );
}
