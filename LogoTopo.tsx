import { TOPO_ARCOS, TOPO_BARRA, LETRAS } from "@/lib/simbolo";

/** Logotipo vetorial do cabeçalho. A animação (montagem na entrada e uma volta do anel de tempos em tempos) é só CSS. */
export default function LogoTopo({ claro = false }: { claro?: boolean }) {
  return (
    <svg className={`logo-topo${claro ? " claro" : ""}`} viewBox="227 192 388 192" role="img" aria-label="Drop Zero" fill="currentColor">
      <g className="anel">{TOPO_ARCOS.map((d, i) => <path key={i} className="arco" d={d} />)}</g>
      <path className="barra" d={TOPO_BARRA} />
      <g className="t">{LETRAS.map((d, i) => <path key={i} style={{ "--i": i } as React.CSSProperties} d={d} />)}</g>
    </svg>
  );
}
