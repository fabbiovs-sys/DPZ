"use client";
import { useEffect, useRef, useState } from "react";

// Símbolo vetorial do manual da marca (4 arcos do anel + barra). Centro em (420,17; 294,55).
const ARCOS = [
  "M 420.171875 392.875 C 445.15625 392.875 467.976562 383.492188 485.339844 368.089844 L 478.796875 361.546875 L 472.195312 354.941406 C 458.214844 367.003906 440.039062 374.320312 420.171875 374.320312 C 404.273438 374.320312 389.460938 369.625 377.007812 361.578125 L 363.652344 374.933594 C 379.65625 386.21875 399.144531 392.875 420.171875 392.875 ",
  "M 340.40625 294.554688 C 340.40625 274.691406 347.726562 256.511719 359.785156 242.53125 L 353.183594 235.933594 L 346.640625 229.386719 C 331.234375 246.75 321.851562 269.574219 321.851562 294.554688 C 321.851562 314.808594 328.011719 333.644531 338.550781 349.304688 L 351.96875 335.882812 C 344.636719 323.820312 340.40625 309.671875 340.40625 294.554688 ",
  "M 420.171875 196.234375 C 394.050781 196.234375 370.292969 206.496094 352.667969 223.171875 L 365.78125 236.285156 C 380.042969 222.964844 399.167969 214.792969 420.171875 214.792969 C 435.289062 214.792969 449.4375 219.019531 461.5 226.355469 L 474.921875 212.929688 C 459.261719 202.394531 440.425781 196.234375 420.171875 196.234375 ",
  "M 499.9375 294.554688 C 499.9375 315.5625 491.761719 334.683594 478.441406 348.945312 L 491.554688 362.058594 C 508.230469 344.433594 518.492188 320.675781 518.492188 294.554688 C 518.492188 273.527344 511.835938 254.039062 500.550781 238.035156 L 487.195312 251.390625 C 495.242188 263.84375 499.9375 278.65625 499.9375 294.554688 "
];
const BARRA = "M 320.054688 406.984375 L 306.933594 393.867188 L 520.308594 180.488281 L 533.429688 193.609375 Z M 320.054688 406.984375 ";

/** Logotipo Drop Zero em movimento: os arcos montam o anel, a barra cai, o anel gira e ondas se espalham.
 *  Respeita "reduzir movimento" e só anima quando está visível. */
export default function LogoMovimento() {
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [anim, setAnim] = useState(false);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = box.current, s = svg.current;
    if (!el || !s) return;
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnim(!reduz);
    const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const mover = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.style.setProperty("--px", String((((ev.clientX - r.left) / r.width - 0.5) * 2 * 8).toFixed(1)));
      s.style.setProperty("--py", String((((ev.clientY - r.top) / r.height - 0.5) * 2 * 8).toFixed(1)));
    };
    const sair = () => { s.style.setProperty("--px", "0"); s.style.setProperty("--py", "0"); };
    if (!reduz) { el.addEventListener("pointermove", mover); el.addEventListener("pointerleave", sair); }
    return () => { io.disconnect(); el.removeEventListener("pointermove", mover); el.removeEventListener("pointerleave", sair); };
  }, []);
  return (
    <div ref={box} className={`pista${anim ? " anim" : ""}${vis ? " vis" : ""}`}>
      <svg ref={svg} className="logo-mov" viewBox="296.17 170.55 248 248" role="img" aria-label="Logotipo Drop Zero em movimento">
        <g className="par">
          <g className="ondas">{[0, 1, 2].map((i) => <circle key={i} className="onda" cx="420.17" cy="294.55" r="118" />)}</g>
          <g className="anel" fill="#fff">{ARCOS.map((d, i) => <path key={i} className="arco" d={d} />)}</g>
          <g fill="#fff"><path className="barra" d={BARRA} /></g>
        </g>
      </svg>
      <span className="legenda">A COMUNIDADE<br />EM MOVIMENTO</span>
    </div>
  );
}
