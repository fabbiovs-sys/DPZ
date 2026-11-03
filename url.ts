/** Aceita apenas http(s). Qualquer outra coisa (javascript:, data:, etc.) vira null. */
export function urlSegura(valor: string | null | undefined): string | null {
  if (!valor) return null;
  try {
    const u = new URL(valor.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch { return null; }
}

/** Para endereços de feeds buscados pelo servidor: só https, com domínio (sem IP, sem localhost). Reduz o risco de SSRF. */
export function urlFeedSegura(valor: string | null | undefined): string | null {
  const u = urlSegura(valor);
  if (!u) return null;
  const url = new URL(u);
  if (url.protocol !== "https:" || url.port) return null;
  const h = url.hostname.toLowerCase();
  if (!h.includes(".") || h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || /^[0-9.]+$/.test(h) || h.includes(":")) return null;
  return u;
}
