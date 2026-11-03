import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFeed, urlFeed } from "../lib/youtube.ts";

const feed = `<?xml version="1.0"?><feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"><title>Canal</title>
<entry><id>yt:video:AAAAAAAAAAA</id><yt:videoId>AAAAAAAAAAA</yt:videoId><title>Treino &amp; ritmo: 10K</title><author><name>Canal X</name></author><published>2026-10-01T10:00:00+00:00</published></entry>
<entry><yt:videoId>BBBBBBBBBBB</yt:videoId><title>Tênis de corrida</title><author><name>Canal X</name></author><published>2026-10-20T10:00:00+00:00</published></entry>
<entry><title>sem id</title><published>2026-10-21T10:00:00+00:00</published></entry></feed>`;

test("feed do YouTube: ordena, decodifica e ignora entradas inválidas", () => {
  const v = parseFeed(feed);
  assert.equal(v.length, 2);
  assert.equal(v[0].id, "BBBBBBBBBBB");
  assert.equal(v[1].titulo, "Treino & ritmo: 10K");
  assert.equal(v[1].canal, "Canal X");
  assert.equal(v[0].miniatura, "https://i.ytimg.com/vi/BBBBBBBBBBB/mqdefault.jpg");
  assert.deepEqual(parseFeed("<html>erro</html>"), []);
});
test("url do feed", () => {
  assert.equal(urlFeed("UCabc"), "https://www.youtube.com/feeds/videos.xml?channel_id=UCabc");
});
