# Architecture — QR Code Attendance System

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| Database | PostgreSQL (via SQLAlchemy ORM) |
| Auth | JWT (PyJWT) + bcrypt (passlib) |
| Frontend | React (Vite) |
| QR Rendering | qrcode.react |
| Backend Hosting | Render |
| Frontend Hosting | Netlify |

## High-Level Flow

1. Teacher signs up / logs in (JWT-based auth).
2. Teacher starts a session: sets classroom GPS center + radius, and either
   picks a saved form template or builds custom fields on the fly.
3. Backend generates a **rotating QR code** (new token every 30 seconds,
   HMAC-SHA256 signed) and the frontend displays/refreshes it on screen.
4. Students scan the QR with their phone → opens a public web form
   (no login required) → browser captures GPS location → student fills
   the dynamic form fields → submits.
5. Backend runs **3-layer fraud protection** before accepting the
   submission (see below).
6. Teacher can view live submissions, end the session, and export
   attendance as an Excel file.

## 3-Layer Fraud Protection

1. **Rotating QR Token (HMAC-SHA256)** — `app/utils/qr_token.py`
   Token changes every 30 seconds. A screenshot forwarded on WhatsApp
   expires almost immediately. A ~30-60s grace window is allowed
   (current + previous time window both accepted) so genuine students
   scanning right at a rotation boundary aren't wrongly rejected.

2. **Device ID Duplicate Check** — `app/routes/attendance.py`
   The frontend generates a per-browser device ID; a second submission
   from the same device for the same session is rejected.

3. **Unique Identifier (Roll Number) Duplicate Check** — `app/routes/attendance.py`
   If the session's form has a field marked `is_unique_id: true` (or
   labeled "Roll Number" / "Student ID"), a second submission with the
   same value is rejected. If no such field exists, this layer is
   skipped (device check alone still applies) rather than guessing.

4. **Geofencing (Haversine formula)** — `app/utils/geofence.py`
   Student's submitted GPS coordinates must fall within the teacher's
   configured radius (meters) of the classroom center point. Uses the
   Haversine great-circle formula rather than flat Euclidean distance,
   since GPS coordinates lie on a sphere.

## Backend Folder Structure

```
backend/
├── app/
│   ├── core/
│   │   └── database.py        # SQLAlchemy engine, session, Base, get_db dependency
│   ├── models/
│   │   └── db_models.py       # SQLAlchemy ORM tables: Teacher, FormTemplate, Session, AttendanceRecord
│   ├── schemas/
│   │   ├── auth.py            # Pydantic request/response models for auth
│   │   ├── attendance.py      # Pydantic request/response models for attendance submission
│   │   ├── session.py         # Pydantic request/response models for sessions
│   │   └── template.py        # Pydantic request/response models for form templates
│   ├── routes/
│   │   ├── auth.py            # /signup, /login, /protected-test + get_current_user dependency
│   │   ├── attendance.py      # /attendance/submit (public, 3-layer fraud check)
│   │   ├── session.py         # /session/* (start, end, export-excel, current-token, public-form)
│   │   └── template.py        # /templates (CRUD for saved form templates)
│   ├── utils/
│   │   ├── security.py        # password hashing + JWT create/decode
│   │   ├── qr_token.py        # rotating HMAC QR token generate/verify
│   │   ├── geofence.py        # Haversine distance + geofence check
│   │   └── excel_export.py    # attendance records → downloadable .xlsx
│   └── main.py                # FastAPI app, CORS, router registration
├── reset_db.py                 # dev utility: wipes all table data
├── requirements.txt
└── .env / .env.example
```

## Frontend Folder Structure

```
frontend/
├── src/
│   ├── App.jsx        # All views: teacher auth, dashboard, student scan form
│   ├── main.jsx        # React root entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
└── package.json
```

*(Note: `App.jsx` currently holds all views in one file. Splitting it
into `components/` — e.g. `LoginForm`, `TeacherDashboard`,
`StudentScanForm`, `TemplateBuilder` — is a reasonable next step once
more people are contributing, to reduce merge conflicts.)*

## Environment Variables (Backend)

See `.env.example` for the full list. Never commit `.env` — it holds
real secrets (`DATABASE_URL`, `SECRET_KEY`).

## Deployment

- **Backend (Render):** Root dir `backend/`, build `pip install -r requirements.txt`,
  start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- **Frontend (Netlify):** Base dir `frontend/`, build `npm run build`,
  publish dir `frontend/dist`, env var `VITE_API_BASE_URL` pointing at
  the Render backend URL.
