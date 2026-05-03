# BytesDoc Backend

Express + Supabase API for BytesDoc.

## Setup

1. Install deps:

```
cd backend
npm install
```

2. Copy `.env.example` to `.env` and fill in the Supabase keys (get them from the Supabase project settings → API):

```
PORT=4000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...
CORS_ORIGIN=http://localhost:3000
```

3. Run dev server:

```
npm run dev
```

Server runs on `http://localhost:4000`. Test it:

```
curl http://localhost:4000/api/health
```

Should return `{"ok":true,"service":"bytesdoc-backend"}`.

## Database setup (Supabase)

In the Supabase SQL editor, run:

```sql
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('chief_minister','secretary','finance_minister','member')),
  created_at timestamptz default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Proposals','Permits','Budgets','Reports','Financial Records')),
  event text not null,
  administration text not null,
  uploaded_by uuid not null references public.users(id),
  upload_date timestamptz default now(),
  file_path text not null,
  is_archived boolean default false,
  is_locked boolean default false,
  file_type text not null check (file_type in ('pdf','docx'))
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  action text not null check (action in ('upload','download','view','archive','login')),
  document_id uuid references public.documents(id),
  timestamp timestamptz default now()
);
```

Then create a private Storage bucket called `documents` (Storage → New bucket → uncheck Public).

## Auth model

Frontend signs in with Supabase Auth and gets a JWT. Frontend sends `Authorization: Bearer <jwt>` to this API. The `requireAuth` middleware verifies the JWT with Supabase and looks up the user's role from the `users` table.

## Folder structure

```
backend/
├── src/
│   ├── index.ts             # entry point
│   ├── config/supabase.ts   # supabase client (service role)
│   ├── middleware/
│   │   ├── auth.ts          # requireAuth, requireRole
│   │   └── error.ts         # central error handler
│   ├── routes/
│   │   └── health.ts        # GET /api/health
│   └── types/index.ts       # shared types (mirrors frontend)
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Endpoints (planned)

- `POST /api/auth/login`
- `GET|POST|PUT|DELETE /api/documents`
- `GET /api/documents/:id/download`
- `POST /api/documents/:id/archive`
- `GET|POST /api/users`
- `PUT /api/users/:id/role`
- `GET|POST /api/activity-logs`
- `GET /api/activity-logs/export`

These will be added in follow-up branches: `feature/backend-auth`, `feature/backend-documents`, etc.
