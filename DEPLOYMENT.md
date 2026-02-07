# Deployment Guide – Vercel (Frontend) + Render (Backend)

## Overview

- **Frontend** (React/Vite) → Deploy to **Vercel**
- **Backend** (FastAPI) → Deploy to **Render**

---

## Step 1: Deploy Backend to Render

1. Push your code to **GitHub** (if not already).

2. Go to [render.com](https://render.com) and sign in.

3. **New** → **Web Service**.

4. Connect your GitHub repo.

5. Configure:
   - **Name:** `solapur-traffic-backend` (or any name)
   - **Root Directory:** `backend`
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

6. **Create Web Service**.

7. After deploy, copy your backend URL, e.g.  
   `https://solapur-traffic-backend.onrender.com`

> **Note:** On Render free tier, the service may sleep after inactivity. The first request can take 30–60 seconds (cold start).

---

## Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.

2. **Add New** → **Project**.

3. Import your GitHub repo.

4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (project root)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)

5. **Environment Variables:**
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://solapur-traffic-backend.onrender.com`  
     (use your actual Render backend URL)

6. **Deploy**.

---

## Optional: Use Blueprint (render.yaml)

If you prefer the blueprint:

1. In Render: **New** → **Blueprint**.
2. Connect your repo.
3. Render will read `render.yaml` and create the backend service.
4. Adjust the service if needed, then deploy.

---

## Local Development

1. **Backend:**
   ```sh
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8001
   ```

2. **Frontend:**
   ```sh
   npm install
   npm run dev
   ```

3. Ensure `.env` contains:
   ```
   VITE_API_BASE_URL=http://localhost:8001
   ```

---

## Troubleshooting

### "Failed to fetch" / "Unable to connect to the server"

- **Frontend:** Check that `VITE_API_BASE_URL` in Vercel is the exact Render backend URL (no trailing slash).
- **Backend:** Confirm the backend is running and healthy:  
  `https://your-backend.onrender.com/health`
- **Cold start:** On free tier, the first request can take up to a minute; wait and retry.

### Photos not loading in SMC Verify

- Backend should serve photos at `/uploads/reports/`.
- On Render, uploaded files are stored on ephemeral disk and are lost on restart.
- For persistent storage, use a service like Cloudinary or a persistent disk add-on.
