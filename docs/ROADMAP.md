# Yugatn Box Roadmap

**Status:** planned work. An item is not complete until testable artifacts and results exist.

## Stage 0 — Requirements
- Identify launch market, target user and price range.
- Conduct 15–25 user interviews.
- Prioritize games, stores, controllers, TV use and phone features.
- Define a legal checklist for game distribution, streaming, emulation, trademarks and licensing.
- Choose 2–3 candidate XR devices: at least one PC VR headset and one virtual-screen/AR-glasses use case if feasible.
- Document their connection, OS, runtime, GPU and vendor requirements.

**Exit criteria:** validated user problem, prioritized requirements, risk register, XR target shortlist, and no unsupported promise of native closed-console compatibility.

## Stage 1 — PC-based console shell
- Compare Linux-first and Windows-first configurations on similar hardware.
- Implement controller-first shell.
- Launch a limited set of PC games from supported sources.
- Implement the compatibility catalogue.
- Support HDMI output, audio, controllers, sleep and recovery.
- Minimize logs and telemetry.

**Exit criteria:** at least 10 selected games tested against a published matrix; core UI usable with a controller; reproducible update/rollback; limitations visible.

## Stage 2 — Phone Companion
- Implement mobile prototype and secure pairing with console confirmation.
- Add remote, keyboard and trackpad.
- Prototype local streaming.
- Display measured latency and stream quality.
- Add session revocation and disconnect handling.

**Exit criteria:** pairing is explicit and revocable; median and 95th-percentile latency measured; packet-loss and reconnection tests pass; remote access is not exposed to the internet by default.

## Stage 3 — XR-0: Device and runtime discovery
- Validate ports, adapters, power and bandwidth for selected headsets.
- Install supported runtimes on off-the-shelf host hardware.
- Detect device capabilities without assuming universal support.
- Document per-headset setup and recovery.

**Exit criteria:** repeatable connection, documented runtime versions, reliable return to TV/monitor after disconnect, no unsupported compatibility claims.

## Stage 4 — XR-1: Virtual screen
- Test ordinary PC games in a large virtual screen on compatible headsets/glasses where supported.
- Keep TV/monitor mode available.
- Measure display clarity, stability, latency, audio and comfort feedback.
- Distinguish virtual-screen support from native VR.

**Exit criteria:** supported devices and configurations documented; user can exit cleanly; limitations are clear.

## Stage 5 — XR-2: Native PC VR proof of concept
- Test a small, legally acquired set of XR applications.
- Integrate supported runtime, investigating OpenXR where applicable.
- Measure sustained frame time, missed frames, tracking, controllers, audio, sleep/wake and thermal behavior.
- Test session start/stop and runtime crashes.

**Exit criteria:** per-device test report, repeatable session start/exit, no critical data/privacy/security defects, known issues published.

## Stage 6 — XR-3: AR/MR capabilities
- Add only capabilities supported by selected hardware/SDKs: virtual panels, spatial placement, passthrough, hand tracking or other features.
- Use explicit permissions for camera, microphone, eye tracking and room mapping.
- Keep vendor-specific features behind adapters.

**Exit criteria:** capability-specific tests, privacy review and fallback behavior. No generic claim that all AR glasses support spatial overlays.

## Stage 7 — Compatibility and reliability
- Automate game launch/save/exit tests.
- Test long sessions, updates, low storage and network loss.
- Build regression matrices for OS, drivers, game runtimes and XR headsets.
- Independent security review.

**Exit criteria:** repeatable results; no critical data-loss or unauthorized-control defects; no Verified status without evidence.

## Stage 8 — Reference hardware
- Compare 2–3 x86-64 platforms.
- Measure game and XR performance, power, noise, thermals and cost.
- Choose enclosure, cooling, ports and repair path.
- Obtain BOM, assembly, warranty, returns, logistics and spare-parts estimates.
- Check target-market certification requirements.

**Exit criteria:** selected configuration meets defined sustained-load targets; cost based on supplier quotes; repair and supply-chain plans exist.

## Stage 9 — Closed beta
- Invite a limited volunteer group.
- Collect diagnostic reports only with consent.
- Measure first-run success, crash rate, compatibility, usability and support burden.
- Do not use closed game catalogues without permission.

**Exit criteria:** stability and satisfaction targets met; critical issues resolved or transparently blocked; privacy and support policies ready.

## Stage 10 — Commercial readiness
- Secure required licences and agreements.
- Complete hardware/radio certifications.
- Prepare distribution, warranty, repairs, returns and support.
- Verify trademark and product name.
- Publish only measured compatibility and performance claims.

## Cross-cutting workstreams

### Licensing
Do not bypass DRM or redistribute closed games, firmware or keys. Obtain jurisdiction-specific legal advice and licences as needed.

### Security and privacy
Unique device credentials, signed updates, secure pairing, XR permission controls, threat model for remote play, data minimization and vulnerability disclosure.

### QA
Versioned test matrix, regression tests, reports, known issues and release-blocking criteria.

### Economics
BOM, assembly, packaging, logistics, warranty reserve, returns, licences, support, infrastructure and margin. No final price before supplier quotes.

## Decisions for the project owner

1. Target market and hardware budget.
2. Low-cost PC-game access versus higher-end performance.
3. Disc drive or all-digital.
4. Phone remote, local streaming or both.
5. First ten PC games.
6. First two XR targets.
7. Is virtual-screen mode the XR MVP, with native VR after it?
8. Is wired XR acceptable for the first prototype, or is wireless a core requirement?

## Project governance

Each major feature needs a user problem, hypothesis, alternatives, acceptance criteria, tests, limitations, risks and status. Hypotheses are not proven until measured. If demand, compatibility or cost assumptions fail, revise the plan before custom hardware investment.


## Stage 2A — Smartphone Motion Controller
- Build the mobile sensor UI demo with permission prompt, calibration, recenter, sensitivity, dead zone, axis inversion and touch fallback.
- Implement authenticated local pairing with console confirmation and revocation.
- Add a virtual-gamepad protocol with versioning, sequence numbers, bounds checks and stale-input neutralization.
- Validate a racing tilt-steering profile first; then add flight pitch/roll, throttle, rudder and trim.
- Test at least one iPhone/Safari and one Android/Chrome device; record median and p95 end-to-end latency, jitter, packet loss and reconnect behavior.

**Exit criteria:** actual console-side game input is demonstrated in a test harness and one supported game; loss of phone/network/focus neutralizes controls within a measured timeout; permission denial retains touch fallback; pairing is revocable; no raw sensor data is uploaded by default. The static motion demo alone does not satisfy this stage.
