# XR: Virtual Reality and Additional Reality Support

**Status:** proposed product architecture and roadmap. This document does not claim that XR hardware has been tested or that any headset is already supported.

## 1. Product goal

Yugatn Box should be designed as a living-room game system that can connect to:
- a TV or monitor over HDMI;
- a compatible VR headset for immersive stereoscopic experiences;
- AR/MR/XR glasses or headsets for spatial overlays, virtual screens, and mixed-reality experiences;
- a smartphone used as companion controller, setup device, or supported streaming endpoint.

“VR”, “AR”, “MR” and “XR” describe different usage modes, not a single interchangeable hardware interface. Compatibility must be assessed per headset, OS, runtime, connection method, application and feature.

## 2. XR modes

### Mode A — TV / Monitor
Standard 2D console mode. The TV/monitor remains the default output and recovery screen.

### Mode B — PC VR
The headset renders a stereoscopic scene with head tracking and supported controllers. The host GPU renders two views at a high and stable frame rate. The runtime and game must support the chosen headset and operating system.

### Mode C — Virtual screen
A headset or AR glasses display a large virtual 2D screen for ordinary supported PC games. This is not the same as native VR: the game may still render as a conventional flat image.

### Mode D — AR / MR companion
Where hardware and its SDK support it, the device can display virtual screens, companion controls, dashboards or spatial overlays. Real-world passthrough, environment mapping and occlusion are headset-specific capabilities and must not be assumed from a USB-C port alone.

### Mode E — Smartphone-assisted XR
The phone can help with setup, pairing, input, notifications or supported casting. A phone is not assumed to provide headset-grade tracking or low-latency XR rendering.

## 3. Hardware requirements

The initial prototype should use off-the-shelf PC hardware and test headsets before any custom enclosure or board is designed.

- **GPU:** choose from measured headset-specific requirements. VR needs sustained frame pacing and adequate GPU headroom, not merely a high average FPS in a flat-screen game.
- **Display link:** support the headset's actual connection requirements. Depending on the model, this may be DisplayPort, USB-C with DisplayPort Alt Mode, a vendor-specific link, or wireless streaming. HDMI on the console does not automatically carry video to every headset.
- **USB:** provide sufficient bandwidth and power for headset, tracking and accessories. Validate ports and controllers against each vendor's requirements.
- **Network:** wired Ethernet is preferred for wireless PC VR streaming tests; Wi-Fi capability alone does not guarantee a suitable experience.
- **CPU/GPU thermal design:** test sustained XR workloads, not just short benchmark bursts.
- **Memory and storage:** size against the selected OS, runtime and target games; do not lock the final BOM before headset and game testing.
- **Audio and input:** validate headset audio, microphone, hand controllers, tracking stations/sensors where required, and standard gamepads.
- **Fallback:** keep TV/monitor mode usable for setup, diagnostics and recovery even if a headset is disconnected or fails.

No universal resolution, refresh rate, latency, field of view or GPU target is specified until a target headset set is selected.

## 4. Software architecture

Separate XR integration from the core console shell:

1. **Device Discovery** — detects attached display/headset and reports only capabilities actually exposed by the OS/runtime.
2. **XR Compatibility Registry** — records headset model, connection, OS, driver, runtime version, supported modes and test results.
3. **Runtime Adapter** — integrates with the chosen supported XR runtime, for example OpenXR where supported by the headset, OS, driver and application.
4. **XR Session Manager** — starts, monitors and cleanly stops sessions; handles headset removal, runtime crashes, sleep/wake and focus changes.
5. **Performance Monitor** — records frame time, missed frames, reprojection/spacewarp status where available, dropped frames, temperature and connection stability.
6. **Input Mapper** — maps standard gamepad, tracked controllers and supported hand input without assuming every game accepts every input type.
7. **Display Router** — selects TV/monitor, headset VR, or virtual-screen mode, subject to actual runtime capabilities.
8. **Phone Companion** — pairs securely for setup, controls, status and supported auxiliary features.
9. **Recovery path** — provides an accessible way to end the XR session and return to the regular display.

Keep vendor-specific features behind adapters. Avoid hard-coding the entire product around one headset manufacturer.

## 5. Standards and integration strategy

- **OpenXR:** preferred investigation path for cross-vendor XR application/runtime interoperability when the selected OS, runtime and device support it. OpenXR is not a guarantee that every headset, store, game or vendor feature works.
- **SteamVR and other vendor runtimes:** investigate as optional integrations subject to platform support, licensing and compatibility tests.
- **AR/MR SDKs:** treat each vendor's spatial mapping, passthrough, hand tracking, eye tracking and anchoring as optional capabilities.
- **Wireless PC VR:** treat as a separate transport mode with its own bandwidth, latency, codec and stability acceptance criteria.
- **Virtual monitor mode:** investigate compatible headset software that exposes a virtual display or desktop. Do not claim a universal driverless mode without testing.

Do not bypass DRM, vendor authentication, platform security or licensing restrictions to make a headset or game work.

## 6. XR compatibility statuses

Use the same honest status model as the game catalogue, extended with XR details:

- **XR-NATIVE:** the application has a supported native XR mode on the tested configuration.
- **XR-VERIFIED:** full test matrix passed on the exact headset, runtime, OS, driver and application version.
- **VIRTUAL-SCREEN:** a flat-screen game works on a virtual display; not native VR.
- **STREAMING:** image is streamed from a supported host/service; local XR rendering is not implied.
- **LIMITED:** basic operation works but important features or performance targets are unmet.
- **UNSUPPORTED:** known blocking incompatibility.
- **NOT-TESTED:** no evidence sufficient to make a compatibility claim.

A headset being detected is not proof that games work. A game opening in a virtual screen is not proof of VR support.

## 7. XR safety and comfort

- Provide clear session-start and session-end controls.
- Show play-area/setup warnings where the runtime supports them.
- Do not launch immersive content automatically on device connection.
- Support immediate exit to a stable display and clear error messages.
- Make seated and standing modes explicit where relevant.
- Warn about motion discomfort and provide user-adjustable comfort settings when the game/runtime supports them.
- Respect eye-tracking, room-mapping, camera and microphone permissions; disable optional collection by default.
- Do not upload room scans, gaze data, voice or spatial maps without explicit consent and a clear purpose.
- Avoid claiming medical or accessibility benefits without evidence.

## 8. Validation matrix

For every candidate headset, record:
- exact model and firmware;
- cable/adapter/wireless connection;
- OS build, GPU, driver and XR runtime versions;
- application/game and version;
- supported mode (native VR, virtual screen, MR overlay or streaming);
- setup success and recovery from disconnect;
- sustained frame-time distribution and missed-frame rate;
- tracking stability and controller functionality;
- audio, microphone and sleep/wake behavior;
- temperature, power and network statistics;
- known issues and repeatability.

Test at least one short session and one sustained session. Use the target manufacturer's requirements and user-comfort criteria rather than a single generic FPS threshold.

## 9. Phased implementation

### XR-0 — Discovery and requirements
Select 2–3 candidate headsets spanning PC VR and virtual-screen/AR-glasses use cases. Review current OS, runtime and connection requirements. No hardware purchase should be based on a connector name alone.

### XR-1 — Virtual screen
Prove the easiest useful feature: display a normal console/PC screen in a compatible headset or glasses, if supported by the selected device and software. Keep TV output active.

### XR-2 — PC VR proof of concept
On off-the-shelf hardware, launch a small set of legally acquired applications through a supported runtime. Measure frame pacing, tracking, controller support, stability and recovery.

### XR-3 — MR/AR capabilities
Add only capabilities available through selected vendor SDKs and hardware: virtual panels, spatial placement, passthrough or hand tracking. Keep vendor-specific features optional.

### XR-4 — Productization
Only after repeatable tests, choose GPU, ports, cooling and enclosure. Publish a per-headset support matrix and maintain regression testing.

## 10. Decisions still open

1. Which XR headsets and glasses are priority targets?
2. Is the first release focused on PC VR, a giant virtual screen, or both?
3. Is wired headset connection required, or is wireless streaming a core requirement?
4. Which operating system/runtime combination is supportable with the team's QA budget?
5. What is the target hardware budget and power/noise envelope?
6. Which spatial features are must-have versus optional?

## Conclusion

XR support should be an architectural capability from the beginning, but it should not become an unbounded promise of universal compatibility. Yugatn Box should retain its TV/monitor mode, introduce virtual-screen support as the first low-risk XR target, and add native VR and AR/MR through tested runtimes and explicit headset-specific compatibility records.
