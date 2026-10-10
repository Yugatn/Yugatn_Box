# Yugatn Box Compatibility Index

**Public contract:** machine-readable game records and reproducible test reports.  
**Current status:** sample wishlist records only; no Yugatn Box gameplay compatibility is confirmed.

## Files

- `catalog.json`: index of titles and their current evidence state.
- `game.schema.json`: per-title metadata contract.
- `report.schema.json`: repeatable test-report contract.
- `reports/YB-TEST-0001.json`: example of an unrun test template.

## Rules

1. `Not tested` means no test result is known. It must never be displayed as "probably works".
2. `Native`, `Verified` and `Playable` require a dated report and a declared profile. A catalog record by itself is not evidence.
3. `Streaming-only` must name the streaming route and supported host/client conditions; it does not mean local execution.
4. `Unsupported` needs a scope, environment and reason; it is not a universal claim across all configurations.
5. Performance results are incomplete without hardware, OS, GPU driver, resolution, game version and measurement method.
6. Reports should capture launch, controller, audio, exit/recovery and relevant suspend/resume behavior.
7. Separate independently reviewed evidence from self-reported or draft data.
8. Never publish credentials, account identifiers, personal filesystem paths or other private information in reports.
9. Do not bundle copyrighted game assets, firmware, keys or proprietary content in this repository.

## Record lifecycle

`Wishlist → Not tested → Test run → Draft report → Reviewed report → Re-test after material environment changes`

No automated status promotion is allowed merely because the JSON schema passes. A future validator may enforce consistency, but humans and repeatable test runs supply the evidence.

## Reference profile

The current catalog deliberately marks the reference profile as `NOT_SELECTED`. Select a specific mini-PC, Linux image and GPU driver before creating verified reports. Do not compare FPS figures across unspecified or materially different configurations.

## Reporting performance

Store average FPS and 1% low only when measured with a documented tool and repeatable run. For streaming, track input-to-photon latency separately from network RTT; if only RTT is measured, label it RTT rather than input latency.
