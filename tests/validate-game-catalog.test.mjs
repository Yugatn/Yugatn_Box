import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = process.cwd();
const validator = resolve(root, "scripts/validate-game-catalog.mjs");
const sample = JSON.parse(readFileSync(resolve(root, "data/game-catalog.example.json"), "utf8"));

function runCatalog(catalog) {
  const dir = mkdtempSync(join(tmpdir(), "yugatn-catalog-test-"));
  const file = join(dir, "catalog.json");
  try {
    writeFileSync(file, JSON.stringify(catalog), "utf8");
    return spawnSync(process.execPath, [validator, file], { encoding: "utf8" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("example catalog passes validation", () => {
  const result = runCatalog(sample);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Catalog valid: 2 game entries checked/);
});

test("duplicate game IDs fail validation", () => {
  const catalog = structuredClone(sample);
  catalog.games[1].id = catalog.games[0].id;
  const result = runCatalog(catalog);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicate game id/);
});

test("unknown route types fail validation", () => {
  const catalog = structuredClone(sample);
  catalog.games[0].routes[0].type = "magic-console";
  const result = runCatalog(catalog);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown route type/);
});

test("PLAYABLE without a test timestamp fails validation", () => {
  const catalog = structuredClone(sample);
  catalog.games[0].compatibility.status = "PLAYABLE";
  catalog.games[0].compatibility.lastTested = null;
  const result = runCatalog(catalog);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /PLAYABLE requires a test timestamp/);
});
