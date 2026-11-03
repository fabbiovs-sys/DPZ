import { test } from "node:test";
import assert from "node:assert/strict";
import { paceDeTempo, tempoDePace, formatarTempo, formatarPace, parciais } from "../lib/pace.ts";
import { kmlParaGpx } from "../lib/gpx.ts";
import { completude } from "../lib/completude.ts";
import { urlSegura } from "../lib/url.ts";

test("pace e tempo", () => {
  assert.equal(paceDeTempo(3600, 10), 360);
  assert.equal(tempoDePace(360, 21.0975), 360 * 21.0975);
  assert.equal(formatarTempo(3661), "1:01:01");
  assert.equal(formatarPace(330), "5:30");
  assert.equal(paceDeTempo(0, 10), 0);
});
test("parciais incluem o trecho final", () => {
  const p = parciais(5.5, 300);
  assert.equal(p.length, 6);
  assert.equal(p[5].acumulado, 1650);
  assert.deepEqual(parciais(0, 300), []);
});
test("KML vira GPX com distância plausível", () => {
  const kml = `<kml><Document><Placemark><name>Parque</name><LineString><coordinates>-49.2500,-16.6800,0 -49.2400,-16.6800,0 -49.2400,-16.6700,0</coordinates></LineString></Placemark></Document></kml>`;
  const r = kmlParaGpx(kml);
  assert.equal(r.pontos, 3); assert.equal(r.nome, "Parque");
  assert.ok(r.km > 2.0 && r.km < 2.6, `km=${r.km}`);
  assert.match(r.gpx, /<trkpt lat="-16.68" lon="-49.25">/);
  assert.throws(() => kmlParaGpx("<kml></kml>"));
});
test("completude", () => {
  assert.equal(completude({}).pct, 0);
  const c = completude({ data_inicio: "x", cidade_id: "1", local_nome: "a", organizador_id: "1", url_inscricao: "https://a.b", distancias: [{}], documentos: [{ tipo: "regulamento" }], banner_url: "u", verificado_em: "d" });
  assert.equal(c.pct, 100); assert.deepEqual(c.faltando, []);
});
test("urlSegura bloqueia esquemas perigosos", () => {
  assert.equal(urlSegura("javascript:alert(1)"), null);
  assert.equal(urlSegura("data:text/html,x"), null);
  assert.equal(urlSegura("//evil.com"), null);
  assert.ok(urlSegura("https://exemplo.com.br/a?b=1"));
});
