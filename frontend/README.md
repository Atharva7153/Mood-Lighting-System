# ☕ Café Ambiance - Mood Lighting Web Client

A sleek, responsive ambient lighting control dashboard designed for cafes, study spaces, and creative workspaces. Built with modern HTML5, CSS3, and vanilla ES6 JavaScript.

---

## 📖 Overview

The **Café Ambiance** web client provides an intuitive interface for patrons and staff to set the room's mood. It follows a decoupled, hybrid architecture:

1. **Preset Management:** Reads custom lighting palettes and mood collections from the **Node.js / MongoDB Backend**.
2. **Direct Hardware Control:** Transmits real-time lighting commands directly to the **ESP32 Microcontroller's IP** over local Wi-Fi with ultra-low latency.

---

## ✨ Features

- 🎨 **Dynamic Mood Cards:** Automatically fetched from the backend API, displaying custom mood titles and color cues.
- 🎛️ **Dual Lighting Triggers:**
  - **Single Color Button:** Instantly switches the lamp to a solid ambient hue.
  - **Multi Color Button:** Activates smooth, continuous cross-fading animations through the mood's multi-color palette.
- ⏱️ **Real-Time Speed Slider:** Adjusts animation transition intervals between 3ms (rapid dynamic flow) and 200ms (slow, relaxing breathing).
- 🔆 **4 Brightness Levels:** One-click quick switching between Ultra-Low (10%), Low (25%), Medium (50%), and High (100%).
- 📡 **IR Presence Sensor Toggle:** Interactive toggle to enable or disable automatic motion-sensing mode on the lamp.
- ⚙️ **On-the-Fly Endpoint Configuration:** Freely update the **Backend URL** and **ESP32 Device IP** directly within the settings panel—persisting across actions without code changes.
- 📱 **Fully Responsive:** Fluid layout with smooth animations, mobile-optimized touch controls, and elegant typography (*Playfair Display* & *Lato*).

---

## 📁 Directory Structure

```text
frontend/
├── index.html     # Semantic HTML markup, control panels & ES6 client-side logic
├── styles.css     # Bespoke CSS design, responsive grid, animations & variables
└── README.md      # This user interface documentation
```

---

## 🚀 How to Run the Frontend

Because the frontend is a pure static web app (HTML/CSS/JS), it requires no build steps or bundlers.

### Option 1: VS Code Live Server (Recommended)
1. Install the **Live Server** extension in VS Code.
2. Right-click `frontend/index.html` and click **"Open with Live Server"**.

### Option 2: Python Built-in HTTP Server
In your terminal:
```bash
cd frontend
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

### Option 3: Node `npx serve`
```bash
cd frontend
npx serve .
```

---

## ⚙️ Configuration & Usage Guide

Once the web page is open:

### 1. Configure Connection Endpoints (Settings Panel)
Scroll down to the **Settings** section:
- **Backend URL:** Enter your running backend address (e.g. `http://localhost:3000` or your deployed URL `https://mood-lamp-backend.vercel.app`).
- **Device IP:** Enter the local IP address of your ESP32 shown in the Arduino Serial Monitor (e.g. `http://192.168.1.150`).

### 2. Control Lighting
- **Apply a Mood:** Click **Single Color** or **Multi Color** on any card. The lamp will respond instantly.
- **Adjust Transition Speed:** Drag the **Multi Transition Speed** slider to alter how fast colors morph.
- **Adjust Brightness:** Click any of the four brightness buttons (**Ultra-Low**, **Low**, **Medium**, **High**).
- **Motion Sensor:** Use the **IR Sensor** toggle in the top hero banner to switch between manual control and presence detection.
- **Reload Presets:** Click the **↻ Refresh** button in the navigation bar to re-fetch presets from the database.

---

## 🌐 Network & CORS Notes

- **Same Wi-Fi Network:** The device running your web browser and the ESP32 microcontroller must be on the **same local Wi-Fi subnet** for direct IP requests (`http://<ESP_IP>`) to succeed.
- **Mixed Content Warning:** If you host this frontend on an **HTTPS** URL (e.g. `https://your-domain.com`), modern browsers may block requests to the local ESP32 (`http://<ESP_IP>`) due to Mixed Content restrictions. For local hardware control:
  - Serve the frontend over plain **HTTP** (like `http://localhost:8080`), OR
  - Allow mixed content in your browser settings for testing.
