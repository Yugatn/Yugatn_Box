# MVP Scope and Market Positioning

**Status:** product hypothesis for validation, not a claim of a released product.

## One-sentence positioning

**A couch-friendly shell for your existing PC library, backed by a public compatibility matrix and optional local streaming to your phone.**

Yugatn Box does not attempt to reproduce closed console ecosystems. It aims to make PC games easier to discover and launch from a TV, and to publish reproducible evidence about what works on a declared reference system.

## The problem to solve

A generic Linux gaming image, mini-PC and controller UI are no longer sufficient differentiation. Existing products already offer living-room PC gaming, compatibility layers, launcher aggregation and streaming. Yugatn Box must answer the question: "Why not install Bazzite, ChimeraOS or Steam Big Picture?"

The hypothesis to test is that players value a product-owned, independently reviewable compatibility record, a deliberately narrow supported hardware profile, and a unified TV-to-phone experience more than another general-purpose gaming image.

## MVP includes

1. A minimal controller-first shell with **Continue / Library / Settings**.
2. A machine-readable game catalog and report schema.
3. A declared reference hardware/software profile, selected before compatibility claims.
4. Public reports that separate tested facts, known issues and unknowns.
5. Safe manual library entries and metadata import/export; no silent command execution.
6. A measured path toward one PC launch integration, followed by optional local streaming via an existing backend.

## Explicitly out of scope

- Native launch of PS5, PS4, Xbox Series, Xbox One or Nintendo Switch games on Yugatn Box hardware.
- Building a custom SoC or console hardware before demand and software value are demonstrated.
- A proprietary video codec or streaming stack.
- Replacing Game Pass, PS Plus, Steam, GOG or other store entitlements.
- Universal compatibility with all PC games.
- DRM, anti-cheat, encryption or platform-security circumvention.
- A Windows/Linux dual-OS support matrix during the first MVP.

## Competitive answer

| Alternative | Already does well | What Yugatn Box must add to justify itself |
|---|---|---|
| Bazzite / ChimeraOS / SteamOS-style setups | PC gaming OS, controller-first living-room UX | Publicly reproducible reports tied to a clearly declared reference profile, plus one cohesive companion workflow |
| Steam Big Picture | Steam library and couch navigation | Evidence for supported routes beyond a single launcher, only where safe and permitted |
| Steam Deck / PC handhelds | Integrated hardware/software, portable use | TV-first appliance UX and a documented, repairable reference mini-PC profile |
| Moonlight / Sunshine / Steam Link | Established streaming transport | Clear device pairing, revocation and measured latency in one companion workflow |
| PlayStation Portal / Xbox Remote Play | Console-to-client streaming | Yugatn Box focuses on locally accessible PC games; console remote play remains a separate official-client handoff |
| DIY mini-PC | Hardware flexibility | Ready-to-use UX, known-issues list, recovery policy and tested profile |

This table is a positioning hypothesis, not a claim that Yugatn Box currently outperforms these products.

## Killer scenario

A player turns on the reference mini-PC, reaches the shell, selects a previously tested PC game using a controller, understands the compatibility status and known issues, starts it, and returns to the shell after exit or failure. Later, the player can explicitly pair a phone and start a stream through a supported existing backend.

## Initial success metrics

Record baselines before setting targets:
- Cold boot to interactive shell.
- Shell to game process start and shell to first interactive gameplay.
- Percentage of test runs that return cleanly to the shell.
- Controller and audio test pass rate.
- Compatibility reports with complete profile, date, steps and evidence.
- Stream latency p50/p95, dropped frames and reconnect behavior on a specified LAN.
- Support hours per 100 beta users and QA time per game.

Do not announce a threshold as achieved until raw measurements, environment and method are published. A proposed target such as "under 30 seconds to gameplay" is a test hypothesis, not a current result.

## First 30-day decision

Select one reference mini-PC and one Linux image, time-box the decision, and document exact OS/kernel/GPU/driver versions. If no candidate meets stable controller, graphics, suspend/resume and update requirements, document the blocker instead of indefinitely deferring the decision.

Before committing to broad launcher integration, interview 15 target users and gather a ranked list of 20 games. This is discovery input, not evidence of market size.

## Go / no-go gate

Proceed to a closed beta only after:
- the shell is usable by controller and keyboard;
- at least one actual game has a complete, reproducible report on the declared reference profile;
- launch failure and shell recovery have been exercised;
- update and data export/recovery behavior is documented;
- the compatibility catalog is publicly accessible and clearly distinguishes tested from untested;
- interview feedback confirms the evidence + companion workflow solves a problem not already solved adequately by the user's current setup.
