## Features

- **Production AI Trade Signal Parser**: Full integration of decoupled AI parser microservice supporting local, cloud, and CLI inferences.
- **Zero-Cost CLI AI Providers**: Added native integration for subscription-based CLI AI clients (`claude`, `agy` Antigravity CLI, `codex`) bypassing token costs and enabling visual trade recognition.
- **Intelligent 3-Tier Fallback Routing**: Robust parser execution falling back seamlessly: Regex Engine -> Local/CLI AI Inference -> Cloud Multimodal LLM (Gemini, OpenAI, OpenRouter).
- **Multimodal Visual Trade Parsing**: Automated OCR and image extraction parsing trading signals directly from chart screenshots, Discord image attachments, and markup annotations.
- **Repeated TP Signal Management**: Added tracking and update recognition for recurring Take Profit announcements and trailing stop adjustments within the same channel sequence.
- **Automated Discord E2E Testing Suite**: Added dedicated Discord live channel integration tests, message simulator, and comprehensive verification reports.

## Improvements

- Integrated parent process watchdog monitoring parent PID and guaranteeing zero dangling background microservices upon copier shutdown.
- Standardized product naming and metadata across Windows PE headers and background processes.
- Streamlined virtual environment activation across all build and sidecar generator scripts.

## Bug Fixes

- Resolved socket binding race conditions during microservice re-initialization.
- Fixed handling of multiline and symbol-delimited channel replies in Discord events.
- Fixed Inno Setup path bindings and installer staging for AI parser binaries.
