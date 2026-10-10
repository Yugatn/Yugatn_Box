# Yugatn Box — System Architecture

## 1. Design principles

- Start with off-the-shelf hardware; defer a custom motherboard until demand and requirements are validated.
- Separate the console shell, game runtimes, streaming, mobile companion and XR integration.
- Support tested configurations and publish limitations.
- Treat security, updateability, accessibility and repairability as first-class requirements.
- Do not bypass DRM, hardware checks or closed-platform security without lawful authority and permission.
- Treat VR/AR/MR/XR as supported modes with their own device/runtime requirements, not as a generic display connector.

## 2. System overview

```text
TV / Monitor (HDMI)       VR / AR / MR headset or glasses
        |                              |
        +--------- Display Router -----+
                       |
          Yugatn Box shell / Big-screen UI
                       |
       Launcher + Library + Compatibility Registry
                       |
       Runtime adapters: PC / compatibility / streaming
                       |
             XR Device & Session Manager
                       |
             Host OS + GPU drivers
                       |
         x86-64 CPU/GPU + RAM + NVMe + Network
                       |
        Phone Companion / local streaming
```

Conceptual architecture only; this is not a report of implemented or tested functionality.

## 3. Hardware layer

For the prototype, use a retail x86-64 mini-PC or desktop with integrated or discrete graphics. This makes it possible to validate OS, controller UI, streaming and XR before investing in custom hardware.

Preliminary reference goals to validate through tests:
- Modern x86-64 platform with maintained GPU drivers; choose the exact part after benchmarks.
- 16 GB RAM as a research baseline; 32 GB as a target for broader PC-game and background workloads.
- 1 TB NVMe SSD in the target configuration, replaceable/expandable where practical.
- HDMI 2.1 desirable for modern TVs/monitors; actual resolution, refresh, VRR and HDR depend on GPU, driver, cable and display.
- Ethernet for baseline tests; Wi-Fi 6 or newer desirable for local streaming.
- Multiple USB-A/USB-C ports for controllers, audio and peripherals.
- Sustained cooling, acceptable acoustics and power consumption.

### XR-specific hardware considerations

XR hardware cannot be selected from HDMI support alone. Headsets vary in required video link, USB data/power, runtime, tracking and GPU capability.

- Verify the exact headset connection: DisplayPort, USB-C DisplayPort Alt Mode, a vendor link box, or supported wireless streaming.
- A USB-C port does not automatically support DisplayPort Alt Mode, USB4 or Thunderbolt; inspect the specific device's port specification.
- HDMI output to a TV does not automatically provide the video transport required by a headset.
- Select the GPU against the target headset and application's render requirements, including sustained frame-time stability.
- Check USB bandwidth/power for tracking accessories and validate the required sensors/base stations.
- Test thermal behavior under sustained XR load.
- Keep TV/monitor output available as a recovery and setup path.

No universal headset resolution, refresh rate, GPU tier or latency target is claimed before a target device is selected.

## 4. Host OS

Prototype Linux-first and Windows-first on comparable hardware.

**Linux-first:** allows control over the console shell and update path; limitations may include anti-cheat, DRM, drivers and headset runtime support.

**Windows-first:** potentially broader access to PC games and XR runtimes; requires work on console UX, update behavior, background services and licensing.

**Recommendation:** choose based on repeatable game and headset tests, not ideology. XR runtime availability and support must be a scored selection criterion.

## 5. Big-screen UI

The controller-first shell should provide:
- Continue and recent games;
- library filtered by source and compatibility status;
- supported launcher access;
- devices and controllers;
- display/audio/network/power settings;
- downloads, updates, storage and saves;
- XR Devices: headset detection, supported modes, runtime status, setup and session exit;
- a visible way to return to TV/monitor mode;
- diagnostics and recovery.

All core system operations should be accessible without requiring a mouse.

## 6. Game compatibility manager

For every game record:
- game ID and source;
- game version, OS, driver and runtime;
- launch method and compatibility status;
- tested resolution/settings and measured FPS when available;
- known issues and test date;
- licence/source notes without storing passwords or secrets.

Opening to the title screen alone is not a successful compatibility test.

## 7. XR subsystem

Keep XR independent from the shell and game catalogue.

### Device Discovery
Detect only capabilities exposed by the OS/runtime and record the exact model, firmware and connection method.

### XR Compatibility Registry
Track headset, connection, OS, driver, runtime, application, supported mode, test evidence and known issues.

### Runtime Adapter
Integrate supported runtimes, investigating OpenXR where the selected headset, OS, driver and app support it. OpenXR does not guarantee universal hardware or game compatibility.

### XR Session Manager
Manage start/stop, focus, sleep/wake, disconnects, runtime crashes and return to regular display.

### Display Router
Offer TV/monitor, native XR and virtual-screen modes only when supported by the exact device and software.

### Performance Monitor
Record frame time, missed frames, reprojection status where exposed, dropped frames, temperatures, power and connection stability.

### Input Mapper
Support standard gamepads and compatible tracked controllers. Do not assume all games accept hand tracking or every controller.

### AR/MR Adapter
Keep passthrough, room mapping, spatial anchors, hand tracking and eye tracking behind vendor/runtime-specific capability checks and explicit permissions.

### XR safety and privacy
Do not auto-launch immersive content. Provide immediate exit, clear recovery, and optional comfort settings. Treat gaze, room scans, camera, microphone and spatial maps as sensitive data: no optional upload without explicit consent and a defined purpose.

## 8. Phone Companion

MVP:
- discover console on a trusted local network;
- pair with explicit confirmation on the console;
- touch remote, keyboard and trackpad;
- console status and downloads;
- local Remote Play for supported games;
- revoke sessions and paired devices.

Do not expose remote control to the internet by default. Internet access needs a separate threat model, authentication, encryption and routing design.

## 9. Streaming pipeline

Capture video/audio, encode, transmit to a paired device, decode, and return input events. Measure capture, encode, network, decode, display and input-return latency separately. For wireless PC VR, test the headset's supported transport and codec; ordinary Wi-Fi support is not enough to prove a usable XR experience.

## 10. Updates and recovery

- signed updates and integrity checks;
- separate system and user data;
- atomic update or safe rollback;
- version and failure logs;
- backup for supported settings/saves;
- diagnostics without default data wipe;
- explicit confirmation before destructive operations;
- recovery to TV/monitor mode if XR initialization fails.

## 11. Security

- unique device credentials; no shared factory password;
- explicit pairing and revocable sessions;
- minimum analytics, external telemetry off until informed consent;
- no plaintext store passwords/tokens;
- isolate game processes and system services where practical;
- security updates and vulnerability disclosure procedure;
- disable unneeded network services;
- require permission for camera, microphone, eye tracking and room-mapping data;
- never bypass DRM or platform protections as a standard product mechanism.

## 12. Performance and QA

For flat-screen games, measure average FPS, 1% low, frame pacing, load time, thermals, power, noise and stability.

For XR, measure the exact headset/application/runtime combination: sustained frame time, missed frames, reprojection where available, tracking stability, controller support, connection loss, sleep/wake, temperature, power and comfort-related user feedback. Do not substitute flat-screen FPS for XR performance.

## 13. Open decisions

1. Linux-first or Windows-first.
2. Hardware budget and target retail price.
3. Integrated or discrete GPU.
4. HDMI/HDR/VRR requirements.
5. Target VR headset(s) and AR glasses.
6. Wired versus wireless XR as a priority.
7. XR runtime and video-link requirements.
8. Streaming protocol/codecs.
9. Storefronts, licensing and regional service availability.
10. First set of mandatory games and XR apps.

These decisions must be made after prototyping and measurements.
