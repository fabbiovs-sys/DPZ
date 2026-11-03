import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar, similaridade, classificar } from "../lib/dedup.ts";

test("normalização ignora acentos, anos, ordinais e palavras vazias", () => {
  assert.deepEqual(normalizar("2ª Corrida Natunutra de Bem-Estar 2026"), ["corrida", "natunutra", "bem", "estar"]);
});
test("similaridade", () => {
  assert.ok(similaridade("Corrida Pulse", "CORRIDA PULSE 2026") >= 0.99);
  assert.ok(similaridade("Aura Run", "Corrida Pulse") < 0.2);
});
const base = [{ id: "1", nome: "Corrida Pulse", data: "2026-11-08", cidadeId: "an" }];
test("mesma cidade, data e nome: duplicata", () => {
  assert.equal(classificar({ nome: "Corrida Pulse 2026", data: "2026-11-08", cidadeId: "an" }, base)?.tipo, "duplicata");
});
test("nome igual em outra data próxima: possível alteração de data", () => {
  const a = classificar({ nome: "Corrida Pulse", data: "2026-11-22", cidadeId: "an" }, base);
  assert.equal(a?.tipo, "alteracao"); assert.equal(a?.alvo.id, "1");
});
test("cidade diferente ou nome diferente: nada", () => {
  assert.equal(classificar({ nome: "Corrida Pulse", data: "2026-11-08", cidadeId: "gy" }, base), null);
  assert.equal(classificar({ nome: "Aura Run", data: "2026-11-08", cidadeId: "an" }, base), null);
  assert.equal(classificar({ nome: "Corrida Pulse", data: "2027-05-08", cidadeId: "an" }, base), null);
});
