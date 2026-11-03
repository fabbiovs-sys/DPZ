export const paceDeTempo = (segundos: number, km: number) => (km > 0 && segundos > 0 ? segundos / km : 0);
export const tempoDePace = (paceSeg: number, km: number) => (km > 0 && paceSeg > 0 ? paceSeg * km : 0);
const p2 = (n: number) => String(n).padStart(2, "0");
export function formatarTempo(seg: number): string {
  const s = Math.round(seg);
  return `${Math.floor(s / 3600)}:${p2(Math.floor((s % 3600) / 60))}:${p2(s % 60)}`;
}
export function formatarPace(paceSeg: number): string {
  const s = Math.round(paceSeg);
  return `${Math.floor(s / 60)}:${p2(s % 60)}`;
}
/** Parciais por km com pace constante. É uma estimativa, não uma garantia de desempenho. */
export function parciais(km: number, paceSeg: number): { km: number; acumulado: number }[] {
  const out: { km: number; acumulado: number }[] = [];
  if (km <= 0 || paceSeg <= 0) return out;
  for (let k = 1; k <= Math.floor(km); k++) out.push({ km: k, acumulado: k * paceSeg });
  if (km - Math.floor(km) > 1e-9) out.push({ km: Math.round(km * 10000) / 10000, acumulado: km * paceSeg });
  return out;
}

/** Previsão pela fórmula de Riegel: t2 = t1 × (d2/d1)^1,06. Estimativa, não garantia. */
export function preverTempo(tempoSeg: number, distKm: number, alvoKm: number): number {
  if (tempoSeg <= 0 || distKm <= 0 || alvoKm <= 0) return 0;
  return tempoSeg * Math.pow(alvoKm / distKm, 1.06);
}
