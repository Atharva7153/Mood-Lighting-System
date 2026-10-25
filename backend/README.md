# Mood Lamp Backend

Simple Express + MongoDB backend to store mood presets.

Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Start MongoDB locally or provide `MONGODB_URI` in a `.env` file (copy `.env.example`).

3. Run:

```bash
npm start
```

API

- `GET /moods` — list moods
- `POST /moods` — create mood `{ name, singleColor: {r,g,b}, multiColors: [{r,g,b}, ...] }`
- `PUT /moods/:id` — update
- `DELETE /moods/:id` — delete
