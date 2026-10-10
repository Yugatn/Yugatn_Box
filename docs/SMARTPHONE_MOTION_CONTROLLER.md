# Smartphone Motion Controller

**Status:** planned subsystem and browser proof-of-concept. No end-to-end console pairing or game-input backend is implemented yet.

## 1. Product concept

A smartphone can act as an optional second gamepad for Yugatn Box. It complements, rather than replaces, a physical controller. Its motion sensors can provide steering or pitch/roll input for racing games and flight simulators; its touchscreen can provide buttons, throttle, trim, menus and a fallback directional pad.

Use cases:
- **Racing:** tilt left/right to steer; touch controls for throttle, brake, handbrake and gear shift.
- **Flight simulator:** tilt/roll and pitch controls, with configurable axis mapping; touch controls for throttle, rudder, trim, brakes and view recenter.
- **General companion:** keyboard, touchpad, media controls, chat/second-screen UI and optional player-two input.
- **Accessibility / casual play:** customizable sensitivity and remapping, while preserving physical-controller support.

This is an optional input mode. Motion control must never activate unexpectedly or take over a connected physical controller without user consent.

## 2. Sensors and interpretation

Prefer fused device orientation for steering, rather than mapping raw acceleration directly:
- Device orientation can expose beta (front/back tilt) and gamma (left/right tilt), depending on browser/OS and sensor permission.
- Linear acceleration and acceleration including gravity have different meanings; raw accelerometer readings are noisy and include gravity unless the platform supplies gravity-compensated values.
- Flight simulation may need gyroscope/orientation data for smooth pitch and roll, not just linear acceleration.
- Sensor availability, axis conventions, permission prompts and sampling rates vary by device and OS.

The implementation must check capability at runtime and never assume a sensor is available. If orientation events are unavailable or denied, show a clear explanation and provide touch controls / manual input.

## 3. Calibration and control mapping

Each player/session should be able to:
- calibrate the current phone pose as neutral;
- recenter at any time;
- adjust sensitivity and dead zone;
- set minimum/maximum tilt angle;
- invert individual axes;
- swap axes for portrait/landscape or a preferred grip;
- select control profile: racing, flight, custom;
- pause motion input instantly;
- use a visible neutral indicator and sensor-health state.

A mapping function converts orientation delta from the calibrated neutral pose into a normalized axis in [-1, 1]. Apply dead-zone handling and smoothing with bounded response. Avoid auto-calibration while the user is actively steering, since that can silently shift the neutral point.

Conceptual pipeline: sensor event → capability/permission check → neutral calibration → filtering/dead zone → profile mapping → authenticated session transport → virtual gamepad axes/buttons. This is a design outline, not an implemented production pipeline.

## 4. Input protocol

Represent phone input as a virtual gamepad state:
- axes: steering, pitch, roll, rudder and optional camera;
- buttons: throttle, brake, boost, handbrake, gear shift, recenter, pause;
- metadata: session sequence number, monotonic timestamp where available, profile ID and protocol version.

Keep payloads small and bounded. The console must reject stale, malformed, out-of-range and unauthenticated messages. Use a sequence number to detect reordering and dropped updates. On disconnect, focus loss, backgrounding, permission loss or stale input timeout, return axes to neutral and release all buttons. Never leave a game stuck at full steering/throttle after the phone disappears.

Do not transmit sensor streams continuously when the game is paused or motion control is disabled. Prefer sending normalized controls rather than raw sensor history.

## 5. Connection and pairing

MVP plan:
1. Console displays a one-time pairing code or QR code.
2. Phone scans/enters the code; user confirms pairing on the console.
3. Pairing establishes an authenticated session on the trusted local network.
4. The user selects a game/control profile and presses **Enable motion controls**.
5. A visible connection indicator and **Pause / Disconnect** control remain available.
6. The user can revoke the phone from console settings.

Do not expose an unauthenticated input endpoint. Do not expose remote control to the public internet by default. A local WebSocket with authenticated pairing can be a simple first prototype; WebRTC data channels may be evaluated for later peer-to-peer transport. Transport selection requires latency, security and network testing. Browser sensor APIs normally require a secure context and, on some platforms, a user-triggered permission request.

## 6. Safety, privacy and reliability

- Ask for motion permission only after an explicit user action.
- Explain which sensor is used and what data is transmitted.
- Process motion locally on the phone; do not store or upload raw sensor history by default.
- Provide a large pause/disconnect control and visible connection state.
- Neutralize all axes on disconnect, tab hidden, phone locked or stale input.
- Avoid unbounded smoothing that adds perceptible lag.
- Keep steering response stable across sampling rates and phone models.
- Use a clear calibration gesture and prevent accidental recentering.
- Test portrait/landscape changes and OS interruptions.
- Include optional sensitivity, dead zone and axis inversion to reduce discomfort.
- Never represent a browser mockup as a connected gamepad or a measured latency result.

## 7. Latency and performance targets

Set acceptance criteria after measurement on selected devices. Measure end-to-end:
- sensor event to phone control state;
- network transport;
- console input processing;
- game-visible response where instrumentation is available.

Record median and 95th-percentile latency, jitter, packet loss, reconnect time, stale-input recovery and behavior under congested Wi-Fi. Do not claim a specific millisecond latency until measured. Prefer a stable wired Ethernet console and 5/6 GHz local Wi-Fi for initial tests where available; actual results depend on the access point, phone, interference and network topology.

## 8. Test plan

Minimum device matrix:
- at least one recent iPhone/Safari and one Android/Chrome device;
- sensor permission granted and denied;
- sensor missing/unavailable;
- portrait/landscape rotation;
- slow and fast tilting;
- calibration and recenter under load;
- app/tab backgrounded, screen locked, network lost and phone disconnected;
- malformed, repeated, delayed and out-of-range packets at the console boundary;
- stale-input timeout and neutral release;
- long-duration test for drift, thermal behavior and battery impact.

Record phone model, OS/browser, connection type, sampling behavior, test version, measured latency distribution and known issues.

## 9. Phased implementation

### MC-0 — UX and sensor demo
Build a mobile web page that requests permission after a tap, shows live orientation axes, supports calibration/recenter, sensitivity and dead zone, and has touch fallback. No console control claim.

### MC-1 — Local pairing
Implement a console pairing endpoint, one-time pairing code, explicit confirmation, session revocation and authenticated input channel.

### MC-2 — Virtual gamepad
Map normalized controls to a documented virtual gamepad interface and add a test harness before connecting real games.

### MC-3 — Racing profile
Implement tilt steering, throttle/brake touch buttons, neutral failsafe and per-device calibration. Test in selected supported PC games.

### MC-4 — Flight profile
Add pitch/roll/rudder/throttle mapping, axis inversion, trim and recenter. Test with simulator-specific input bindings.

### MC-5 — Production hardening
Add reconnect handling, telemetry minimization, security review, automated malformed/stale packet tests, and per-device compatibility results.

## 10. Acceptance criteria

A feature may be marked **verified** only when:
- pairing requires user confirmation and can be revoked;
- motion input cannot start without explicit enablement;
- neutral calibration and manual recenter work repeatably;
- sensitivity/dead-zone/inversion are applied consistently;
- loss of connection, focus or fresh input neutralizes controls within a defined tested timeout;
- axes/buttons are mapped and tested in a real supported game or test harness;
- median and p95 latency are measured under documented conditions;
- no raw motion data is stored or uploaded by default;
- sensor-denied and unsupported devices retain usable touch controls;
- results identify exact phone, OS, browser, console build and game/input backend.

## Open decisions

1. Which phone OS versions must be supported first?
2. Should the phone emulate a standard gamepad, expose a companion SDK, or both?
3. Which racing game and flight simulator form the first end-to-end test?
4. Is phone-as-player-two input in the MVP, or is motion control the priority?
5. What measured latency and reconnect thresholds are acceptable?

## Conclusion

Treat the phone as an optional motion-capable controller. For racing, calibrated tilt steering is a natural first use case. For flight simulators, configurable pitch/roll and touch-based throttle/rudder provide a stronger control surface. The essential engineering requirements are explicit permission, calibration, axis mapping, secure pairing, measured latency and a fail-safe neutral state on any interruption.
