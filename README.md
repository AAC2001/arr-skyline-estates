# ARR Skyline Estates — Real Estate Platform

Premium real estate and construction services website for **ARR Skyline Estates**, Hyderabad, Telangana.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Django + Django REST Framework + JWT auth
- **Database:** PostgreSQL (production) / SQLite (local default via `USE_SQLITE=True`)
- **Media:** Local filesystem or Cloudinary (optional)

## Project structure

```
arr-skyline-estates/
├── frontend/          # Public website + admin dashboard UI
├── backend/           # REST API
└── docker-compose.yml # PostgreSQL for local/production-style DB
```

## Local development

### 1. Backend API

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
copy .env.example .env
.\.venv\Scripts\python manage.py migrate
$env:DJANGO_ADMIN_PASSWORD="YourStrongPassword"
.\.venv\Scripts\python manage.py seed_demo
.\.venv\Scripts\python manage.py runserver
```

API: `http://127.0.0.1:8000/api/`  
Django admin: `http://127.0.0.1:8000/admin/` (user `admin` if created via `seed_demo` + `DJANGO_ADMIN_PASSWORD`)

### 2. Frontend

```powershell
cd frontend
copy .env.local.example .env.local
npm install --legacy-peer-deps
npm run dev
```

Site: `http://localhost:3000`  
Staff dashboard: `http://localhost:3000/dashboard/login`

### 3. PostgreSQL (optional)

```powershell
docker compose up -d
```

Set in `backend/.env`:

```
USE_SQLITE=False
DB_NAME=arr_skyline
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

Then run `migrate` again.

## Admin dashboard features

- Overview metrics (properties, enquiries)
- Property CRUD, featured flag, sold status, image uploads
- Enquiry tracking with status and internal notes
- Homepage / contact CMS fields

JWT authentication uses Django staff users — **never commit passwords or secrets**.

## Deployment (overview)

1. **Backend:** Deploy Django (e.g. Railway, Render, AWS) with PostgreSQL, set `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, Cloudinary vars if used, run `collectstatic` + migrations.
2. **Frontend:** Deploy Next.js (Vercel recommended), set `NEXT_PUBLIC_API_URL` to your API base.
3. Create a production superuser: `python manage.py createsuperuser`
4. Replace demo listings and placeholder testimonials with verified content via the dashboard.

## Demo data

Seed data is explicitly marked `is_demo` on properties and testimonials. Update contact phone/WhatsApp/email in the admin **Content & Contact** screen or Django admin before go-live.
