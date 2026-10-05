# 📊 Attendance Tracker

A lightweight, cloud-synced web application for managing and monitoring class attendance.

Students can add their subjects, create a weekly timetable, mark classes as **Present, Absent, or Cancelled**, and monitor their attendance percentage in real time. The application also provides useful insights such as how many classes can still be missed while maintaining the required attendance target.

## 🚀 Live Application

**Try the Attendance Tracker:**  
https://saptaattendancetracker.vercel.app/

---

## 📌 Overview

Most educational institutions require students to maintain a minimum attendance percentage. However, manually calculating attendance and keeping track of missed classes can be difficult.

**Attendance Tracker** provides a centralized platform where students can:

- Monitor overall attendance
- Track attendance subject-wise
- Maintain a weekly timetable
- Mark daily attendance
- View attendance history through a calendar
- Calculate how many classes can still be missed
- Determine how many consecutive classes are required to reach a target
- Track weekly and monthly attendance trends
- Manage holidays
- Export attendance data
- Synchronize data across devices using cloud storage

The application is designed as a lightweight web application with a simple and responsive interface.

---

## ✨ Features

### 📊 Dashboard

- Overall attendance percentage
- Total classes
- Present and absent counts
- Configurable attendance target
- Attendance status and warnings
- Today's scheduled classes
- Remaining safe-to-skip classes

### 📚 Subject Management

- Add new subjects
- Edit existing subjects
- Delete subjects
- Assign subjects to weekdays
- Create a personalized weekly timetable

### 🗓️ Calendar

- Monthly attendance calendar
- Colour-coded attendance status
- Present days
- Absent days
- Partial attendance
- Cancelled classes
- Sundays and holidays
- Select a date to record attendance

### ✅ Attendance Marking

Each scheduled class can be marked as:

- **Present**
- **Absent**
- **Cancelled**
- **Remove Marking**

There is also an option to cancel all classes scheduled for a particular day.

### 📈 Reports

The Reports section provides:

- Subject-wise attendance percentage
- Attendance progress indicators
- Weekly attendance trends
- Monthly attendance trends
- Attendance statistics

### 🏖️ Holiday Management

- Built-in holiday data
- Official holidays for 2026–2030
- Custom holidays
- Automatic Sunday handling
- Holiday-aware attendance calculations

### 🤖 AI Assistant

The application includes a browser-based attendance assistant that can answer questions about the user's attendance data.

Examples:

> How am I doing?

> Can I skip a class?

> Can I skip Maths tomorrow?

> How many classes do I need to reach 85%?

> Which subjects are at risk?

> What classes do I have tomorrow?

> Am I improving?

The assistant can also understand informal terms such as **"bunk"** and recognize subject names, abbreviations, and relative dates.

### 🎨 Themes

The application supports multiple interface themes:

- Blue
- Green
- Purple
- Dark Mode

### 📤 Data Export

Users can export their attendance information as:

- CSV
- JSON backup

### 🔔 Notifications

Optional browser notifications can remind users to record attendance.

### ☁️ Cloud Synchronization

Attendance information can be synchronized with the user's account so that the data can be accessed across devices.

### 📱 Progressive Web App

The application can be installed as a Progressive Web App on supported mobile and desktop browsers.

---

## 🧮 Attendance Calculation

Attendance percentage is calculated using:

```text
Attendance % = Present / (Present + Absent) × 100
```

Cancelled classes are **not included** in the attendance calculation because the class did not take place.

### Attendance Status

| Status | Included in Calculation |
|---|---|
| Present | ✅ Yes |
| Absent | ✅ Yes |
| Cancelled | ❌ No |

### Classes That Can Still Be Missed

If:

- `P` = Present classes
- `N` = Total counted classes
- `T` = Target attendance percentage

Then:

```text
Maximum skippable classes =
floor((P × 100) / T − N)
```

### Classes Required to Reach Target

If the current attendance is below the target:

```text
Required classes =
ceil((T × N − 100 × P) / (100 − T))
```

These calculations allow the application to provide forward-looking attendance guidance.

---

## 🏗️ Architecture

```text
                  ┌─────────────────────┐
                  │       Browser       │
                  │                     │
                  │  HTML / CSS / JS    │
                  └──────────┬──────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐        ┌────────────────┐
        │  localStorage │        │  Supabase Auth │
        │               │        │                │
        │ Local Data    │        │ Authentication │
        └───────┬───────┘        └───────┬────────┘
                │                        │
                └────────────┬───────────┘
                             ▼
                    ┌─────────────────┐
                    │     Supabase    │
                    │                 │
                    │   PostgreSQL    │
                    │   + RLS         │
                    └─────────────────┘
```

### Data Synchronization

The following data can be synchronized:

```text
subjects
attendanceRecords
holidays
attendanceTarget
weeklySchedule
```

### Attendance Record Format

```json
{
  "date": "2026-10-05",
  "subjectId": "1791225003729",
  "status": "present"
}
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Security | PostgreSQL Row Level Security |
| Charts | Chart.js |
| Hosting | Vercel |
| Offline Support | Service Worker |
| Installation | Progressive Web App |
| Storage | Browser localStorage + Supabase |

---

## 📂 Project Structure

```text
my_attendence_record/
│
├── index.html
├── subjects.html
├── calendar.html
├── attendance.html
├── report.html
├── holidays.html
├── login.html
├── signup.html
├── manifest.json
├── SUPABASE_SETUP.sql
│
├── icon-192.png
├── icon-512.png
│
├── css/
│   └── style.css
│
└── js/
    ├── app.js
    ├── attendance.js
    ├── subjects.js
    ├── calendar.js
    ├── holidays.js
    ├── report.js
    ├── ai_assistant.js
    ├── auth.js
    ├── login.js
    ├── supabase.js
    └── service_worker.js
```

---

## 🚀 Getting Started

### Prerequisites

Before running the project locally, make sure you have:

- A Supabase account
- A Supabase project
- A modern web browser
- VS Code or another code editor
- A local static server

You can use:

- VS Code Live Server
- Python HTTP Server
- Node.js static server

---

### 1. Clone the Repository

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd my_attendence_record
```

---

### 2. Configure Supabase

Create a new project in Supabase.

Open the Supabase **SQL Editor** and execute:

```text
SUPABASE_SETUP.sql
```

This creates the required database structure and Row Level Security policies.

Then open:

```text
js/supabase.js
```

Add your Supabase project credentials:

```javascript
const SUPABASE_URL = "https://<your-project>.supabase.co";
const SUPABASE_KEY = "<your-anon-public-key>";
```

> ⚠️ Never expose your Supabase `service_role` key in frontend code.

---

### 3. Run Locally

#### Using Python

```bash
python -m http.server 5501
```

Then open:

```text
http://localhost:5501
```

#### Using VS Code Live Server

Open `index.html` with the **Live Server** extension.

---

## 🌐 Deployment

The application is a static web application and can be deployed using services such as:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Vercel Deployment

1. Push the project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Select the project.
5. Keep the framework setting appropriate for a static site.
6. Leave the build command empty if no build step is required.
7. Deploy the project.

### Current Deployment

The current live deployment is hosted on Vercel:

**https://saptaattendancetracker.vercel.app/**

---

## 📖 Usage Guide

### Step 1 — Create an Account

Open the application and create an account using the sign-up page.

### Step 2 — Add Subjects

Add the subjects you study and select the weekdays on which each subject is scheduled.

### Step 3 — Set Your Attendance Target

Set your required attendance percentage, such as:

```text
75%
80%
85%
```

### Step 4 — Manage Holidays

Review the predefined holidays and add custom holidays if required.

### Step 5 — Mark Attendance

From the calendar, select a date and mark each scheduled class as:

```text
Present
Absent
Cancelled
```

### Step 6 — Monitor Attendance

Use the Dashboard and Reports sections to monitor:

- Overall attendance
- Subject-wise attendance
- Attendance trends
- Safe-to-skip classes
- Required classes to reach your target

### Step 7 — Use the AI Assistant

Ask natural-language questions about your attendance data using the built-in assistant.

---

## 🔐 Security

The project uses Supabase authentication and PostgreSQL Row Level Security.

### Security Measures

- User-specific database access
- PostgreSQL Row Level Security
- Supabase authentication
- Public Supabase anon key only
- No service-role key in frontend code
- Local processing for the attendance assistant

Each user should only be able to access their own attendance data.

> **Important:** Never commit private API keys, service-role keys, passwords, or other sensitive credentials to GitHub.

---

## ⚠️ Known Limitations

- Password recovery is limited because the current authentication system uses username-based accounts.
- Offline functionality depends on the current service-worker configuration.
- Synchronization uses a last-write-wins approach.
- Simultaneous edits from multiple devices may overwrite previous changes.
- Built-in official holiday data currently covers 2026–2030.
- The application is primarily designed for individual student attendance tracking.

---

## 🗺️ Roadmap

Future improvements may include:

- [ ] Improved offline support
- [ ] Complete service-worker caching
- [ ] Email-based authentication
- [ ] Password recovery
- [ ] Per-subject attendance targets
- [ ] Class timings
- [ ] Per-class reminders
- [ ] Import attendance from JSON
- [ ] Improved analytics dashboard
- [ ] More advanced attendance predictions
- [ ] Optional LLM-powered assistant
- [ ] Improved mobile UI
- [ ] Multi-semester attendance management

---

## 🤝 Contributing

Contributions and suggestions are welcome.

### Contribution Steps

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Test the application.
5. Commit your changes.

```bash
git commit -m "Add new feature"
```

6. Push the branch.

```bash
git push origin feature/new-feature
```

7. Open a Pull Request.

---

## 📄 License

No specific open-source license has currently been added to this project.

If you plan to distribute or accept external contributions, consider adding a license such as the **MIT License**.

---

## 👩‍💻 Project

**Attendance Tracker**

A simple, student-focused solution for making attendance management easier, faster, and more reliable.

### 🔗 Live Demo

**https://saptaattendancetracker.vercel.app/**

---

⭐ If you find this project useful, consider giving the repository a star!
