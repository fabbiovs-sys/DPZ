"use client";
import { useMemo, useState } from "react";
import { kmlParaGpx } from "@/lib/gpx";
import { paceDeTempo, tempoDePace, formatarTempo, formatarPace, parciais, preverTempo } from "@/lib/pace";

const n = (v: string) => parseFloat(v.replace(",", ".")) || 0;
const ITENS = [
  "Retirar o kit e conferir o número de peito e o chip",
  "Conferir horário e local de largada e de guarda-volumes",
  "Tênis e meias que você já usou em treinos longos",
  "Roupa adequada ao clima previsto",
  "Hidratação e alimentação que você já testou nos treinos",
  "Plano de chegada: transporte, estacionamento e tempo de sobra",
  "Documento, dinheiro ou cartão e celular carregado",
  "Aquecimento e alongamento leves antes da largada",
  "Ler o regulamento: horário de corte, pontos de água e regras",
];

export default function Ferramentas() {
  const [dist, setDist] = useState("10");
  const [h, setH] = useState(""), [m, setM] = useState(""), [s, setS] = useState("");
  const [pm, setPm] = useState("6"), [ps, setPs] = useState("0");
  const km = n(dist);
  const tempo = n(h) * 3600 + n(m) * 60 + n(s);
  const paceInformado = n(pm) * 60 + n(ps);
  const pace = tempo > 0 ? paceDeTempo(tempo, km) : paceInformado;
  const total = tempo > 0 ? tempo : tempoDePace(paceInformado, km);
  const tabela = useMemo(() => parciais(km, pace), [km, pace]);
  const [marcados, setMarcados] = useState<boolean[]>(() => ITENS.map(() => false));
  const [gpx, setGpx] = useState<{ gpx: string; pontos: number; km: number; nome: string } | null>(null);
  const [gpxMsg, setGpxMsg] = useState("");
  const [rd, setRd] = useState("10"), [rh, setRh] = useState(""), [rm, setRm] = useState(""), [rs, setRs] = useState(""), [alvo, setAlvo] = useState("21.0975");
  const prev = preverTempo(n(rh) * 3600 + n(rm) * 60 + n(rs), n(rd), n(alvo));

  async function lerKml(f: File | undefined) {
    setGpx(null); setGpxMsg("");
    if (!f) return;
    if (/\.kmz$/i.test(f.name)) { setGpxMsg("Arquivo .kmz: no Google Meu Mapas, exporte marcando a opção de exportar como KML."); return; }
    try { const r = kmlParaGpx(await f.text(), f.name.replace(/\.[^.]+$/, "")); setGpx(r); setGpxMsg(`${r.pontos} pontos, cerca de ${r.km.toFixed(2).replace(".", ",")} km. Confira o percurso no seu aplicativo antes da prova.`); }
    catch { setGpxMsg("Não encontrei um percurso (linha) neste arquivo. Use um KML exportado de um trajeto."); }
  }
  function baixar() {
    if (!gpx) return;
    const url = URL.createObjectURL(new Blob([gpx.gpx], { type: "application/gpx+xml" }));
    const a = document.createElement("a"); a.href = url; a.download = `${gpx.nome.replace(/[^\w-]+/g, "_") || "percurso"}.gpx`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="ferr-grid">
      <section className="ferr">
        <h2>Calculadora de pace</h2>
        <p className="dica">Estimativa para planejar o ritmo. Não é garantia de desempenho.</p>
        <label>Distância (km)<input value={dist} onChange={(e) => setDist(e.target.value)} inputMode="decimal" /></label>
        <div className="chips">{[["5K", "5"], ["10K", "10"], ["21K", "21,0975"], ["42K", "42,195"]].map(([l, v]) => <button key={l} type="button" className="btn" onClick={() => setDist(v)}>{l}</button>)}</div>
        <fieldset className="linha"><legend>Tempo total</legend>
          <input value={h} onChange={(e) => setH(e.target.value)} placeholder="h" aria-label="horas" inputMode="numeric" />
          <input value={m} onChange={(e) => setM(e.target.value)} placeholder="min" aria-label="minutos" inputMode="numeric" />
          <input value={s} onChange={(e) => setS(e.target.value)} placeholder="s" aria-label="segundos" inputMode="numeric" /></fieldset>
        <fieldset className="linha"><legend>ou Pace por km</legend>
          <input value={pm} onChange={(e) => { setPm(e.target.value); setH(""); setM(""); setS(""); }} placeholder="min" aria-label="minutos por km" inputMode="numeric" />
          <input value={ps} onChange={(e) => { setPs(e.target.value); setH(""); setM(""); setS(""); }} placeholder="s" aria-label="segundos por km" inputMode="numeric" /></fieldset>
        {pace > 0 && km > 0 && <p role="status"><b>Estimativa:</b> pace {formatarPace(pace)} /km · {(3600 / pace).toFixed(1).replace(".", ",")} km/h · {km.toLocaleString("pt-BR")} km em {formatarTempo(total)}.</p>}
      </section>

      <section className="ferr">
        <h2>Parciais</h2>
        <p className="dica">Passagens por km com pace constante (estimativa).</p>
        {tabela.length ? <table className="parciais"><thead><tr><th>Km</th><th>Tempo</th></tr></thead>
          <tbody>{tabela.map((p) => <tr key={p.km}><td>{String(p.km).replace(".", ",")}</td><td>{formatarTempo(p.acumulado)}</td></tr>)}</tbody></table>
          : <p className="vazio">Informe distância e pace ou tempo.</p>}
      </section>

      <section className="ferr">
        <h2>Previsão de tempo</h2>
        <p className="dica">Estima o tempo em outra distância a partir de um resultado recente (fórmula de Riegel). É só uma estimativa: terreno, clima e preparo mudam o resultado.</p>
        <label>Distância do resultado (km)<input value={rd} onChange={(e) => setRd(e.target.value)} inputMode="decimal" /></label>
        <fieldset className="linha"><legend>Tempo do resultado</legend>
          <input value={rh} onChange={(e) => setRh(e.target.value)} placeholder="h" aria-label="horas" inputMode="numeric" />
          <input value={rm} onChange={(e) => setRm(e.target.value)} placeholder="min" aria-label="minutos" inputMode="numeric" />
          <input value={rs} onChange={(e) => setRs(e.target.value)} placeholder="s" aria-label="segundos" inputMode="numeric" /></fieldset>
        <label>Prever para<select value={alvo} onChange={(e) => setAlvo(e.target.value)}><option value="5">5 km</option><option value="10">10 km</option><option value="21.0975">Meia maratona (21,0975 km)</option><option value="42.195">Maratona (42,195 km)</option></select></label>
        {prev > 0 && <p role="status"><b>Estimativa:</b> {formatarTempo(prev)} (pace {formatarPace(prev / n(alvo))} /km).</p>}
      </section>

      <section className="ferr">
        <h2>Converter percurso para GPX</h2>
        <p className="dica">Envie um KML do Google Meu Mapas. O arquivo é processado no seu navegador e não é enviado ao servidor. Isto não sincroniza com Garmin ou Strava: você importa o .gpx manualmente.</p>
        <input type="file" accept=".kml,.xml,application/vnd.google-earth.kml+xml,text/xml" onChange={(e) => lerKml(e.target.files?.[0])} aria-label="Arquivo KML" />
        <p role="status">{gpxMsg}</p>
        <button type="button" className="btn pri" disabled={!gpx} onClick={baixar}>Baixar .gpx</button>
      </section>

      <section className="ferr">
        <h2>Checklist do dia da prova</h2>
        <ul className="checklist">{ITENS.map((t, i) => (
          <li key={t}><label><input type="checkbox" checked={marcados[i]} onChange={() => setMarcados((a) => a.map((v, j) => (j === i ? !v : v)))} /> {t}</label></li>))}</ul>
      </section>
    </div>
  );
}
