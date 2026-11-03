import { db } from "@/lib/db";

export default async function Publicidade({ eventoId, posicao = "evento" }: { eventoId?: string; posicao?: string }) {
  const { data } = await db().from("publicidade").select("*").eq("posicao", posicao);
  const itens = ((data ?? []) as any[]).filter((a) => !a.evento_id || a.evento_id === eventoId);
  if (!itens.length) return null;
  return (
    <div className="ads">
      <small>PUBLICIDADE</small>
      {itens.map((a) => (
        <a key={a.id} href={a.link} target="_blank" rel="sponsored noopener noreferrer">
          <img src={a.imagem_url} alt={a.anunciante} />
        </a>
      ))}
    </div>
  );
}
