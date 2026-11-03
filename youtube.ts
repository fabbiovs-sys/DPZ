export type Video = { id: string; titulo: string; publicado: string; miniatura: string; canal: string };

/** Feed público (Atom) que o próprio YouTube oferece por canal. Não usa a API nem chave. */
export const urlFeed = (channelId: string) => `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;

const dec = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export function parseFeed(xml: string): Video[] {
  const out: Video[] = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const b = m[1];
    const id = b.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
    const titulo = b.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const pub = b.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!id || !titulo || !pub) continue;
    // a miniatura é montada a partir do ID, em domínio fixo do YouTube
    out.push({ id, titulo: dec(titulo.trim()), publicado: pub, miniatura: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`, canal: dec((b.match(/<author>\s*<name>([\s\S]*?)<\/name>/)?.[1] ?? "").trim()) });
  }
  return out.sort((a, b) => b.publicado.localeCompare(a.publicado));
}
