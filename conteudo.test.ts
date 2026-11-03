import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRss } from "../lib/rss.ts";
import { urlFeedSegura } from "../lib/url.ts";
import { preverTempo } from "../lib/pace.ts";

const rss = `<?xml version="1.0"?><rss><channel><title>Fonte</title>
<item><title><![CDATA[Etapa em Goiânia & região]]></title><link>https://exemplo.com.br/a?x=1&amp;y=2</link><pubDate>Tue, 27 Oct 2026 10:00:00 GMT</pubDate><description>texto longo que não deve ser guardado</description></item>
<item><title>Sem link</title></item>
<item><title>Segundo</title><link>https://exemplo.com.br/b</link></item></channel></rss>`;
const atom = `<feed><entry><title>Atom título</title><link rel="alternate" href="https://exemplo.com.br/c"/><updated>2026-10-20T10:00:00Z</updated></entry></feed>`;

test("RSS 2.0: título, link e data; ignora item sem link", () => {
  const v = parseRss(rss);
  assert.equal(v.length, 2);
  assert.equal(v[0].titulo, "Etapa em Goiânia & região");
  assert.equal(v[0].url, "https://exemplo.com.br/a?x=1&y=2");
  assert.equal(v[0].publicado, "2026-10-27T10:00:00.000Z");
  assert.equal(v[1].publicado, null);
  assert.ok(!JSON.stringify(v).includes("texto longo"));
});
test("Atom", () => {
  const v = parseRss(atom);
  assert.equal(v.length, 1); assert.equal(v[0].url, "https://exemplo.com.br/c"); assert.equal(v[0].publicado, "2026-10-20T10:00:00.000Z");
});
test("feeds: só https com domínio", () => {
  assert.ok(urlFeedSegura("https://exemplo.com.br/feed"));
  for (const u of ["http://exemplo.com/feed", "https://localhost/x", "https://127.0.0.1/x", "https://10.0.0.5/x", "https://exemplo.com:8443/x", "file:///etc/passwd", "https://servidor.local/x"]) assert.equal(urlFeedSegura(u), null, u);
});
test("Riegel: 10K em 50min prevê ~1h50 na meia", () => {
  const t = preverTempo(3000, 10, 21.0975);
  assert.ok(t > 6500 && t < 6800, String(t));
  assert.equal(preverTempo(0, 10, 21), 0);
});
