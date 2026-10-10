# Compatibility Data Model and Validation

**Status:** implemented data contract and local validator; no runtime launch integration is implied.

## Purpose

Keep the library, launcher and compatibility reports consistent. Unknown compatibility defaults to `NOT_TESTED`; never promote a title to `PLAYABLE` merely because a runtime opened it.

## Files

- `schemas/game-catalog.schema.json` — JSON Schema draft 2020-12 for catalog records.
- `data/game-catalog.example.json` — clearly marked sample entries; no claim that they were tested.
- `scripts/validate-game-catalog.mjs` — dependency-free Node.js validator for structural invariants and duplicate IDs.

Run from the repository root:

```sh
node scripts/validate-game-catalog.mjs
node scripts/validate-game-catalog.mjs path/to/catalog.json
```

Exit codes: `0` valid, `1` validation failure, `2` unreadable or invalid JSON.

## Data invariants

1. Game IDs are stable lowercase slugs and unique within a catalog.
2. Platform, route, source, availability and compatibility status use enumerated values.
3. Every entry has at least one declared route.
4. Every route lists prerequisites; limitations are recorded when known.
5. `PLAYABLE` requires a non-null test timestamp in the local validator. A production service should additionally require structured test evidence, runtime version, host configuration and a repeatable test result.
6. Remote play, cloud streaming, external capture and local emulation are distinct route types.
7. Sample records remain `NOT_TESTED`. The validator does not access games, run emulators or check external services.

## Compatibility evidence required before release claims

A test report should include title/build, media provenance category, runtime name/version, OS version, CPU/GPU/driver, rendering configuration, test date, boot and gameplay outcomes, frame-time/performance observations, input/audio/save results, defects, and a reproducible test procedure. Avoid logging account tokens, credentials or personal file paths.

## Next engineering step

Add unit tests with valid and deliberately invalid catalogs, then connect the catalog model to the UI. Only after choosing the host OS should the team implement a real native process launcher and a platform-specific runtime adapter.
