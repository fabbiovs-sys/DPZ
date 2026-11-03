export type ResultadoGpx = { gpx: string; pontos: number; km: number; nome: string };

const esc = (s: string) => s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c] as string));
const rad = Math.PI / 180;
function haversine(a: number[], b: number[]) {
  const dl = (b[1] - a[1]) * rad, dn = (b[0] - a[0]) * rad;
  const x = Math.sin(dl / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dn / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(x));
}
const nums = (t: string, sep: RegExp) =>
  t.trim().split(sep).map((s) => s.split(",").map(Number)).filter((p) => p.length >= 2 && isFinite(p[0]) && isFinite(p[1]));

/** Converte KML (LineString ou gx:Track) em GPX 1.1. Lança Error se não houver trajeto. */
export function kmlParaGpx(kml: string, nomePadrao = "Percurso"): ResultadoGpx {
  const trilhas: number[][][] = [];
  for (const m of kml.matchAll(/<LineString[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>[\s\S]*?<\/LineString>/g)) {
    const p = nums(m[1], /\s+/); if (p.length > 1) trilhas.push(p);
  }
  for (const m of kml.matchAll(/<gx:Track[\s\S]*?<\/gx:Track>/g)) {
    const coords = [...m[0].matchAll(/<gx:coord>([\s\S]*?)<\/gx:coord>/g)]
      .map((c) => c[1].trim().split(/\s+/).map(Number)).filter((p) => p.length >= 2 && isFinite(p[0]) && isFinite(p[1]));
    if (coords.length > 1) trilhas.push(coords);
  }
  if (!trilhas.length) throw new Error("Nenhum percurso (linha) encontrado no arquivo.");
  const nome = (kml.match(/<Placemark[\s\S]*?<name>([\s\S]*?)<\/name>/)?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, "").trim() || nomePadrao;
  let km = 0, pontos = 0;
  const comEle = trilhas.some((t) => t.some((p) => p[2]));
  const segs = trilhas.map((t) => {
    for (let i = 1; i < t.length; i++) km += haversine(t[i - 1], t[i]);
    pontos += t.length;
    return "<trkseg>" + t.map((p) => `<trkpt lat="${p[1]}" lon="${p[0]}">${comEle && isFinite(p[2]) ? `<ele>${p[2]}</ele>` : ""}</trkpt>`).join("") + "</trkseg>";
  }).join("");
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Drop Zero" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>${esc(nome)}</name>${segs}</trk></gpx>`;
  return { gpx, pontos, km, nome };
}
