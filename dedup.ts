const PARADAS = new Set(["de", "da", "do", "das", "dos", "e", "a", "o", "em", "na", "no", "edicao", "ed"]);

/** Separa o nome em palavras comparáveis: sem acentos, sem anos e ordinais (2ª, 3º), sem palavras vazias. */
export function normalizar(nome: string): string[] {
  return nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/\b\d{1,2}\s*[ªº]/g, " ").replace(/\b20\d{2}\b/g, " ")
    .split(/[^a-z0-9%]+/).filter((t) => t && !PARADAS.has(t));
}
export function similaridade(a: string, b: string): number {
  const A = new Set(normalizar(a)), B = new Set(normalizar(b));
  if (!A.size || !B.size) return 0;
  let comum = 0; A.forEach((t) => { if (B.has(t)) comum++; });
  return comum / (A.size + B.size - comum);
}
const dias = (d1: string, d2: string) => Math.abs(Date.parse(d1 + "T12:00:00Z") - Date.parse(d2 + "T12:00:00Z")) / 864e5;

export type Candidato = { id?: string; nome: string; data: string; cidadeId: string | null };
export type Achado = { tipo: "duplicata" | "alteracao" | "possivel"; alvo: Candidato; similaridade: number };

/** duplicata = mesma cidade, mesma data e nome muito parecido; alteracao = nome igual em data próxima (possível mudança de data);
 *  possivel = mesma cidade e data com nome parecido. Sempre vai para a revisão de uma pessoa. */
export function classificar(novo: Candidato, existentes: Candidato[]): Achado | null {
  let melhor: Achado | null = null;
  const rank = { duplicata: 3, alteracao: 2, possivel: 1 } as const;
  for (const e of existentes) {
    if (!novo.cidadeId || e.cidadeId !== novo.cidadeId) continue;
    const s = similaridade(novo.nome, e.nome), d = dias(novo.data, e.data);
    let tipo: Achado["tipo"] | null = null;
    if (d === 0 && s >= 0.8) tipo = "duplicata";
    else if (d > 0 && d <= 60 && s >= 0.8) tipo = "alteracao";
    else if (d === 0 && s >= 0.5) tipo = "possivel";
    if (tipo && (!melhor || rank[tipo] > rank[melhor.tipo] || (rank[tipo] === rank[melhor.tipo] && s > melhor.similaridade))) melhor = { tipo, alvo: e, similaridade: s };
  }
  return melhor;
}
