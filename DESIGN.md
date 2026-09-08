# Design Notes — QR Code Attendance System

## Naming Conventions

- **Python files/folders:** `snake_case` (e.g. `qr_token.py`, `db_models.py`).
- **React components/files:** `PascalCase` for component files if/when
  `App.jsx` is split (e.g. `TeacherDashboard.jsx`).
- **DB tables:** plural snake_case (`teachers`, `sessions`, `form_templates`,
  `attendance_records`).
- **API routes:** plural nouns, kebab/lowercase (`/session/{id}/export-excel`,
  `/templates`).
- One SQLAlchemy model file (`models/db_models.py`) holds all ORM tables —
  keep it that way unless it grows past ~5-6 tables, then split by domain.
- Pydantic request/response schemas live in `schemas/`, separate from ORM
  models in `models/` — never mix the two in one file.

## Database Schema (summary)

| Table | Key Columns | Notes |
|---|---|---|
| `teachers` | id, username, email, hashed_password | 1 teacher → many sessions & templates |
| `form_templates` | id, teacher_id, template_name, fields (JSON) | Reusable field configs |
| `sessions` | id, teacher_id, class_id, center_lat/long, radius_meters, form_fields (JSON snapshot), is_active | `form_fields` is copied from the template at session-start time so past sessions don't change if a template is edited later |
| `attendance_records` | id, session_id, unique_identifier, responses (JSON), device_id, lat, long, status | `status`: PRESENT / OUT_OF_BOUNDS / DUPLICATE_DEVICE / DUPLICATE_ROLL |

## API Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/signup` | — | Register teacher |
| POST | `/login` | — | Get JWT token |
| GET | `/protected-test` | JWT | Sanity check for auth |
| POST | `/templates` | JWT | Save a reusable form template |
| GET | `/templates` | JWT | List teacher's templates |
| DELETE | `/templates/{id}` | JWT | Delete a template |
| POST | `/session/start` | JWT | Start a new session (deactivates any previous active one) |
| GET | `/session/my-sessions` | JWT | List teacher's sessions |
| POST | `/session/{id}/end` | JWT | End a session |
| GET | `/session/{id}/export-excel` | JWT | Download attendance as .xlsx |
| GET | `/session/{id}/current-token` | JWT | Get the current rotating QR token (frontend polls this) |
| GET | `/session/{id}/public-form` | — | Public: fetch form fields for the scan page |
| POST | `/attendance/submit` | — | Public: student submits attendance (3-layer check) |

## Working With a Collaborator (Git workflow suggestion)

- **Branch per feature:** don't push directly to `main`. e.g.
  `git checkout -b feature/split-app-jsx`.
- **Never commit `.env`** — it's already gitignored; each dev keeps their
  own local `.env` copied from `.env.example`.
- **Backend changes:** if you add a new domain (e.g. "notifications"),
  follow the existing pattern — one file in each of `models/`, `schemas/`,
  `routes/`, `utils/` (only the ones you actually need).
- **Before pushing:** test locally with `uvicorn app.main:app --reload`
  and the `/docs` Swagger UI, so broken imports are caught before Render
  redeploys.
- **Frontend:** until `App.jsx` is split into components, coordinate who's
  editing it at the same time to avoid merge conflicts — it's the one file
  most likely to collide.

## Known Follow-ups (not urgent)

- `frontend/src/App.jsx` is a single ~32KB file covering teacher auth,
  dashboard, and the student scan form. Worth splitting into
  `components/` once two people are actively working on the frontend.
- CORS in `app/main.py` is currently `allow_origins=["*"]` — fine for
  now, but tightening it to the exact Netlify domain is a good hardening
  step before this goes to real students at scale.
