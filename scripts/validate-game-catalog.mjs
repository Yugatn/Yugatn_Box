#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const file = process.argv[2] ?? "data/game-catalog.example.json";
const platforms = new Set(["pc","xbox-original","xbox-360","xbox-one","xbox-series","ps1","ps2","ps3","ps4","ps5","other"]);
const statuses = new Set(["NOT_TESTED","BOOTED","IN_GAME","PLAYABLE","ISSUES","BROKEN","CONFLICTED"]);
const routeTypes = new Set(["native-pc","local-emulator","official-remote-play","cloud-streaming","external-capture","unavailable"]);
const routeAvailability = new Set(["candidate","available","unavailable","needs-user-setup"]);
const sources = new Set(["user-entry","official-store","user-provided-media","homebrew","unknown"]);
const errors = [];
const fail = (path, message) => errors.push(`${path}: ${message}`);
const isObject = x => x !== null && typeof x === "object" && !Array.isArray(x);
const isString = x => typeof x === "string" && x.trim().length > 0;

let catalog;
try {
  catalog = JSON.parse(await readFile(file, "utf8"));
} catch (error) {
  console.error(`Cannot read/parse ${file}: ${error.message}`);
  process.exit(2);
}

if (!isObject(catalog)) fail("$", "must be an object");
else {
  if (catalog.schemaVersion !== 1) fail("$.schemaVersion", "must equal 1");
  if (!Array.isArray(catalog.games)) fail("$.games", "must be an array");
  else {
    const ids = new Set();
    catalog.games.forEach((game, i) => {
      const p = `$.games[${i}]`;
      if (!isObject(game)) { fail(p, "must be an object"); return; }
      if (!isString(game.id) || !/^[a-z0-9][a-z0-9._-]{1,79}$/.test(game.id)) fail(p+".id", "must be a 2-80 character lowercase slug");
      else if (ids.has(game.id)) fail(p+".id", "duplicate game id");
      else ids.add(game.id);
      if (!isString(game.title)) fail(p+".title", "must be a non-empty string");
      if (!platforms.has(game.platform)) fail(p+".platform", "unknown platform");
      if (!sources.has(game.source)) fail(p+".source", "unknown source");
      if (!isObject(game.compatibility)) fail(p+".compatibility", "must be an object");
      else {
        if (!statuses.has(game.compatibility.status)) fail(p+".compatibility.status", "unknown status");
        if (game.compatibility.status === "PLAYABLE" && !game.compatibility.lastTested) fail(p+".compatibility.lastTested", "PLAYABLE requires a test timestamp");
        if (game.compatibility.lastTested !== null && game.compatibility.lastTested !== undefined && Number.isNaN(Date.parse(game.compatibility.lastTested))) fail(p+".compatibility.lastTested", "must be an ISO date-time or null");
      }
      if (!Array.isArray(game.routes) || game.routes.length === 0) fail(p+".routes", "must contain at least one route");
      else game.routes.forEach((route, j) => {
        const q = `${p}.routes[${j}]`;
        if (!isObject(route)) { fail(q, "must be an object"); return; }
        if (!routeTypes.has(route.type)) fail(q+".type", "unknown route type");
        if (!isString(route.label)) fail(q+".label", "must be a non-empty string");
        if (!routeAvailability.has(route.availability)) fail(q+".availability", "unknown availability");
        if (!Array.isArray(route.prerequisites) || route.prerequisites.some(x => !isString(x))) fail(q+".prerequisites", "must be an array of non-empty strings");
        if (route.limitations !== undefined && (!Array.isArray(route.limitations) || route.limitations.some(x => !isString(x)))) fail(q+".limitations", "must be an array of non-empty strings");
      });
    });
  }
}

if (errors.length) {
  console.error(`Catalog validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log(`Catalog valid: ${catalog.games.length} game entries checked (${file}).`);
console.log("Note: schema validity is not proof that a game/runtime works; only measured compatibility evidence can establish that.");
