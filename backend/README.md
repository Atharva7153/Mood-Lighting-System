# 🎛️ Mood Lamp Backend API & Admin CMS

A lightweight Node.js & Express REST API powered by MongoDB (Mongoose) for managing mood lighting presets, paired with an integrated Admin CMS and dashboard.

---

## 📖 Overview

The backend acts as the central cloud/local storage hub for custom mood lighting configurations. While the ESP32 microcontroller can run standalone with baked-in fallback presets, this backend allows users, cafe managers, and administrators to:

- Store rich mood presets with single-color and multi-color palettes in MongoDB.
- Dynamically curate moods using an interactive visual Admin panel (`/admin.html`).
- Provide an API consumed by the Café Ambiance web frontend to render live mood cards.

---

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) (v16.x or newer recommended)
- **Web Framework:** [Express.js](https://expressjs.com/) v4.18
- **Database / ODM:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) v7.0
- **Cross-Origin Handling:** [cors](https://www.npmjs.com/package/cors)
- **Environment Management:** [dotenv](https://www.npmjs.com/package/dotenv)
- **Frontend Stack (Bundled Admin):** HTML5, CSS3, Vanilla ES6 JavaScript

---

## 📁 Directory Structure

```text
backend/
├── index.js              # Express server setup, database connection & API routes
├── models/
│   └── mood.js           # Mongoose schema for Mood entities
├── package.json          # Node project metadata, scripts & dependencies
├── package-lock.json     # Locked dependency tree
├── seed.js               # Database seeding utility for default mood palettes
├── .env.example          # Sample environment variables configuration
├── .gitignore            # Git ignore rules for node_modules and .env
├── public/               # Static web interfaces served by Express
│   ├── admin.html        # Interactive Mood Preset Admin CMS
│   ├── admin.css         # Styling for Admin panel
│   ├── index.html        # Alternative Cafe lighting web controller
│   └── styles.css        # Styling for the web controller
└── README.md             # This documentation file
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0+)
- A running MongoDB instance:
  - Local MongoDB (`mongodb://localhost:27017/moodlamp`) OR
  - [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster connection string

### 2. Navigate to Directory & Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory by copying `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and configure your parameters:

```ini
PORT=3000
MONGODB_URI=mongodb://localhost:27017/moodlamp
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/moodlamp?retryWrites=true&w=majority
```

---

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Upon success, you will see:
```
Connected to MongoDB
Mood backend listening on port 3000
```

---

## 🌱 Database Seeding

To populate MongoDB with a rich set of predefined moods (Golden, Rainy, Focus, Night Light, Forest, Ocean, Galaxy):

```bash
npm run seed
```

This executes `seed.js`, which uses upsert logic (`findOneAndUpdate` with `upsert: true`) so running it multiple times safely synchronizes defaults without creating duplicate names.

---

## 📊 Data Model (`models/mood.js`)

Each mood document consists of:

```json
{
  "_id": "64e0a1b2c3d4e5f6a7b8c9d0",
  "name": "✨ Golden",
  "singleColor": {
    "r": 255,
    "g": 215,
    "b": 0
  },
  "multiColors": [
    { "r": 255, "g": 215, "b": 0 },
    { "r": 255, "g": 240, "b": 120 },
    { "r": 255, "g": 190, "b": 0 },
    { "r": 255, "g": 223, "b": 34 }
  ],
  "createdAt": "2026-10-25T04:15:00.000Z",
  "updatedAt": "2026-10-25T04:15:00.000Z"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Unique display name of the mood (e.g., "✨ Golden") |
| `singleColor` | Object (`{r, g, b}`) | Yes | Solid RGB color (0-255 each) applied in Single mode |
| `multiColors` | Array of `{r, g, b}` | No (defaults to `[]`) | Sequence of RGB colors transitioned across in Multi mode |
| `timestamps` | Date | Auto | `createdAt` and `updatedAt` managed by Mongoose |

---

## 🔌 REST API Reference

All requests and responses use JSON (`Content-Type: application/json`). CORS is globally enabled.

### 1. Health Check
Checks if the backend server is running.

- **URL:** `/health`
- **Method:** `GET`
- **Response:** `200 OK`
```json
{
  "ok": true
}
```

---

### 2. List All Moods
Fetches all stored moods sorted alphabetically by name.

- **URL:** `/moods`
- **Method:** `GET`
- **Response:** `200 OK`
```json
[
  {
    "_id": "64e0a1...",
    "name": "✨ Golden",
    "singleColor": { "r": 255, "g": 215, "b": 0 },
    "multiColors": [
      { "r": 255, "g": 215, "b": 0 },
      { "r": 255, "g": 240, "b": 120 }
    ]
  }
]
```

---

### 3. Create a Mood
Creates a new mood preset.

- **URL:** `/moods`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "🌸 Sakura",
  "singleColor": { "r": 255, "g": 183, "b": 197 },
  "multiColors": [
    { "r": 255, "g": 183, "b": 197 },
    { "r": 255, "g": 105, "b": 180 },
    { "r": 219, "g": 112, "b": 147 }
  ]
}
```
- **Response:** `201 Created`
```json
{
  "_id": "64e0b5...",
  "name": "🌸 Sakura",
  "singleColor": { "r": 255, "g": 183, "b": 197 },
  "multiColors": [ ... ],
  "createdAt": "...",
  "updatedAt": "..."
}
```
- **Error Codes:**
  - `400 Bad Request`: When `name` or `singleColor` is omitted.
  - `500 Internal Server Error`: Database error or duplicate mood name.

---

### 4. Update a Mood
Updates an existing mood by MongoDB `_id`.

- **URL:** `/moods/:id`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **Request Body:** Partial or complete mood fields:
```json
{
  "name": "🌸 Sakura Bloom",
  "singleColor": { "r": 255, "g": 192, "b": 203 }
}
```
- **Response:** `200 OK` (returns updated document)
- **Error Codes:**
  - `404 Not Found`: If no mood exists with the given ID.
  - `500 Internal Server Error`: Update failed.

---

### 5. Delete a Mood
Removes a mood from the database.

- **URL:** `/moods/:id`
- **Method:** `DELETE`
- **Response:** `200 OK`
```json
{
  "ok": true
}
```
- **Error Codes:**
  - `404 Not Found`: If mood is not found.
  - `500 Internal Server Error`: Deletion failed.

---

## 🖥️ Static Admin & Client Web Applications

The backend automatically hosts static web interfaces from the `public/` directory:

1. **Admin Preset Management CMS:**
   - **URL:** `http://localhost:3000/admin.html`
   - **Features:** Visual color pickers for single color and dynamic multi-color palettes, real-time RGB preview, creation and instant deletion/editing of moods.
2. **Built-in Cafe Dashboard:**
   - **URL:** `http://localhost:3000/index.html`
   - **Features:** Quick testing interface to command the ESP32 lamp and browse stored moods.

---

## 🧪 Testing with cURL

```bash
# Health check
curl -X GET http://localhost:3000/health

# Fetch all moods
curl -X GET http://localhost:3000/moods

# Add a custom mood
curl -X POST http://localhost:3000/moods \
  -H "Content-Type: application/json" \
  -d '{
    "name": "🔥 Warm Fire",
    "singleColor": {"r": 255, "g": 69, "b": 0},
    "multiColors": [{"r": 255, "g": 69, "b": 0}, {"r": 255, "g": 140, "b": 0}, {"r": 255, "g": 215, "b": 0}]
  }'
```
