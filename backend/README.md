# BytesDoc Backend (FastAPI)

JSON REST API consumed by the Next.js frontend in `../frontend`.

## Stack

- Python 3.13
- FastAPI + Uvicorn (ASGI)
- SQLAlchemy 2.0 (sync) + PyMySQL driver against MySQL 8.0
- Pydantic v2 for request/response validation
- passlib (bcrypt) for password hashing — used in Slice 2
- python-jose for JWT — used in Slice 2

## Project layout

```
backend/
├── app/
│   ├── main.py            FastAPI app, CORS, /api/health
│   ├── config.py          .env loader (DATABASE_URL, JWT_SECRET, ...)
│   ├── database.py        SQLAlchemy engine + get_db dependency
│   ├── models.py          ORM classes for the 7 bytesdoc tables
│   ├── schemas.py         Pydantic response shapes
│   └── routers/
│       └── lookups.py     /api/categories /api/events /api/administrations
├── .env                   real values (gitignored)
├── .env.example           template
├── requirements.txt
└── README.md
```

## First-time setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If `Activate.ps1` is blocked by execution policy:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Run the dev server

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Then:

- API root: http://localhost:8000
- Auto-generated docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health  →  `{"status":"ok","db":"ok"}`
- Lookups: http://localhost:8000/api/categories

## Roadmap

| Slice | Status | What it adds |
|------:|--------|--------------|
| 1 | DONE | Skeleton, DB connection, lookups |
| 2 | TODO | `/api/auth/login` (JWT), `/api/auth/me`, password hashing |
| 3 | TODO | `require_role()` RBAC dependency |
| 4 | TODO | Documents CRUD with role-based filtering |
| 5 | TODO | Archive/lock mechanism, bulk archive by administration |
| 6 | TODO | Activity logs (list, filter, CSV export, auto-logging) |
| 7 | TODO | Users (list, invite, change role) |
