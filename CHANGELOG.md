# Changelog

All notable changes to QuantCopier Telegram Copier will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-23

### Features
- **Production AI Trade Signal Parser**: Full integration of decoupled AI parser microservice (`AI parser/server.py`) supporting local, cloud, and CLI inferences.
- **Zero-Cost CLI AI Providers**: Added native integration for subscription-based CLI AI clients (`claude`, `agy` Antigravity CLI, `codex`) bypassing token costs and enabling complex visual reasoning.
- **Intelligent 3-Tier Fallback Routing**: Robust parser execution falling back seamlessly: Regex Engine $\rightarrow$ Local/CLI AI Inference $\rightarrow$ Cloud Multimodal LLM (Gemini, OpenAI, OpenRouter).
- **Multimodal Visual Trade Parsing**: Automated OCR and image extraction parsing trading signals directly from chart screenshots, Telegram image attachments, and markup annotations.
- **Repeated TP Signal Management**: Added tracking and update recognition for recurring Take Profit announcements and trailing stop adjustments within the same channel sequence.
- **Automated Telegram E2E Testing Suite**: Added dedicated Telegram live channel integration tests, message simulator, and comprehensive verification reports.

### Improvements
- Integrated parent process watchdog monitoring parent PID and guaranteeing zero dangling background microservices upon copier shutdown.
- Standardized product naming and metadata across Windows PE headers and background processes.
- Streamlined virtual environment activation across all build and sidecar generator scripts.

### Bug Fixes
- Resolved socket binding race conditions during microservice re-initialization.
- Fixed handling of multiline and symbol-delimited channel replies in Telegram telethon events.
- Fixed app reopen login flow to automatically proceed to the Home screen once onboarding is complete instead of prompting for the Telegram phone number again.
- Optimized MT5 onboarding setup (`Step1MT5`) to wait for sidecar readiness, reuse cached validation data, eliminate duplicate account fetches, and remove false 5-second timeout error popups.
- Fixed duplicate concurrent API requests in `BackendDataContext` and prevented startup redirect loops between `/` and `/onboarding`.

---

## [0.9.0] - 2026-10-21

### Features
- **AI Microservice Architecture**: Introduced FastAPI and Uvicorn-powered AI parsing service decoupled from the core MT5 execution engine.
- **Multi-Provider Cloud LLM Engine**: Native support for Google Gemini, OpenAI, and OpenRouter API backends with dynamic model selection.
- **Image Signal Extraction**: Initial multimodal image ingestion reading signals from Telegram photo messages.

### Improvements
- Added healthcheck and heartbeat monitoring endpoints for inter-process sidecar communication.
- Structured parser responses conforming to strict Pydantic JSON schemas.

### Bug Fixes
- Fixed JSON decode errors on malformed LLM responses by adding automatic markdown fence striping.

---

## [0.8.0] - 2026-06-29

### Features
- **CI/CD Automated Cloud Release Pipeline**: Implemented automated GitHub Actions workflow (`build_and_release.yml`) triggered on version tags.
- **Background Auto-Updater**: Built-in non-blocking auto-updater (`auto_updater.py`) checking Firebase Storage / GCS for newer builds and staging self-updates.
- **Binary Distribution Manifest**: Automatic generation and synchronization of `Telegram/releases.json` tracking release binaries and direct download URLs.

### Improvements
- Added PE metadata resource embedding (`file_version_info.txt`) stamping `FileVersion` and `ProductVersion` directly into Windows executables.
- Silenced download progress console spam and routed updater logs to dedicated files.

### Bug Fixes
- Fixed Firebase Storage URL formatting and executable path resolution during update execution.
- Prevented PyInstaller from bundling stale version metadata by auto-patching version files prior to build.

---

## [0.7.0] - 2026-06-28

### Features
- **Configurable Fixed Lot Sizes**: Added per-symbol fixed lot size overrides allowing custom volume sizing per instrument regardless of default account settings.
- **Risk Multiplier Controls**: Introduced volume variation parameters and lot sizing rules based on individual channel risk tiers.

### Improvements
- Optimized lot size validation against broker minimum, maximum, and step lot specifications.

### Bug Fixes
- Resolved issue where minimum lot size was improperly calculated on fractional index lots.

---

## [0.6.0] - 2026-04-24

### Features
- **Tolerance-Based & Forced Market Execution**: Added `force_execute_market_orders` setting allowing pending limit/stop signals to execute as market orders within acceptable price slippage tolerances.
- **Cross-Currency Profit & Pip Value Normalization**: Enhanced pip and tick calculation engine to dynamically handle non-USD account currencies (including CAD, EUR, GBP).

### Improvements
- Improved message sanitization to parse comma-separated numbers and European price notations (`1,234.50`).
- Refined non-signal keyword filtering (e.g. "Trade Idea", "Setup Watch") to eliminate false execution triggers.

### Bug Fixes
- Fixed broker symbol path matching on prop firm accounts (e.g. GoatFundedServer).
- Fixed orphaned ticket repeating errors when orders are partially filled or canceled by broker.

---

## [0.5.0] - 2026-01-04

### Features
- **Dynamic Symbol Mapper Overhaul**: Complete rewrite of symbol resolution supporting case-insensitive lookups, broker prefixes, and broker suffixes (e.g. `.pro`, `.raw`, `_i`).
- **Market Watch Auto-Addition**: Automatically discovers and adds missing target trading symbols to MT5 Market Watch on demand.

### Improvements
- Optimized symbol extraction regex for sub-millisecond signal parsing.
- Handled absence of `magic_nr` and `comment` fields gracefully with fallback defaults.

### Bug Fixes
- Fixed case mismatch issues on commodity and crypto symbol mappings.

---

## [0.4.0] - 2025-05-23

### Features
- **Order Execution Engine Revamp**: Overhauled `place_order` and `modify_order` workflows for faster execution and tighter error recovery.
- **Multi-Take-Profit Order Management**: Native support for multi-order signals with individual partial profit targets and breakeven stop loss shifting.
- **Opposite Position Handling**: Added `CLOSE_OPPOSITE_POSITIONS` flag to automatically close conflicting hedges when a reverse signal arrives.
- **Pending Order Expiration**: Added expiration timer configurations for pending limit and stop orders.

### Improvements
- Enhanced logging with detailed order execution latency tracking.
- Added live MT5 account connectivity validation and graceful exit animations.

### Bug Fixes
- Fixed multi-order closure where trailing tickets were not properly matched.

---

## [0.3.0] - 2025-05-18

### Features
- **Sidecar Process Integration**: Seamless integration between Tauri desktop UI and Python `QuantCopierTelegram.exe` backend sidecar.
- **Process Lifecycle Management**: Automatic background launch, heartbeat monitoring, and clean shutdown of sidecar processes.
- **Windows Inno Setup Packaging**: Custom installer pipeline producing standalone `QuantCopierMT5TelegramSetup.exe`.

### Improvements
- Added toast notifications when sidecar processes start or reconnect.
- Replaced monolithic local configuration with dynamic runtime environment mapping.

### Bug Fixes
- Fixed issue where `QuantCopierTelegram.exe` failed to restart after abnormal termination.

---

## [0.2.0] - 2025-04-12

### Features
- **Interactive Multi-Stage Onboarding**: 5-step interactive onboarding wizard guiding users through configuration and MT5 account setup.
- **Live MT5 Credential Validation**: Real-time verification of MT5 login credentials, server IP, and account permissions.
- **Firebase Realtime Database Licensing**: License validation and subscription tracking via Firebase Realtime Database.

### Improvements
- Added caching for API authentication responses to minimize redundant cloud requests.
- Added settings card hover actions and responsive sidebar navigation.

### Bug Fixes
- Fixed UI loading screen stalls during initial stage reload.
- Resolved phone number authentication edge cases.

---

## [0.1.0] - 2025-02-12

### Features
- **Initial Desktop Shell**: Initial release of QuantCopier Telegram application built on Next.js and Tauri.
- **Authentication & Licensing Flow**: Phone number authentication with OTP verification and Firebase backend.
- **EULA Compliance**: In-app End User License Agreement acceptance and user session tracking.
