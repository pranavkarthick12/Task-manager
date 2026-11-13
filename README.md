# Task Manager — Graduate Support Engineer Trainee Assessment

A clean, responsive, and fully functional Task Management web application built with **React**, **Vite**, **Tailwind CSS**, and **Firebase (Google Authentication & Cloud Firestore)**.

---

## 🛠️ Tech Stack

- **Framework:** React 19 / Vite
- **Language:** JavaScript (ESNext / JSX)
- **Styling:** Tailwind CSS (utility-first, subtle neutral theme)
- **Icons:** Lucide React
- **Charts:** Recharts (doughnut distribution chart)
- **Backend & Cloud Services:**
  - **Firebase Authentication** (Google Sign-In with `GoogleAuthProvider` and `signInWithPopup`)
  - **Cloud Firestore** (Real-time synchronization via `onSnapshot` under `users/{uid}/tasks`)

---

## 📋 Features Implemented

1. **Google Sign-In Authentication:**
   - Prominent **"Continue with Google"** button with official branding.
   - Powered by Firebase `GoogleAuthProvider` and `signInWithPopup(auth, googleProvider)`.
   - Real-time session persistence via `onAuthStateChanged`.
   - Comprehensive error handling for popup closures, blocked popups, and network interruptions.
   - Functional **Sign Out** button calling `signOut(auth)`.
   - Displays user's Google profile photo, display name, and email in both the header and welcome section.

2. **Cloud Firestore Task Storage (`users/{uid}/tasks`):**
   - Each user's tasks are strictly stored in their own isolated subcollection: `users/{uid}/tasks`.
   - Document structure:
     - `title` (string, required)
     - `description` (string, optional)
     - `status` (`'Planned'` | `'In Progress'` | `'Complete'`)
     - `createdAt` (ISO 8601 string timestamp)
     - `userId` (authenticated user's Google UID)
   - Real-time synchronization using Firestore `onSnapshot` updates the dashboard immediately on any change.

3. **Secure Firestore Security Rules (`firestore.rules`):**
   - Restricts read, create, update, and delete operations on `users/{userId}/tasks/{taskId}` exclusively to the matching authenticated UID (`request.auth.uid == userId`).

4. **Productivity Overview (Analytics):**
   - **Completion Rate (%)**: `(Completed Tasks / Total Tasks) * 100` (safe against zero division).
   - **Metrics Breakdown**: Completion Rate, Completed Tasks, Remaining Tasks, and Total Tasks.
   - **Task Distribution Doughnut Chart**: Planned, In Progress, and Complete distribution with centered total count and legend.
   - **Completion Progress Bar**: Visual progress indicator reflecting completion percentage.
   - **Zero Tasks Handling**: Displays 0% completion with empty state guidance.

5. **Task Management (CRUD):**
   - **Create Task:** Validates non-empty title, defaults status to `Planned`, attaches `userId` and `createdAt`.
   - **Edit Task:** Modal pre-fills existing title/description, preserving `id`, `status`, and `userId`.
   - **Status Dropdown:** Real-time status switching between `Planned`, `In Progress`, and `Complete`.
   - **Delete Task with Confirmation:** Explicit confirmation modal to prevent accidental data loss.

6. **Status Filtering & Summary Cards:**
   - Four summary cards (Total, Planned, In Progress, Complete).
   - Filter pills for All, Planned, In Progress, Complete with live count badges.
   - Contextual empty states when no tasks match a filter.

---

## 📂 Project Structure

```text
src/
├── firebase/
│   └── config.js              # Centralized Firebase initialization & GoogleAuthProvider
├── components/
│   ├── Login.jsx              # Google Sign-In only screen
│   ├── TaskSummaryCards.jsx   # 4 dynamic count cards (Total, Planned, In Progress, Complete)
│   ├── ProductivityOverview.jsx # Analytics: completion rate, progress bar & doughnut chart
│   ├── TaskFilterBar.jsx      # Filter pills with live counts
│   ├── TaskList.jsx           # Task list container & contextual empty states
│   ├── TaskItem.jsx           # Task card with badge, date, status dropdown, edit & delete
│   ├── TaskForm.jsx           # Reusable modal for creating and editing tasks
│   ├── DeleteConfirmModal.jsx # Explicit delete confirmation dialog
│   └── Notification.jsx       # Success / error feedback toast alerts
├── services/
│   └── taskService.js         # Firestore CRUD scoped to users/{uid}/tasks
├── App.jsx                    # Auth listener, Firestore sync, user profile & main view
├── main.jsx                   # React DOM entry point
└── index.css                  # Tailwind CSS setup
├── firestore.rules            # Security rules for users/{userId}/tasks
├── firebase.json              # Firebase CLI deployment configuration
└── vite.config.js             # Vite configuration
```

---

## 🚀 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
```

