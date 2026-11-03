import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacidade", alternates: { canonical: "/privacidade" } };
export default function Privacidade() {
  return (
    <article>
      <h1>Privacidade</h1>
      <p className="dica">Modelo inicial. Revise com um profissional jurídico antes de publicar e atualize conforme novas integrações (por exemplo, Google Analytics).</p>
      <h2>O que registramos</h2>
      <ul>
        <li><b>Cliques em ofertas e em links de inscrição, e cópias de código:</b> guardamos apenas o tipo de ação, a oferta ou prova, a campanha e o domínio de origem. Não guardamos nome, e-mail, IP nem identificadores de aparelho.</li>
        <li><b>Favoritos:</b> ficam salvos somente no seu aparelho (armazenamento local do navegador).</li>
        <li><b>Calculadoras e conversor de GPX:</b> funcionam no seu navegador; os arquivos e valores não são enviados ao servidor.</li>
        <li><b>Área administrativa:</b> usa cookies de login, apenas para a equipe.</li>
      </ul>
      <h2>Links de afiliados</h2>
      <p>Algumas ofertas são identificadas como “Link de afiliado”. Se você comprar por elas, o Drop Zero pode receber uma comissão, sem custo extra para você.</p>
    </article>
  );
}
