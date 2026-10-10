# Cross-Platform Game Compatibility — Xbox and PlayStation

**Status:** architecture proposal and staged integration plan. This document does not claim that Yugatn Box currently runs console games. Emulator support, streaming integrations and game launch are not yet implemented or validated in this repository.

## 1. Product objective

Yugatn Box should provide one library and launch experience for games available through several lawful execution paths:

1. Native PC builds installed through authorized stores or publishers.
2. Console emulators and compatibility runtimes, where the relevant platform/games are supported and the user has lawful access to the game and any required firmware/keys.
3. Official remote-play or streaming clients/services, where supported by the platform, account, region and subscription.
4. Physical console passthrough / capture workflows where legally and technically supported; capture is not the same as executing a console game on Yugatn Box.

The UI must distinguish these paths. It must not imply that owning a game automatically grants a native PC copy or that a PC can execute arbitrary Xbox Series or PS5 binaries.

## 2. Compatibility matrix (initial research baseline)

Compatibility changes over time and varies by game, build, firmware, OS, GPU and emulator configuration. Every row is a research direction, not a release guarantee.

| Platform / generation | Candidate path | Initial expectation |
|---|---|---|
| Xbox One / Xbox Series X|S | Official remote play or supported cloud/PC service; native PC edition where available | Do not plan on general local emulation of Xbox One/Series games. No broad compatible emulator backend is assumed. |
| Xbox 360 | Xenia family, where the selected build supports the host OS and title | Experimental, game-by-game; some titles run, others fail or have missing features. Not a replacement for Xbox Live or original hardware. |
| Original Xbox | xemu / Cxbx-Reloaded research track, after verifying platform/OS and per-title status | Separate compatibility track; Xbox 360 emulator Xenia does not run original Xbox games. |
| PlayStation 5 / PS4 | Official PS Remote Play; native PC editions where published; PS4 emulator research only for explicitly supported titles | PS5 local emulation is not a dependable general-purpose route. PS4 emulation remains experimental and must not be presented as broad compatibility. |
| PlayStation 3 | RPCS3, title-by-title, using supported host configuration | Mature research ecosystem, but game compatibility and performance vary; online services and all console features are not guaranteed. |
| PlayStation 2 | PCSX2 | Best early PlayStation local-emulation target; compatibility is broad but still title- and configuration-specific. |
| PlayStation 1 | A maintained PS1 emulator such as DuckStation or an equivalent lawful runtime | Candidate for an early retro compatibility track, subject to OS/license/security review. |
| Any generation with an official PC version | Native game build | Preferred when available: avoids console emulation and platform firmware dependencies. |

Reference projects and official information:
- Xbox backward compatibility catalogue: https://www.xbox.com/games/backward-compatibility
- Xenia Xbox 360 research emulator: https://xenia.jp/
- PCSX2 PlayStation 2 emulator: https://pcsx2.net/
- RPCS3 PlayStation 3 emulator: https://rpcs3.net/
- PlayStation Remote Play: https://remoteplay.dl.playstation.net/remoteplay/lang/en/
- Official PlayStation Remote Play support: https://www.playstation.com/support/games/remote-play-on-pc-and-mac/

Before integrating any external runtime, verify the current upstream release, license, OS support, security posture, build provenance, update process and per-game compatibility list. Do not bundle third-party software or redistribute copyrighted firmware without explicit permission.

## 3. Yugatn Game Compatibility Hub

Introduce a platform-neutral Game Compatibility Hub with these components:

### 3.1 Library Catalog
Stores user-selected game entries and metadata: title, platform/generation, installed path or official app identifier, source, artwork reference, controller profile, save location policy and compatibility record. Avoid scraping or bypassing store authentication.

### 3.2 Launch Provider Interface
A common interface that dispatches to separate providers:
- NativePCProvider
- OfficialRemotePlayProvider
- EmulatorProvider
- ExternalConsoleProvider (only authorized, supported integration)
- UnsupportedProvider (explains why launch is unavailable)

Providers must declare capabilities rather than assume parity. A provider returns a structured result: started / unavailable / failed / needs user action, with a safe diagnostic message. Never report success until the child process/session actually starts.

### 3.3 Runtime Registry
For each runtime record: display name, upstream URL, version, supported host OS/CPU/GPU, license, installation source, binary hash/signature where available, required user-supplied firmware, known limitations, last validation date and security advisory status.

Runtime installation must be opt-in. Only download from verified upstream sources or trusted OS package repositories. Do not run arbitrary installers from game folders.

### 3.4 Compatibility Database
Store per-game/per-runtime test evidence:
- game build/version and source format;
- runtime version and configuration;
- host OS, CPU, GPU and driver;
- rendering backend and resolution;
- boot result, gameplay result, crash rate and known defects;
- input/audio/saving/performance observations;
- evidence status: NOT_TESTED, BOOTED, IN_GAME, PLAYABLE, ISSUES, BROKEN, CONFLICTED;
- date and test method.

Do not infer “playable” from “boots”. The UI should show confidence, last test date and known limitations.

### 3.5 Save and State Manager
Keep saves separated by title, platform and runtime. Backups should be versioned and restorable. Do not promise save compatibility between native, emulated, streamed and original-console versions. Save-state support is runtime-specific. Never sync copyrighted firmware or account tokens by default.

### 3.6 Controller Translation
Connect the existing Universal Controller Manager to each provider. Provide per-game mappings and show missing capabilities. Do not emulate proprietary authentication or bypass anti-cheat. Some online games may reject emulated environments or unsupported input translation.

### 3.7 Overlay and Capture
Provide a platform-neutral overlay for performance, audio, recording and controller status. Recording should capture the rendered output through supported OS APIs; external-console capture requires supported capture hardware/software and may be restricted by platform protections. The overlay must not claim a capture source is available until tested.

## 4. Launch flow

1. User selects a game.
2. The hub identifies the platform and available lawful launch providers.
3. It displays route, prerequisites, estimated storage, known compatibility, and required user action.
4. It validates installed runtime/version, file path, firmware requirements and controller mapping.
5. It launches the selected provider without privilege escalation unless a clearly documented platform operation requires it.
6. It monitors process/session state, captures logs and offers a safe failure report.
7. On exit, it closes only the process/session it started, records diagnostics with consent, and returns to the library.

If more than one path is available, show choices rather than silently switching from a local emulator to cloud/remote play.

## 5. Security and legal boundaries

- No DRM circumvention, credential theft, unauthorized console access or bypass of platform authentication.
- No downloading or redistributing commercial game images, console BIOS/firmware, encryption keys or proprietary SDKs.
- Support lawful user-provided files and official accounts/services where permitted by applicable law and service terms.
- Never request store passwords in Yugatn Box; use official authentication flows only.
- Do not automatically execute files found on external drives. Scan/validate metadata and require explicit user launch.
- Sandbox emulator processes where the host OS supports it; restrict filesystem/network access where practical.
- Keep runtime updates auditable and signed/verified where upstream provides signatures.
- Clearly separate local execution, official remote play, cloud streaming and video capture.

This is an engineering plan, not legal advice. Jurisdiction and platform terms differ; distribution and runtime integration require review before release.

## 6. Recommended staged implementation

### G-0 — Architecture and inventory
- Create provider interfaces and typed launch results.
- Define game metadata and compatibility evidence schema.
- Add platform route badges: Native PC, Local emulator, Official Remote Play, Cloud streaming, External capture, Unavailable.
- No game launching in this phase.

### G-1 — Library prototype
- Search/add local game entries manually.
- Show platform, launch route, prerequisites and compatibility state.
- Add a mocked provider registry and a preview-only launch action.
- Clearly label mock data; never claim a game launched.

### G-2 — Native PC launcher
- Select one target OS and one native launch mechanism.
- Launch a harmless test executable in a controlled test directory.
- Verify process lifecycle, paths with spaces, non-ASCII paths, exit codes, logging and clean shutdown.
- Add store launch links/official URI schemes only where supported and documented.

### G-3 — First emulator integration
- Pick one target host OS and start with one mature, legally integrable runtime for a legacy generation (recommended first evaluation: PCSX2 for PS2).
- Integrate as an external runtime through a declared executable path, not by bundling copyrighted firmware or game content.
- Test a legally obtained homebrew/public-domain test image first, then user-owned content only within applicable law.
- Add per-title compatibility records and regression tests.
- Evaluate Xbox 360/Xenia and PS3/RPCS3 separately after the first runtime is stable.

### G-4 — Official remote-play adapters
- Investigate supported official client workflows for PS4/PS5 and Xbox services.
- Prefer launching the vendor-supported application or documented integration. Do not reverse-engineer account authentication or bypass platform controls.
- Confirm host OS, account, network, region and subscription prerequisites in UI.
- Remote play requires the user's compatible console/service; it does not mean the game executes locally on Yugatn Box.

### G-5 — Hardware and release qualification
- Benchmark CPU/GPU, graphics APIs, shader compilation, storage latency, thermals and memory pressure.
- Verify controller input, audio, suspend/resume, capture, saves and multi-display.
- Maintain a public compatibility matrix and regression suite.
- Do not advertise Xbox One/Series or PS4/PS5 local execution without reproducible evidence and a lawful supported implementation.

## 7. Release gates

A platform route may be marked Supported only when:
1. The exact runtime and version are identified.
2. Licensing and distribution have been reviewed.
3. Installation and launch work on the declared OS/hardware.
4. At least one repeatable test passes.
5. Per-title compatibility is represented honestly.
6. Failures and logs do not expose credentials, tokens or private paths by default.
7. Updates and rollback are documented.

## 8. Acceptance criteria for the first milestone

- Library distinguishes native, emulator, remote-play and unsupported routes.
- Selecting a mock game displays prerequisites and route without pretending to launch it.
- Provider failures are explicit and recoverable.
- Unknown runtime or game status defaults to NOT_TESTED, never PLAYABLE.
- The app never downloads game ROMs, console firmware, keys or proprietary assets.
- No platform or generation is described as universally compatible without measured evidence.

## Decision

Build the Game Compatibility Hub first, then integrate one legacy emulator and one native-PC launcher on a chosen host OS. Treat modern Xbox One/Series and PS4/PS5 as official remote-play/native-PC-first until a lawful, technically credible local execution route is demonstrated.
