# Reference Profile Decision

**Status:** BLOCKED — no hardware has been selected or tested.  
**Decision window:** 7 calendar days, starting 2026-10-10; target decision date 2026-10-17.  
**Rule:** no game receives `Native`, `Verified` or `Playable` status until a specific profile is selected and a dated test report exists.

## Candidate evaluation checklist

Evaluate at least two commercially available mini-PC candidates against the same checklist. Record source links and the date checked; do not treat specifications or vendor claims as gameplay evidence.

| Criterion | Required record |
|---|---|
| Exact device | Manufacturer, model, SKU and regional availability |
| CPU / GPU | Exact model; integrated vs discrete GPU |
| Memory / storage | Installed RAM, channel configuration if known, SSD capacity |
| Linux support | Kernel/image version, firmware, Wi-Fi/Bluetooth, audio and suspend/resume |
| Graphics stack | GPU driver, Vulkan support, Gamescope compatibility |
| Controller | USB and Bluetooth pairing, reconnect after reboot |
| TV output | HDMI/DisplayPort version, target resolution and refresh rate |
| Thermals / noise | Sustained gaming behavior, fan noise and power limits |
| Recovery | Immutable/rollback update path or documented recovery procedure |
| Cost | Dated street price, taxes/shipping and availability in target region |
| Access | Unit available for repeatable testing; purchase or loan status |

## Decision procedure

1. Compare at least two candidates and one Linux gaming image per candidate.
2. Reject a candidate only with a recorded reason; distinguish missing data from a failed test.
3. Select one reference profile for the first 30-day MVP window. Keep Windows as a later comparison environment, not a second MVP support target.
4. Publish exact device, OS image/version, kernel, GPU driver and test date in the catalog.
5. If no unit is available by the decision date, record the blocker and keep the profile `NOT_SELECTED`; do not fabricate a selected profile to satisfy the roadmap.

## Current profile state

The catalog remains `NOT_SELECTED`. No physical hardware test, controller test, benchmark or game launch has been performed by this project yet.
