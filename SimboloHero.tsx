import { HERO_ARCOS, HERO_BARRA } from "@/lib/simbolo";

/** Símbolo grande ao fundo do topo da página (decorativo). Animação só em CSS. */
export default function SimboloHero() {
  return (
    <svg className="hero-simbolo" viewBox="296.17 170.55 248 248" aria-hidden="true">
      <g className="hs-anel" fill="#AFD6CE">{HERO_ARCOS.map((d, i) => <path key={i} className="hs-arco" d={d} />)}</g>
      <path className="hs-barra" fill="#fff" d={HERO_BARRA} />
    </svg>
  );
}
