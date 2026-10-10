# Product Strategy: Player Sovereignty

**Status:** proposed direction, not shipped functionality.

## Product decision
Yugatn Box should become an open, controller-first gaming environment and unified library manager, not a promise to execute every closed-console game locally. The first milestone should be Linux-first PC gaming, with explicit compatibility routes and measurable tests.

## Differentiation
- One TV-friendly library across supported PC launchers and manually added games.
- Native Linux launch first; optional compatibility-layer launch where supported by the user's setup.
- Clearly separated routes: native PC, compatibility layer, local emulator, official remote play, cloud streaming and external capture.
- Controller-first UI, keyboard/mouse recovery, portable metadata and safe export.
- Player-owned configuration, privacy-respecting defaults, signed updates and public compatibility evidence.
- Phone-as-gamepad, motion input, handheld mode, headset audio, USB recording and XR remain modular follow-up capabilities.

## Scope control
### MVP
1. Choose one Linux distribution and a documented hardware target.
2. Build a controller-first shell for TV/monitor use.
3. Support manual library entries and safe metadata import from documented APIs/formats.
4. Implement native process launch, exit/crash detection and return-to-shell recovery.
5. Connect the catalog schema to the UI; show route prerequisites and NOT_TESTED status honestly.
6. Test with a harmless local application before integrating a game launcher.

### Later, after MVP tests
- One launcher/compatibility-layer integration.
- Sunshine/Moonlight-compatible local streaming or a clearly documented external-client handoff, subject to upstream license and compatibility.
- Phone motion controls, handheld power/resolution profiles, headset routing, USB recording.
- XR device/runtime discovery only after frame pacing, tracking and comfort tests.
- Emulator adapters for selected legacy platforms after OS/hardware/legal review.
- Official Xbox/PlayStation remote-play handoffs where supported.

## Explicit non-goals
- Universal local execution of Xbox One/Series or PS4/PS5 games.
- DRM, anti-cheat, account-check or platform-security circumvention.
- Distribution of commercial game images, console firmware, keys or proprietary assets.
- A claim that 100% of PC games work. Drivers, anti-cheat, licensing and runtime differences prevent such a guarantee.
- Integrating every storefront before the core launch lifecycle is reliable.

## Provider architecture
Keep platform logic outside the UI. Define small interfaces:
- LibraryProvider: import/export metadata from explicit, documented sources.
- LaunchProvider: probe, prepare, launch, stop and collect redacted diagnostics.
- StreamProvider: local PC streaming, official remote play, cloud streaming and external capture as distinct route types.
- InputProvider: gamepad mapping, keyboard fallback, phone motion input and per-game profiles.
- XRProvider: runtime/device discovery and capability reporting.
- UpdateVerifier: verify signed update metadata/artifacts and fail closed on signature errors.
- CompatibilityEvidenceStore: separate reproducible test evidence from user preferences.

Every provider must report explicit states such as available, needs-user-action, unsupported, blocked-by-platform, failed and running. Never silently switch local execution to streaming; explain the route, network/account requirements and request consent.

## Library aggregation and safety
- Start with manual entries and one or two integrations chosen from real user demand.
- Prefer documented APIs and supported export formats; never scrape credentials or upload library data by default.
- Treat imported metadata as untrusted. Validate paths and never execute an imported command without clear confirmation.
- A unified UI does not replace game ownership, store entitlements, launchers or platform terms.
- Keep secrets in OS credential storage, never in the JSON catalog or logs.
- Let users disconnect and remove each provider independently.

## Verifiable security
- Pin dependencies and publish an SBOM for release artifacts.
- Sign release artifacts/update metadata and verify before installation.
- Document provenance, network destinations, telemetry defaults, data retention and rollback.
- Never commit private signing keys; protect signing access separately.
- Prefer no telemetry or clearly opt-in telemetry, with local logs and export/delete controls.
- Use least privilege and isolate third-party runtimes where practical. Open source alone does not prove the absence of backdoors.

## Acceptance gates
- Controller navigation plus keyboard recovery works on the declared OS/hardware.
- Mock-provider tests run without installing a game or contacting a third party.
- Failed launches return to the shell and do not corrupt library data.
- Every route identifies whether it is implemented, needs setup or is not tested.
- Update signature failure blocks the update and preserves the installed version.
- Streaming tests record latency, bitrate, reconnect and input results on a defined network.
- No broad compatibility claim is based on one title or a schema validation result.

## Decision and next sequence
Choose Linux-first and one supported hardware profile; do not promise a simultaneous full Windows/Linux matrix in the MVP. Then: (1) connect catalog to UI, (2) implement safe manual add/edit/import/export, (3) define and test a mock LaunchProvider, (4) launch a benign local application, (5) integrate one PC launcher, (6) evaluate streaming and XR against measurable criteria.

**Success metric:** a player can find a legitimately accessible game, understand its exact launch route and limitations, start it with a controller, recover from failure, and verify what the system changed. More platform logos are not a success metric.
