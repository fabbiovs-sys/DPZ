"use client";
import { useState } from "react";

export default function CopiarCodigo({ codigo, id }: { codigo: string; id: string }) {
  const [msg, setMsg] = useState("");
  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setMsg("Código copiado!");
      fetch("/api/copia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }).catch(() => {});
    } catch { setMsg("Não foi possível copiar. Selecione o código manualmente."); }
  }
  return (
    <span className="codigo">
      <code>{codigo}</code>
      <button type="button" className="btn" onClick={copiar}>Copiar código</button>
      <small role="status">{msg}</small>
    </span>
  );
}
