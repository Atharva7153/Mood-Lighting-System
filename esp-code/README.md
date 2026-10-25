# 💡 ESP32 Mood Lamp Firmware

Embedded C++ Arduino firmware for the IoT Mood Lamp. Runs an onboard HTTP web server on an ESP32 microcontroller to drive 16 addressable WS2812B RGB LEDs, process physical button toggles, and handle IR motion detection.

---

## 📋 Features

- 🌐 **Embedded HTTP REST Server:** Listens on port 80 with full CORS support for browser-based remote control.
- 🌈 **FastLED RGB Engine:** Smooth, hardware-accelerated animations across 16 WS2812B LEDs.
- 🎨 **Dual Display Modes:**
  - **Single Color:** Solid color output with instant color switching.
  - **Multi Color:** Fluid cross-fading color animation across arbitrary RGB palettes.
- ⚡ **Dynamic Speed Control:** Real-time transition speed tuning (3ms to 200ms per step).
- 🔆 **4 Brightness Presets:** Ultra-Low (25), Low (64), Medium (128), High (255).
- 🔘 **Hardware Button Debouncing:** On/off toggle switch with 100ms software debouncing on GPIO 26.
- 📡 **IR Motion Detection:** Presence-aware automation mode on GPIO 27 (turns lamp on when presence detected).
- ✨ **Visual Boot Indicators:**
  - **Connecting to Wi-Fi:** Cyan sine-wave breathing animation (`breatheConnecting`).
  - **Connected Successfully:** Green fade-out animation (`fadeOutConnected`).
- 🛡️ **Offline Fallback:** 8 baked-in mood presets ready even without external MongoDB connection.

---

## 🧰 Hardware Specifications & Pinout

| Peripheral | ESP32 GPIO Pin | Pin Mode | Electrical Notes |
|---|---|---|---|
| **WS2812B Data Line** | `GPIO 13` | Output | Connect with 330Ω–470Ω series resistor to prevent signal reflections |
| **Tactile Push Button** | `GPIO 26` | `INPUT_PULLUP` | Connect button between GPIO 26 and GND |
| **IR Motion Sensor** | `GPIO 27` | `INPUT_PULLUP` | Connect digital OUT pin to GPIO 27 |
| **Power Supply** | `5V` & `GND` | Power | 5V 2A external power supply recommended (share common GND with ESP32) |

```
                       ESP32 DevKit
                     ┌───────────────┐
                     │          3V3  │
                     │          GND  │ ──── COMMON GND
                     │          GPIO13 ─── [470Ω] ─── DIN (WS2812B Strip)
                     │          ...  │
 [Push Button] ───── │ GPIO26        │
 (to GND)            │ GPIO27 ───────│ ─── OUT (IR Motion Sensor)
                     └───────────────┘
```

> [!WARNING]
> While a USB port can power the ESP32 and a few LEDs during prototyping, 16 LEDs at full white brightness can draw up to **0.96 Amps** (16 x 60mA). Use an external 5V (2A+) power supply with a shared ground for stable operation.

---

## 📁 Source File Breakdown

```text
esp-code/
├── main.ino              # Setup, loop, WiFi connection & visual feedback animations
├── lamp_control.h        # Pin declarations, FastLED definitions & function headers
├── lamp_control.cpp      # LED control logic, color blending engine, button & IR logic
├── mood_presets.h        # 8 hardcoded fallback mood lighting palettes
├── web_api.h             # REST API endpoint declarations
├── web_api.cpp           # HTTP route handlers, JSON deserialization & CORS response logic
├── wifi_config.h         # Wi-Fi network credentials (SSID & Password)
├── PROJECT_OVERVIEW.md   # In-depth viva & oral examination study guide
└── README.md             # This technical firmware guide
```

---

## 📦 Required Libraries

Install the following libraries via **Arduino IDE Library Manager** (`Sketch` -> `Include Library` -> `Manage Libraries...`):

1. **FastLED** (by Daniel Garcia) — Recommended v3.5 or higher.
2. **ArduinoJson** (by Benoit Blanchon) — Recommended v6.x.
3. **WebServer** & **WiFi** — Included automatically with the official ESP32 Arduino Board Package.

---

## 🚀 Flashing & Setup Guide

### 1. Configure Wi-Fi Credentials
Open `esp-code/wifi_config.h` in your editor or Arduino IDE:

```cpp
#ifndef WIFI_CONFIG_H
#define WIFI_CONFIG_H

const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

#endif
```

### 2. Configure Arduino IDE
1. Open `esp-code/main.ino`.
2. Ensure the ESP32 board package is installed:
   - Go to `Settings` / `Preferences` -> **Additional Board Manager URLs**:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to `Tools` -> `Board` -> `Boards Manager...` and search for **esp32** by Espressif Systems. Install it.
3. Select your board:
   - `Tools` -> `Board` -> `ESP32 Arduino` -> **ESP32 Dev Module** (or your specific module).
   - `Tools` -> `Upload Speed` -> `921600` (or `115200`).
   - `Tools` -> `Port` -> Select your ESP32 serial port.

### 3. Compile & Upload
1. Click **Upload** (or press `Ctrl+U` / `Cmd+U`).
2. *Note:* If the console displays `Connecting........_____`, press and hold the physical **BOOT** button on your ESP32 board until uploading starts.
3. Open the Serial Monitor (`Tools` -> `Serial Monitor`) at **115200 baud**.
4. Observe the IP address assigned to the ESP32:
   ```
   Connecting to YOUR_WIFI_SSID
   ................
   WiFi connected!
   IP address: 192.168.1.150
   HTTP server started on port 80
   ```

---

## 🔌 ESP32 REST API Reference

The onboard web server listens on **port 80** and handles JSON-formatted HTTP requests. CORS is enabled on all routes.

### 1. Color Control

#### Set Solid Color (`POST /color/single`)
Applies a single uniform RGB color across all 16 LEDs.
- **Request Body:**
  ```json
  {
    "r": 255,
    "g": 100,
    "b": 50
  }
  ```
- **Response:** `200 OK` (`"OK"`)

#### Set Multi-Color Sequence (`POST /color/multi`)
Begins smooth cycling animation across 2 or more colors.
- **Request Body:**
  ```json
  [
    { "r": 255, "g": 0, "b": 100 },
    { "r": 0, "g": 150, "b": 255 },
    { "r": 100, "g": 255, "b": 50 }
  ]
  ```
- **Response:** `200 OK` (`"OK"`)

#### Set Animation Speed (`POST /color/speed`)
Adjusts step transition delay (milliseconds per interpolation step).
- **Request Body:**
  ```json
  {
    "speed": 20
  }
  ```
- **Response:** `200 OK` (`"Speed updated"`)

---

### 2. IR Sensor Mode

- **Toggle IR Mode:** `POST /ir/toggle` or `GET /ir/toggle`
  - Optional JSON: `{"enabled": true}` or `{"enabled": false}`
- **Turn IR On:** `POST /ir/on` or `GET /ir/on`
- **Turn IR Off:** `POST /ir/off` or `GET /ir/off`

When IR mode is enabled:
- Lamp illuminates only when motion/presence is detected on GPIO 27.
- Lamp powers down when motion is no longer detected.

---

### 3. Brightness Control

Direct GET endpoints to scale overall FastLED master brightness:

| Endpoint | FastLED Value | Percentage |
|---|---|---|
| `GET /brightness/ultra-low` | `25` | ~10% |
| `GET /brightness/low` | `64` | ~25% |
| `GET /brightness/medium` | `128` | ~50% |
| `GET /brightness/high` | `255` | 100% |

---

### 4. Built-in Offline Mood Presets

These hardcoded presets work independently of any external server or database:

| Mood | Single Mode Endpoint | Multi Animation Endpoint |
|---|---|---|
| **Focus** (Cool blues) | `GET /focus/single` | `GET /focus/multi` |
| **Cozy** (Warm amber) | `GET /cozy/single` | `GET /cozy/multi` |
| **Social** (Warm peach) | `GET /social/single` | `GET /social/multi` |
| **Golden Hour** (Sunset gold) | `GET /golden-hour/single` | `GET /golden-hour/multi` |
| **Late Night** (Deep purple/indigo) | `GET /late-night/single` | `GET /late-night/multi` |
| **Rainy Day** (Slate blue/gray) | `GET /rainy-day/single` | `GET /rainy-day/multi` |
| **Creative Flow** (Vibrant violet/cyan) | `GET /creative-flow/single` | `GET /creative-flow/multi` |
| **Romantic** (Rose & magenta) | `GET /romantic/single` | `GET /romantic/multi` |

---

## 🧪 Testing with cURL

Replace `192.168.1.150` with your ESP32's assigned IP address:

```bash
# Set solid red color
curl -X POST http://192.168.1.150/color/single \
  -H "Content-Type: application/json" \
  -d '{"r": 255, "g": 0, "b": 0}'

# Set multi-color palette
curl -X POST http://192.168.1.150/color/multi \
  -H "Content-Type: application/json" \
  -d '[{"r": 255, "g": 215, "b": 0}, {"r": 0, "g": 180, "b": 255}]'

# Set medium brightness
curl -X GET http://192.168.1.150/brightness/medium

# Trigger built-in Cozy mood
curl -X GET http://192.168.1.150/cozy/multi
```

---

## 📚 Viva & Technical Deep-Dive

For complete hardware circuit diagrams, function-by-function code explanations, interview questions, and viva preparation, see [PROJECT_OVERVIEW.md](file:///Users/atharvasharna/Desktop/Mood/esp-code/PROJECT_OVERVIEW.md).
