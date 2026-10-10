import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const gameSchema = readJson("compatibility/game.schema.json");
const reportSchema = readJson("compatibility/report.schema.json");
const catalogSchema = readJson("compatibility/catalog.schema.json");
ajv.addSchema(gameSchema, "game.schema.json");
const validateCatalog = ajv.compile(catalogSchema);
const validateGame = ajv.compile(gameSchema);
const validateReport = ajv.compile(reportSchema);
const fail = (message) => { console.error("FAIL:", message); process.exitCode = 1; };
const assert = (condition, message) => { if (!condition) fail(message); };
const reportErrors = (validator) => (validator.errors ?? []).map(e => `${e.instancePath || "/"} ${e.message}`).join("; ");

const catalog = readJson("compatibility/catalog.json");
assert(validateCatalog(catalog), `catalog schema: ${reportErrors(validateCatalog)}`);
const ids = catalog.entries.map(g => g.game_id);
assert(ids.length > 0, "catalog must contain at least one entry");
assert(new Set(ids).size === ids.length, "catalog game_id values must be unique");
for (const game of catalog.entries) {
  assert(validateGame(game), `game ${game.game_id}: ${reportErrors(validateGame)}`);
  if (game.tested === false) {
    assert(game.status === "Not tested", `${game.game_id}: untested entries must stay Not tested`);
    assert(game.test_date === null && game.fps_avg === null && game.report_url === null,
      `${game.game_id}: untested entries cannot carry test date, FPS or report URL`);
  }
  if (["Native", "Verified", "Playable"].includes(game.status)) {
    assert(game.tested === true && typeof game.test_date === "string",
      `${game.game_id}: ${game.status} requires tested=true and a date`);
  }
}

const reportsDir = path.join(root, "compatibility/reports");
const reportFiles = fs.readdirSync(reportsDir).filter(f => f.endsWith(".json")).sort();
assert(reportFiles.length > 0, "at least one report/template JSON file must exist");
for (const file of reportFiles) {
  const report = readJson(path.posix.join("compatibility/reports", file));
  assert(validateReport(report), `report ${file}: ${reportErrors(validateReport)}`);
}

// Negative fixtures: the validator must reject each unsafe or malformed case.
const firstGame = structuredClone(catalog.entries[0]);
firstGame.status = "Verified";
firstGame.tested = false;
firstGame.test_date = null;
assert(!validateGame(firstGame), "negative fixture: Verified without test evidence must be rejected");

const duplicateCatalog = structuredClone(catalog);
duplicateCatalog.entries.push(structuredClone(duplicateCatalog.entries[0]));
const duplicateIdsRejected = new Set(duplicateCatalog.entries.map(g => g.game_id)).size !== duplicateCatalog.entries.length;
assert(duplicateIdsRejected, "negative fixture: duplicate game_id must be rejected");

const firstReport = readJson(path.posix.join("compatibility/reports", reportFiles[0]));
const invalidReport = structuredClone(firstReport);
delete invalidReport.result;
assert(!validateReport(invalidReport), "negative fixture: report missing required result must be rejected");

if (process.exitCode) process.exit(process.exitCode);
console.log(`PASS: catalog schema, ${catalog.entries.length} game entries, ${reportFiles.length} report(s), and 3 negative fixtures.`);
