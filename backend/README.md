# Solapur Traffic Reports API (FastAPI + PostgreSQL)

## Setup

1. **Python 3.10+** and **PostgreSQL** required.

2. **Create database:**
   ```bash
   createdb solapur_traffic
   ```

3. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env: set DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, CLOUDINARY_*, CORS_ORIGINS
   ```

5. **Run:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Tables are created on startup. API: http://localhost:8000  
   Docs: http://localhost:8000/docs

## Environment

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL URL, e.g. `postgresql://user:pass@localhost:5432/solapur_traffic` |
| ADMIN_USERNAME | Admin login username |
| ADMIN_PASSWORD | Admin login password |
| CLOUDINARY_* | Cloud name, API key, API secret for photo uploads |
| CORS_ORIGINS | Comma-separated frontend URLs |

## API

- `POST /api/reports` – create report (form: issue_type, phone_number, description, image_url, latitude, longitude, location_text)
- `POST /api/reports/upload-image` – upload image file
- `POST /api/reports/upload-image-base64` – upload image from data URL
- `GET /api/reports/search?report_id=...` or `?phone=...` – citizen search
- `GET /api/admin/reports` – list reports (Basic auth)
- `PATCH /api/admin/reports/{report_id}/status` – update status (Basic auth)

## Deploy (e.g. Railway / Render)

1. Add PostgreSQL add-on and set `DATABASE_URL`.
2. Set other env vars.
3. Build command: (none; run uvicorn)
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
