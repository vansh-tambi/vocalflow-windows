# VocalFlow for Windows

## Port of the macOS VocalFlow app to Windows using Electron

VocalFlow is a lightning-fast, highly accurate workflow tool that instantly converts your speech into highly formatted, optimized text anywhere on your computer using global hotkeys.

## Minimum Requirements
- **OS**: Windows 10 or Windows 11
- **Node**: Node.js 18+
- **APIs**: 
    - Deepgram API key (Required for ultra-fast, real-time transcription)
    - Grok API key (Optional but highly recommended for fast grammar and styling)

## Quick Start
1. Clone the repository: `git clone <repository_url>`
2. Navigate into the directory and install dependencies:
    ```bash
    cd vocalflow-windows
    npm install
    ```
3. Set your initial keys by editing `config/config.js` or via the interactive UI later.
4. Launch the application:
    ```bash
    npm start
    ```

## Configuration & Usage
VocalFlow maintains a fallback cascade for its configurations. The application initially reads hardcoded fallback values from `config/config.js`. 
Once you interact with the tray application and change configurations within the **Settings UI** (Runtime), the dynamic settings are permanently stored into Windows local AppData:
`%APPDATA%/VocalFlow/settings.json`

### Balances & API Usage Tracking
Neither Deepgram nor Grok actively provides an instant "Remaining Dollar Balance" directly through their APIs. To give you accurate spending feedback:
- **Local Application Tracker**: VocalFlow calculates and tracks all API usage metrics locally on your machine (`%APPDATA%/VocalFlow/usage.json`).
- **Cost Approximation**: It measures exact tokens processed dynamically via Grok (e.g. `grok-2` usage responses) and calculates physical seconds captured down to the final millisecond for Deepgram, allowing you to preview exactly how much budget you have burned through the internal settings array.

### Fault-Tolerant Engine Features:
- **Global Deepgram Unblocker**: Deepgram's base API URLs are actively blocked by default on some internet connections and ISPs, triggering local `ENOTFOUND` Node DNS errors. VocalFlow intelligently bypasses Node's native routing infrastructure across all REST and WebSockets bindings, intercepting connections and forcing secure lookups directly to Google's Public DNS (8.8.8.8).

## Project Structure
```
vocalflow-windows/
├── config/
│   └── config.js              # Hardcoded default values
├── src/
│   ├── main/
│   │   ├── main.js            # Electron Main Process 
│   │   ├── settingsManager.js # File System config handlers
│   │   ├── usageService.js    # Local DB & tracking persistence
│   │   ├── deepgramService.js # Deepgram WebSocket logic
│   │   ├── grokService.js     # Grok (xAI) REST API logic
│   │   └── balanceService.js  # Service to combine local usage values
│   └── renderer/
│       ├── preload.js         # Secure bridge to Main Process
│       ├── overlay.html       # The transparent Listening display UI
│       ├── settings.html      # Premium Settings UI Interface
│       └── settings.js        # Logic bound to Settings UI
├── .gitignore
├── package.json
└── README.md
```

## Troubleshooting
| Issue | Potential Solution |
|--------|----------------------------|
| App doesn't launch / crashes immediately | Ensure you are on Node.js 18+ and have run `npm install`. |
| "Listening" overlay appears, but nothing types | Ensure you have placed a valid Deepgram token and have network access. |
| Global Keybinding behaves erratically | Go to the System Tray, open Settings, and toggle to a different explicit keybinding like Right Alt. |
| Text is not capitalizing / formatting | Ensure the Grok toggle is actively ENABLED in the Settings panel and a key is provided. |

## Credits
- **Vocallabsai/vocalflow**: Original macOS application design and architecture.
- **Deepgram**: Underlying foundational model logic for real-time STT.
- **xAI (Grok)**: Accelerated processing logic for stylistic changes.
- **Electron**: Powering this desktop transition smoothly.
