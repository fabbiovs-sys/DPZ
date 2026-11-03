/** Nível de completude dos dados de uma prova (0–100), com a lista do que falta. */
export function completude(e: any): { pct: number; faltando: string[] } {
  const itens: [string, boolean][] = [
    ["data", !!e.data_inicio], ["cidade", !!e.cidade_id], ["local", !!e.local_nome],
    ["organizador", !!e.organizador_id], ["link de inscrição", !!e.url_inscricao],
    ["distâncias", (e.distancias ?? []).length > 0],
    ["regulamento", (e.documentos ?? []).some((d: any) => d.tipo === "regulamento")],
    ["banner", !!e.banner_url], ["verificação", !!e.verificado_em],
  ];
  const faltando = itens.filter(([, ok]) => !ok).map(([n]) => n);
  return { pct: Math.round(((itens.length - faltando.length) / itens.length) * 100), faltando };
}
