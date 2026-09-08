# RollQR — Professional UX Wireframe & User-Flow Specification

> **Repository:** `Arjunpurwar2005/qr-code-generator`  
> **Branch:** `feature/flow`  
> **Target Audience:** Engineering Team, Product Managers, UI/UX Designers, College Administration  
> **Version:** 2.0.0 (Production-Ready Architecture)  

---

## Executive Summary & System Overview

**RollQR** is a high-security, location-verified classroom attendance platform built for higher education institutions (such as KCC Institute of Technology & Management - KCCITM). The system eliminates manual roll calls and proxy attendance by combining **rotating dynamic QR tokens** (refreshing every 18-20 seconds) with **GPS geofence radius verification** and **device-based hardware binding**.

### Key System Architecture Capabilities:
1. **Teacher Control Center:** Start/end live attendance sessions, select custom attendance form presets, capture real-time instructor GPS coordinates, monitor live scan stats, and export attendance rosters instantly to Excel (`.xlsx`).
2. **Student Attendance Interface:** Zero-app, browser-native mobile workflow. Students scan the live dynamic classroom QR code, allow GPS location capture, fill required template fields (Roll Number, Full Name, Section), and submit attendance.
3. **Dynamic Form Builder & Templates:** Teachers create reusable form presets with custom validation rules (Text, Number, Dropdown, Unique Roll Number identifiers).
4. **Institutional Security Layer:** Institution Admin Portal (`admin.html`) configures campus geographic centroids and geofence radii mapped to official college email domains (`@kccitm.edu.in`).

---

## 1. Information Architecture & Sitemap

### 1.1 Structural Area Classification

| Area | Accessibility | Key Components & Purpose |
| :--- | :--- | :--- |
| **Public Portal** | Anyone | Landing Page (`/` - Marketing, Features, How-it-Works, FAQ) |
| **Authentication** | Unauthenticated Teachers | Login / Signup (`/login` - Username/Password & Google OAuth 2.0) |
| **Faculty Portal** | Authenticated Teachers (JWT) | Dashboard (`/dashboard`), Live QR (`/live`), Templates (`/templates`) |
| **Student Scanner** | Anyone with Scan Link | Attendance Form (`/scan` or `/?session_id=X&qr_token=Y`) |
| **Admin Portal** | System Administrators | Institution Geofence Management (`/admin.html` with `X-Admin-Secret`) |

---

### 1.2 Sitemap Diagram (Visual Flow)

```mermaid
flowchart TD
    A[Public Landing Page /] -->|Click Login / Signup| B[Auth Portal /login]
    A -->|Direct URL or Mobile Scan| C[Student Scanner /scan]
    
    B -->|Submit Credentials / Google SSO| D{JWT Auth Success?}
    D -->|Yes| E[Teacher Dashboard /dashboard]
    D -->|No| B
    
    E -->|Click + Start Attendance| F[Start Attendance Modal]
    F -->|Capture GPS & Select Template| G[Live QR Control Room /live]
    G -->|QR Refreshes Every 18s| G
    G -->|Click End Attendance| H[End Session Modal / Summary]
    H -->|Click Download Excel| I[Download .xlsx Roster]
    H -->|Return| E
    
    E -->|Click Templates Nav| J[Template Builder /templates]
    J -->|Create / Edit Fields| K[Live Student Form Preview]
    K -->|Save Template| J
    
    C -->|URL: ?session_id=X&qr_token=Y| L[Fetch Public Form API]
    L -->|Allow GPS Location| M[GPS Radius Check]
    M -->|Fill Fields & Submit| N{Attendance Valid?}
    N -->|Yes| O[Success Confirmation Screen]
    N -->|No / Out of Range / Expired QR| P[Error Alert Screen]

    subgraph Admin Area
        Q[Admin Portal admin.html] -->|Authenticate X-Admin-Secret| R[Manage Institutions & Campus Centroids]
    end
```

---

### 1.3 Access Control & Route Protection Matrix

| Route Path | Component / File | Access Requirement | Redirect on Unauthorized |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage.jsx` | Public | None |
| `/login` | `LoginSignup.jsx` | Unauthenticated | Redirects to `/dashboard` if token present |
| `/dashboard` | `TeacherDashboard.jsx` | Teacher JWT Token | Redirects to `/login` |
| `/live` | `LiveQRSession.jsx` | Teacher JWT + Active Session | Redirects to `/login` |
| `/templates` | `TemplateBuilder.jsx` | Teacher JWT Token | Redirects to `/login` |
| `/scan` | `StudentAttendanceForm.jsx` | Public (`session_id` query param) | Shows "Form Not Found" if invalid |
| `/admin.html` | `admin.html` | `X-Admin-Secret` Header | Displays Connection Setup Card |

---

## 2. Professional Low-to-Mid Fidelity Wireframes

### Screen 1: Landing Page (`/` — `HomePage.jsx`)

#### Desktop View Layout
```
+-----------------------------------------------------------------------------------+
| [RQ] RollQR    Home   How it Works v   Features v   For Teachers   For Students   | [ Login ] [ Start Attendance -> ] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  Eliminate Proxy Attendance.                 +-----------------------------------+  |
|  Instant Classroom QR Roll Call.            | LIVE ATTENDANCE - KCCITM           |  |
|                                             | CSE — 3rd Year         [ 42 Present]|  |
|  Take attendance in 10 seconds with dynamic | +-------------------------------+ |  |
|  rotating QR codes & GPS verification.      | | [#####  QR CODE RETICLE #####] | |  |
|                                             | | [#####  SCAN TO MARK    #####] | |  |
|  [ Start Attendance -> ] [ See Demo Video ] | +-------------------------------+ |  |
|                                             | Progress: 42/62 [==============  ] |  |
|  * Location Verified  * Zero App Download   +-----------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  BUILT FOR CLASSROOMS AT: [KCCITM]  ·  KCC Institute of Technology & Management   |
+-----------------------------------------------------------------------------------+
|  FEATURES AT A GLANCE                                                             |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  | (QR) Dynamic QR    |  | (GPS) Geofencing   |  | (Excel) One-Click Export    |  |
|  | Refreshes constantly|  | Classroom radius   |  | Clean .xlsx reports ready   |  |
|  +--------------------+  +--------------------+  +-----------------------------+  |
+-----------------------------------------------------------------------------------+
```

#### Mobile Layout (`HomePage.jsx`)
```
+-----------------------------+
| [RQ] RollQR             [=] |
+-----------------------------+
| Live Classroom Attendance   |
|                             |
| Take attendance in seconds. |
| No app download required.   |
|                             |
| [ Start Attendance -> ]     |
| [ Login ]                   |
|                             |
| +-------------------------+ |
| | LIVE SESSION: KCCITM    | |
| | 42 Students Present     | |
| | [ QR CODE PREVIEW ]     | |
| +-------------------------+ |
+-----------------------------+
```

---

### Screen 2: Teacher Auth Portal (`/login` — `LoginSignup.jsx`)

#### Desktop Split View
```
+------------------------------------------+----------------------------------------+
| [RQ] RollQR                              | Teacher Login                          |
|                                          | Welcome back. Enter your credentials.  |
| Welcome back.                            |                                        |
| Your attendance dashboard is a scan away.| [ G  Sign in with Google             ] |
|                                          | ----------------- OR ----------------- |
| +--------------------------------------+ |                                        |
| | LIVE SESSION: KCCITM CSE 3rd Year   | | USERNAME *                             |
| | 42 Present                            | | [ prof_sharma                      ] |
| | [ QR Code Visual ]                   | |                                        |
| +--------------------------------------+ | PASSWORD *                             |
|                                          | [ **********                   (o) ] |
| * Generate QR in 1 click                 |                                        |
| * GPS-verified attendance                | [ Login ->                           ] |
| * Instant Excel download                 |                                        |
|                                          | Don't have an account? [Create account]|
+------------------------------------------+----------------------------------------+
```

---

### Screen 3: Teacher Command Dashboard (`/dashboard` — `TeacherDashboard.jsx`)

#### Dashboard Layout with Active Session & History
```
+-----------------------------------------------------------------------------------+
| [RQ] RollQR    Dashboard   Sessions (Live)   Templates          [ Prof. Sharma (S)]|
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  FACULTY OPERATIONAL COMMAND                                                      |
|  Good morning, Prof. Sharma 👋                                                    |
|  Manage classroom attendance in seconds. Select a template or start an instant QR. |
|                                                    [ + Start Attendance ]         |
+-----------------------------------------------------------------------------------+
|  ACTIVE ATTENDANCE SESSION                                                        |
|  +------------------------------------------------------------------------------+  |
|  | (• LIVE ATTENDANCE)  Session #104                                            |  |
|  | CS301 Data Structures & Algorithms                                           |  |
|  | Geofence Radius: 30m  •  Preset: CSE Standard Roster                          |  |
|  |                                      [ End Attendance ]  [ Open Live QR -> ] |  |
|  +------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
|  QUICK ACTIONS                                                                    |
|  +-----------------------+  +-----------------------+  +-----------------------+  |
|  | (Play)                |  | (Plus)                |  | (History)             |  |
|  | Start Attendance      |  | Create Template       |  | View History          |  |
|  | Rolling QR + Geofence |  | Custom form presets   |  | Export past sessions  |  |
|  +-----------------------+  +-----------------------+  +-----------------------+  |
+-----------------------------------------------------------------------------------+
|  RECENT ATTENDANCE ACTIVITY                                   [ Search sessions ]  |
|  +------------------------------------------------------------------------------+  |
|  | (Table) CS301 Data Structures  •  Session #104  [LIVE]    [ Download Excel ] |  |
|  | (Table) CS302 Database System   •  Session #101  [ENDED]   [ Download Excel ] |  |
|  | (Table) CS305 Computer Networks •  Session #98   [ENDED]   [ Download Excel ] |  |
|  +------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

### Screen 4: Start Attendance Setup Modal

```
+-------------------------------------------------------------------------+
| (QR) Start Attendance                                              [X]  |
| Set up your class and generate a QR code.                               |
+-------------------------------------------------------------------------+
|                                                                         |
| CLASS / SUBJECT NAME *                                                  |
| [ CS301 Data Structures & Algorithms                                  ] |
|                                                                         |
| ATTENDANCE FORM PRESET                                                  |
| [ Standard Default Form (Roll Number, Student Name)                 v ] |
|                                                                         |
| GEOFENCE BOUNDARY RADIUS (METERS)                                       |
| [ 30 ]  Allowed student radius from instructor GPS center               |
|                                                                         |
| [ (📍) GPS Verified (28.6139, 77.2090)                                ] |
|                                                                         |
+-------------------------------------------------------------------------+
|                                  [ Cancel ]  [ Start Session & Open Live QR ]
+-------------------------------------------------------------------------+
```

---

### Screen 5: Live QR Control Room (`/live` — `LiveQRSession.jsx`)

#### Control Room Dark-Mode UI
```
+-----------------------------------------------------------------------------------+
| [RQ] RollQR   (• LIVE ATTENDANCE CONTROL)            [ Download Excel ] [ Dashboard ]|
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                    (• ATTENDANCE LIVE)                                            |
|                    CS301 Data Structures & Algorithms                             |
|                    Students can scan the QR code below using their phone.          |
|                                                                                   |
|                 +---------------------------------------+                         |
|                 |  +---------------------------------+  |                         |
|                 |  |                                 |  |                         |
|                 |  |      [ DYNAMIC QR CODE ]        |  |                         |
|                 |  |    (Refreshes automatically)    |  |                         |
|                 |  |                                 |  |                         |
|                 |  +---------------------------------+  |                         |
|                 |  Scan to mark attendance              |                         |
|                 |  (~) QR refreshes in 14s              |                         |
|                 +---------------------------------------+                         |
|                                                                                   |
|  +----------------------+  +----------------------+  +-------------------------+  |
|  | 1. SCAN              |  | 2. VERIFY            |  | 3. RECORDED             |  |
|  | Student scans QR     |  | GPS & Token checked  |  | Added to class roster   |  |
|  +----------------------+  +----------------------+  +-------------------------+  |
|                                                                                   |
|                 [ End Attendance ]    [ Download Excel ]                          |
+-----------------------------------------------------------------------------------+
```

---

### Screen 6: End Session Confirmation Modal

```
+-------------------------------------------------------------------------+
| (!) End Attendance Session?                                             |
| Students will no longer be able to scan or submit.                      |
+-------------------------------------------------------------------------+
|                                                                         |
| Class: CS301 Data Structures & Algorithms                               |
| Status: Active Rolling QR                                               |
|                                                                         |
+-------------------------------------------------------------------------+
|                                          [ Cancel ]  [ End Attendance Now ]
+-------------------------------------------------------------------------+
```

---

### Screen 7: Attendance Completed State (`LiveQRSession.jsx`)

```
+-----------------------------------------------------------------------------------+
| [RQ] RollQR   (Session Ended)                        [ Download Excel ] [ Dashboard ]|
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                         +-------------------------------+                         |
|                         |              [✓]              |                         |
|                         |     Attendance Completed      |                         |
|                         | Session ended. Tokens locked. |                         |
|                         |                               |                         |
|                         | ROSTER TOTAL                  |                         |
|                         | 48 Students Present           |                         |
|                         |                               |                         |
|                         | [ Download Excel Report ]     |                         |
|                         | [ Back to Dashboard ]         |                         |
|                         +-------------------------------+                         |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

### Screen 8: Template Builder (`/templates` — `TemplateBuilder.jsx`)

#### Builder View with Live Interactive Mobile Preview
```
+-----------------------------------------------------------------------------------+
| [RQ] RollQR    Dashboard   Sessions   Templates           [ <-- Back to Dashboard ]|
+-----------------------------------------------------------------------------------+
|                                                                                   |
| Attendance Templates                                      [ + Create Template ]   |
| Create reusable forms for your classes.                                           |
+-----------------------------------------------------------------------------------+
| CREATE TEMPLATE                                                                   |
| +-----------------------------------------------+ +-----------------------------+ |
| | TEMPLATE NAME *                               | | (• LIVE STUDENT PREVIEW)    | |
| | [ CS301 Daily Attendance                    ] | |                             | |
| |                                               | | +-------------------------+ | |
| | ATTENDANCE FIELDS               [ + Add Field ] | | | Mark Attendance         | | |
| | +-------------------------------------------+ | | | CS301 Daily Attendance  | | |
| | | Field #1                                  | | | |                           | | |
| | | [ Roll Number    ] [ Text               v ] | | | Roll Number *             | | |
| | | [x] Required  [x] Unique Roll Number      | | | | [ Enter Roll Number     ] | | |
| | +-------------------------------------------+ | | |                           | | |
| | | Field #2                      [ Remove ]  | | | Student Name *            | | |
| | | [ Student Name   ] [ Text               v ] | | | [ Enter Student Name    ] | | |
| | | [x] Required  [ ] Unique Roll Number      | | | |                           | | |
| | +-------------------------------------------+ | | | [ Mark Attendance ]     | | |
| |                                               | | +-------------------------+ | |
| | [ Cancel ]           [ Save Template ]        | | Interactive Student View    | |
| +-----------------------------------------------+ +-----------------------------+ |
+-----------------------------------------------------------------------------------+
| SAVED TEMPLATES                                                                   |
| +--------------------------+  +--------------------------+                        |
| | (Doc) CS301 Daily Preset |  | (Doc) AI/ML Lab Template |                        |
| | 2 fields configured      |  | 3 fields configured      |                        |
| | [Roll Number*] [Name*]   |  | [Roll Number*] [Batch]   |                        |
| | [ Use Template -> ]      |  | [ Use Template -> ]      |                        |
| +--------------------------+  +--------------------------+                        |
+-----------------------------------------------------------------------------------+
```

---

### Screen 9: Student Attendance Form (`/scan` — `StudentAttendanceForm.jsx`)

#### Mobile Scan Screen
```
+-----------------------------+
| [RQ] RollQR  [Student Scan] |
+-----------------------------+
| Mark Attendance             |
| CS301 Data Structures       |
| Enter your details.         |
+-----------------------------+
|                             |
| [📍 Allow & Grab My Location]|
|  GPS Verified (28.61, 77.20)|
|                             |
| STUDENT NAME *              |
| [ Aarav Sharma            ] |
|                             |
| ROLL NUMBER *               |
| [ 2024001                 ] |
|                             |
| SECTION                     |
| [ Section A               v ]
|                             |
| [ (✓) Mark Attendance     ] |
|                             |
+-----------------------------+
```

---

### Screen 10: Student Success Confirmation Screen

```
+-----------------------------+
|                             |
|            [ ✓ ]            |
|     Attendance Marked!      |
|  Recorded successfully.     |
|                             |
|  CONFIRMATION DETAILS       |
|  Status: PRESENT            |
|  Record ID: #1842           |
|                             |
| Powered by RollQR           |
+-----------------------------+
```

---

### Screen 11: Institution Admin Portal (`admin.html`)

```
+-----------------------------------------------------------------------------------+
| [RQ] RollQR                                                  [ Admin Portal ]     |
+-----------------------------------------------------------------------------------+
| Institution Management                                                            |
| Set college campus location & geofence boundary for secure attendance             |
|                                                                                   |
| +-------------------------------------------------------------------------------+ |
| | (Key) Admin API Credentials                                                   | |
| | Backend URL: [ https://your-backend.onrender.com                            ] | |
| | Secret Key:  [ ********************                                         ] | |
| | [ Link Connect to Backend ]                                                   | |
| +-------------------------------------------------------------------------------+ |
|                                                                                   |
| +-------------------------------------------------------------------------------+ |
| | (Location) Add / Update Institution                                           | |
| | Email Domain: [ kccitm.edu.in ]   College Name: [ KCC Institute of Tech     ] | |
| | Latitude:     [ 28.465000     ]   Longitude:    [ 77.502000                 ] | |
| | Radius (m):   [ 200           ]                                               | |
| | [ My Location ] [ Save Institution ]                                          | |
| +-------------------------------------------------------------------------------+ |
|                                                                                   |
| +-------------------------------------------------------------------------------+ |
| | (Apartment) Registered Institutions                            [ Refresh ]    | |
| | DOMAIN         COLLEGE NAME       CAMPUS LAT, LONG       RADIUS     ACTION    | |
| | kccitm.edu.in  KCCITM Campus      28.46500, 77.50200     200m       [Delete]  | |
| +-------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

---

## 3. Detailed Step-by-Step User Flows

### Flow 1: Teacher Authentication & Google OAuth
```mermaid
sequenceDiagram
    autonumber
    actor Teacher
    participant FE as React Frontend (LoginSignup.jsx)
    participant GIS as Google Identity SDK
    participant BE as FastAPI Backend (auth.py)
    participant DB as SQLite / PostgreSQL DB

    Teacher->>FE: Navigate to /login
    alt Standard Login
        Teacher->>FE: Input Username & Password -> Click "Login"
        FE->>BE: POST /login {username, password}
        BE->>DB: Query User record & verify bcrypt hash
        DB-->>BE: User valid
        BE-->>FE: Return {access_token, token_type: "bearer"}
    else Google OAuth Sign-In
        FE->>GIS: Render Google Sign-In Button
        Teacher->>GIS: Click Google Sign-In & Select Google Account
        GIS-->>FE: Return Google ID Token (credential)
        FE->>BE: POST /auth/google {id_token}
        BE->>BE: Verify token with Google API / token info
        BE->>DB: Get or auto-create User record
        BE-->>FE: Return {access_token, token_type: "bearer"}
    end
    FE->>FE: Store token in localStorage ('teacher_token')
    FE->>FE: Navigate to /dashboard
```

---

### Flow 2: Custom Template Creation & Management
```mermaid
sequenceDiagram
    autonumber
    actor Teacher
    participant FE as TemplateBuilder.jsx
    participant BE as template.py
    participant DB as Database

    Teacher->>FE: Click "Templates" in nav -> Navigate to /templates
    Teacher->>FE: Click "+ Create Template"
    Teacher->>FE: Input Template Name (e.g. "CS301 Daily")
    Teacher->>FE: Add / Customize Fields (Label, Type, Required, Unique Roll No)
    FE->>FE: Update Live Student Form Preview in real-time
    Teacher->>FE: Click "Save Template"
    FE->>BE: POST /templates (Bearer Token, Header)
    BE->>DB: Insert Template & TemplateField records
    DB-->>BE: Saved
    BE-->>FE: Return Template JSON
    FE->>FE: Refresh Template List Grid
```

---

### Flow 3: Live Session Initiation & GPS Geofence Setup
```mermaid
sequenceDiagram
    autonumber
    actor Teacher
    participant FE as TeacherDashboard.jsx
    participant GPS as Phone Browser Geolocation
    participant BE as session.py
    participant DB as Database

    Teacher->>FE: Click "+ Start Attendance"
    FE->>FE: Open Start Attendance Modal
    Teacher->>FE: Input Class/Subject ID (e.g., "CS301")
    Teacher->>FE: Select Template Preset & Radius (e.g., 30 meters)
    Teacher->>FE: Click "📍 Capture GPS Center Location"
    FE->>GPS: navigator.geolocation.getCurrentPosition()
    GPS-->>FE: Return {lat: 28.6139, long: 77.2090}
    Teacher->>FE: Click "Start Session & Open Live QR"
    FE->>BE: POST /session/start {class_id, center_lat, center_long, radius_meters, template_id}
    BE->>DB: Create Session record (is_active = True)
    BE->>BE: Generate initial 18-second rolling QR Token
    BE-->>FE: Return Session & initial Token object
    FE->>FE: Set activeSession state -> Navigate to /live
```

---

### Flow 4: Student QR Scanning & Attendance Submission
```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Cam as Mobile Camera
    participant FE as StudentAttendanceForm.jsx
    participant GPS as Student GPS
    participant BE as attendance.py
    participant DB as Database

    Student->>Cam: Scan Live QR Code on Classroom Display
    Cam->>FE: Open URL: /?session_id=104&qr_token=xyz123
    FE->>BE: GET /session/104/public-form
    BE-->>FE: Return form fields, class_id, is_active status
    Student->>FE: Click "📍 Allow & Grab My Location"
    FE->>GPS: navigator.geolocation.getCurrentPosition()
    GPS-->>FE: Return student {lat, long}
    Student->>FE: Fill required fields (Roll Number, Full Name, Section)
    Student->>FE: Click "Mark Attendance"
    FE->>BE: POST /attendance/submit {session_id, qr_token, lat, long, device_id, responses}
    
    BE->>BE: 1. Verify session is active
    BE->>BE: 2. Verify qr_token is valid & not expired
    BE->>BE: 3. Verify student GPS is within session radius_meters
    BE->>BE: 4. Check for duplicate roll number in session
    
    alt Verification Successful
        BE->>DB: Insert AttendanceLog record
        BE-->>FE: Return {status: "PRESENT", record_id: 1842}
        FE->>FE: Render Attendance Marked Success Screen
    else Verification Failed (e.g. Out of Range / Expired QR)
        BE-->>FE: 400 Bad Request {detail: "You are outside classroom boundary"}
        FE->>FE: Render Red Error Notification Banner
    end
```

---

### Flow 5: Real-time QR Refresh & Session Monitoring
```mermaid
sequenceDiagram
    autonumber
    participant FE as LiveQRSession.jsx
    participant BE as session.py

    loop Every 2 Seconds Polling
        FE->>BE: GET /session/{session_id}/current-token (Bearer Token)
        BE-->>FE: Return {qr_token: "new_hash", expires_in_seconds: 18}
        FE->>FE: Update QRCodeSVG value & countdown timer
    end
```

---

### Flow 6: Session Termination & Automated Excel Export
```mermaid
sequenceDiagram
    autonumber
    actor Teacher
    participant FE as LiveQRSession.jsx
    participant BE as session.py / excel_export.py

    Teacher->>FE: Click "End Attendance"
    FE->>FE: Show End Session Confirmation Modal
    Teacher->>FE: Click "End Attendance Now"
    FE->>BE: POST /session/{session_id}/end
    BE->>BE: Set session.is_active = False & invalidate tokens
    BE-->>FE: Return 200 OK
    FE->>FE: Render Attendance Completed Screen
    Teacher->>FE: Click "Download Excel Report"
    FE->>BE: GET /session/{session_id}/export-excel
    BE->>BE: Generate openpyxl Spreadsheet (.xlsx)
    BE-->>FE: Binary Blob Stream (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
    FE->>FE: Trigger automated browser download: Attendance_CS301_104.xlsx
```

---

## 4. Navigation Mapping & State Management

### 4.1 State Persistence Architecture

```mermaid
graph LR
    subgraph Browser Storage
        LS1[localStorage.teacher_token] -->|JWT Auth Header| API[FastAPI Backend]
        LS2[localStorage.student_device_id] -->|Hardware Fingerprint| API
        LS3[localStorage.admin_secret] -->|X-Admin-Secret| AdminAPI[Admin Endpoints]
    end

    subgraph App State App.jsx
        S1[activeSession]
        S2[currentToken]
        S3[templates]
        S4[pastSessions]
        S5[studentForm]
    end

    S1 -->|Polled every 2s| S2
    S1 -->|Triggers route| LiveRoute[/live]
    S3 -->|Populates presets| DashRoute[/dashboard]
```

---

### 4.2 State Table Reference

| State Variable | Component Location | Initial Value | Trigger / Source |
| :--- | :--- | :--- | :--- |
| `token` | `App.jsx` | `localStorage.getItem('teacher_token')` | Auth API login / signup |
| `activeSession` | `App.jsx` | `null` | POST `/session/start` |
| `currentToken` | `App.jsx` | `''` | GET `/session/{id}/current-token` (2s poll) |
| `expiresIn` | `App.jsx` | `0` | GET `/session/{id}/current-token` |
| `templates` | `App.jsx` | `[]` | GET `/templates` |
| `pastSessions` | `App.jsx` | `[]` | GET `/session/my-sessions` |
| `studentForm` | `App.jsx` | `null` | GET `/session/{id}/public-form` |
| `studentLoc` | `App.jsx` | `null` | `navigator.geolocation.getCurrentPosition` |

---

## 5. Recommended UX Improvements & Developer Implementation Guide

### 5.1 Key UX Recommendations for Future Sprints

1. **Live Roster Counter WebSocket / SSE:**
   - *Current State:* Roster count updates when reopening dashboard or ending session.
   - *Recommendation:* Add Server-Sent Events (SSE) or WebSockets on `/live` so teachers see student attendance counts tick up live in real-time as students scan.

2. **Offline-Capable Progressive Web App (PWA):**
   - *Recommendation:* Add a Web App Manifest and Service Worker so student scanner forms open seamlessly even in weak classroom cellular signals.

3. **Audio / Visual Haptic Feedback on Student Scan:**
   - *Recommendation:* Trigger a subtle tactile vibration (`navigator.vibrate([100, 50, 100])`) and success chime when student attendance is confirmed.

4. **Multi-Teacher Departmental Sharing:**
   - *Recommendation:* Allow templates created by department heads to be shared across all faculty members within the same college domain (`@kccitm.edu.in`).

---

### 5.2 Developer Implementation Rules

- **Strict Token Verification:** All endpoints under `/session/start`, `/session/end`, `/session/my-sessions`, and `/templates` MUST require valid Bearer JWT tokens.
- **Geofence Fallback:** If GPS accuracy is low (> 50m accuracy rating), notify student to move closer to the instructor standard centroid.
- **Schema Mapping:** Always map ORM session models explicitly to Pydantic schemas (`SessionResponse`) to prevent `ResponseValidationError`.
