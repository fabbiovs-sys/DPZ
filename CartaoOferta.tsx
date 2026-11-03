import { dia } from "@/lib/format";
import CopiarCodigo from "./CopiarCodigo";
import Compartilhar from "./Compartilhar";

export const CATEGORIAS: Record<string, string> = {
  inscricoes: "Inscrições", tenis: "Tênis e calçados", roupas: "Roupas esportivas", relogios: "Relógios GPS e tecnologia",
  acessorios: "Acessórios", nutricao: "Nutrição e hidratação", assessorias: "Academias e assessorias", turismo: "Turismo esportivo", outros: "Outros",
};
const TIPO: Record<string, string> = { publico: "Cupom público", afiliado: "Link de afiliado", exclusivo: "Exclusivo Drop Zero" };

export function verificacao(c: any): string {
  const d = c.verificado_em ? dia(c.verificado_em) : "";
  if (c.verificacao === "confirmado") return `Desconto confirmado em ${d}`;
  if (c.verificacao === "revisado") return `Revisado em ${d}`;
  if (c.verificacao === "validade_informada") return "Validade informada pelo parceiro (não confirmada pelo Drop Zero)";
  return "Ainda não verificado";
}
export function desconto(c: any): string | null {
  if (c.valor == null) return c.tipo_desconto === "frete" ? "Desconto no frete" : c.tipo_desconto === "brinde" ? "Brinde" : null;
  const v = Number(c.valor).toLocaleString("pt-BR");
  return c.tipo_desconto === "percentual" ? `${v}% de desconto` : c.tipo_desconto === "valor" ? `R$ ${v} de desconto` : null;
}

export default function CartaoOferta({ c }: { c: any }) {
  const d = desconto(c);
  return (
    <article className="oferta">
      <div className="oferta-top"><span className="selo">{CATEGORIAS[c.categoria] ?? "Outros"}</span><span className={`selo ${c.tipo_parceria}`}>{TIPO[c.tipo_parceria]}</span></div>
      <small>{c.marca}</small>
      <h3>{c.titulo}</h3>
      {d && <strong className="oferta-desc">{d}</strong>}
      {c.descricao && <p>{c.descricao}</p>}
      {c.codigo && <CopiarCodigo codigo={c.codigo} id={c.id} />}
      {c.condicoes && <p className="dica">Condições: {c.condicoes}</p>}
      <p className="dica">{c.validade ? `Válido até ${dia(c.validade)}. ` : ""}{verificacao(c)}.</p>
      {c.tipo_parceria === "afiliado" && <p className="dica">Link de afiliado: o Drop Zero pode receber uma comissão se você comprar, sem custo extra para você.</p>}
      {c.eventos?.slug && <p className="dica">Ligada à prova <a href={`/corridas/${c.eventos.slug}`}>{c.eventos.nome}</a>.</p>}
      <p className="acoes">
        <a className="btn pri" href={`/go/cupom/${c.id}`} target="_blank" rel="nofollow sponsored noopener noreferrer">Acessar oferta ↗</a>
        <Compartilhar titulo={`${c.marca}: ${c.titulo}`} caminho="/beneficios" />
      </p>
    </article>
  );
}
