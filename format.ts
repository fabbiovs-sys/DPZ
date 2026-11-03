const tz = "America/Sao_Paulo";
export const dataHora = (iso: string) => {
  const hm = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(new Date(iso));
  const sem = hm === "00:00" || hm === "24:00"; // meia-noite = horário a definir
  return new Intl.DateTimeFormat("pt-BR", sem ? { dateStyle: "full", timeZone: tz } : { dateStyle: "full", timeStyle: "short", timeZone: tz }).format(new Date(iso)) + (sem ? " · horário a definir" : "");
};
export const dia = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: tz }).format(new Date(iso));
export const brl = (n: number | null) =>
  n == null ? null : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

/** Data para dados estruturados (schema.org): só a data quando o horário ainda não foi definido (00:00 em Brasília). */
export function ldData(iso: string): string {
  const sp = new Date(new Date(iso).getTime() - 3 * 3600e3).toISOString();
  return sp.slice(11, 16) === "00:00" ? sp.slice(0, 10) : new Date(iso).toISOString();
}
