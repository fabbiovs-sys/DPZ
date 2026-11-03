export type ItemFeed = { titulo: string; url: string; publicado: string | null };

const dec = (s: string) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/<[^>]+>/g, "").trim();

/** Lê RSS 2.0 e Atom. Guarda só título, link e data (nunca o texto do artigo de terceiros). */
export function parseRss(xml: string): ItemFeed[] {
  const out: ItemFeed[] = [];
  for (const m of xml.matchAll(/<(item|entry)[\s>]([\s\S]*?)<\/\1>/g)) {
    const b = m[2];
    const titulo = b.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1];
    const link = b.match(/<link[^>]*href="([^"]+)"/)?.[1] ?? b.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1];
    const data = b.match(/<(?:pubDate|published|updated|dc:date)[^>]*>([\s\S]*?)<\/(?:pubDate|published|updated|dc:date)>/)?.[1];
    if (!titulo || !link) continue;
    const t = data ? new Date(dec(data)) : null;
    out.push({ titulo: dec(titulo), url: dec(link), publicado: t && !isNaN(t.getTime()) ? t.toISOString() : null });
  }
  return out;
}
