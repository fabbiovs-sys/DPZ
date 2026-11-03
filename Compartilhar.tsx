"use client";
import { useState } from "react";

export default function Compartilhar({ titulo, caminho }: { titulo: string; caminho: string }) {
  const [msg, setMsg] = useState("");
  async function ir() {
    const url = location.origin + caminho;
    try {
      if (navigator.share) { await navigator.share({ title: titulo, url }); return; }
    } catch (e) { if ((e as Error)?.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(url); setMsg("Link copiado."); } catch { setMsg("Não foi possível copiar o link."); }
  }
  return <span><button type="button" className="btn" onClick={ir}>Compartilhar</button> <small role="status">{msg}</small></span>;
}
