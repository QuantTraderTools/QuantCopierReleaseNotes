## Features

- **Production AI Trade Signal Parser**: Full integration of decoupled AI parser microservice supporting local, cloud, and CLI inferences.
- **Zero-Cost CLI AI Providers**: Added native integration for subscription-based CLI AI clients (`claude`, `agy` Antigravity CLI, `codex`) bypassing token costs and enabling visual trade recognition.
- **Intelligent 3-Tier Fallback Routing**: Robust parser execution falling back seamlessly: Regex Engine -> Local/CLI AI Inference -> Cloud Multimodal LLM (Gemini, OpenAI, OpenRouter).
- **Multimodal Visual Trade Parsing**: Automated OCR and image extraction parsing trading signals directly from chart screenshots, Telegram image attachments, and markup annotations.
- **Repeated TP Signal Management**: Added tracking and update recognition for recurring Take Profit announcements and trailing stop adjustments within the same channel sequence.
- **Automated Telegram E2E Testing Suite**: Added dedicated Telegram live channel integration tests, message simulator, and comprehensive verification reports.

## Improvements

- Integrated parent process watchdog monitoring parent PID and guaranteeing zero dangling background microservices upon copier shutdown.
- Standardized product naming and metadata across Windows PE headers and background processes.
- Streamlined virtual environment activation across all build and sidecar generator scripts.

## Bug Fixes

- Resolved socket binding race conditions during microservice re-initialization.
- Fixed handling of multiline and symbol-delimited channel replies in Telegram telethon events.
- Fixed Inno Setup path bindings and installer staging for AI parser binaries.
- Fixed app reopen login flow to automatically proceed to the Home screen once onboarding is complete instead of prompting for the Telegram phone number again.
- Optimized MT5 onboarding setup to wait for backend readiness, reuse cached validation data, eliminate duplicate account fetches, and remove false 5-second timeout error popups.
- Deduplicated concurrent backend data fetches and prevented startup redirect loops between login and onboarding.
