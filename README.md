# Task Manager — Graduate Support Engineer Trainee Assessment

A clean, responsive, and fully functional Task Management web application built with **React**, **Vite**, **Tailwind CSS**, and **Firebase (Authentication & Cloud Firestore)**.

---

## 🛠️ Tech Stack

- **Framework:** React 19 / Vite
- **Language:** JavaScript (ESNext / JSX)
- **Styling:** Tailwind CSS (utility-first, subtle neutral theme)
- **Icons:** Lucide React
- **Charts:** Recharts (doughnut distribution chart)
- **Backend & Cloud Services:**
  - **Firebase Authentication** (Email & Password sign-in / registration)
  - **Cloud Firestore** (Real-time task synchronization via `onSnapshot` & secure collection rules)

---

## 📋 Features Implemented

1. **Firebase Authentication:**
   - Real-time authentication state persistence using `onAuthStateChanged`.
   - **Email & Password Authentication** with Sign In and Create Account modes.
   - Comprehensive error handling with user-friendly messages for invalid credentials, duplicate accounts, and weak passwords.
   - Initial application authentication loading spinner.
   - Secure Logout flow with `signOut`.

2. **Cloud Firestore Integration:**
   - All tasks stored in the Firestore **`tasks`** collection.
   - Document structure:
     - `title` (string, required)
     - `description` (string, optional)
     - `status` (`'Planned'` | `'In Progress'` | `'Complete'`)
     - `createdAt` (ISO string timestamp)
     - `userId` (authenticated user's UID)
   - **User Isolation:** All queries filter strictly by `where('userId', '==', currentUser.uid)`.
   - **Real-Time Synchronization:** Uses Firestore `onSnapshot` for instant multi-tab and live sync.

3. **Secure Firestore Security Rules (`firestore.rules`):**
   - Read, create, update, and delete operations restricted exclusively to the authenticated owner (`request.auth.uid == resource.data.userId`).
   - Prevents unauthorized access or cross-user data exposure.

4. **Productivity Overview (Analytics):**
   - **Completion Rate (%)**: Calculated dynamically as `(Completed Tasks / Total Tasks) * 100` (safe against zero division).
   - **Metrics Breakdown**: Displays Completion Rate, Completed Tasks, Remaining Tasks, and Total Tasks.
   - **Status Distribution Doughnut Chart**: Displays Planned, In Progress, and Complete tasks with a centered total count and legend.
   - **Completion Progress Bar**: Visual progress indicator reflecting completion percentage.
   - **Zero Tasks Handling**: Shows 0% with empty state guidance.

5. **Task Management (CRUD):**
   - **Create Task:** Validates non-empty title, defaults status to `Planned`, attaches `userId` and `createdAt`.
   - **Edit Task:** Modal pre-fills existing title/description, preserving `id`, `status`, and `userId`.
   - **Status Dropdown:** Real-time status switching between `Planned`, `In Progress`, and `Complete`.
   - **Delete Task with Confirmation:** Explicit confirmation modal to prevent accidental data loss.

6. **Status Filtering & Summary Cards:**
   - Four summary cards (Total, Planned, In Progress, Complete).
   - Filter pills for All, Planned, In Progress, Complete with live count badges.
   - Contextual empty states when no tasks match a filter.

7. **User Feedback:**
   - Non-intrusive auto-dismissing toast notifications for create, edit, delete, status change, and errors.

---

## 📂 Project Structure

```text
src/
├── firebase/
│   └── config.js              # Centralized Firebase initialization (App, Auth, Firestore)
├── components/
│   ├── Login.jsx              # Firebase Email/Password Auth (Sign In & Sign Up)
│   ├── TaskSummaryCards.jsx   # 4 dynamic count cards (Total, Planned, In Progress, Complete)
│   ├── ProductivityOverview.jsx # Analytics: completion rate, progress bar & doughnut chart
│   ├── TaskFilterBar.jsx      # Filter pills with live counts
│   ├── TaskList.jsx           # Task list container & contextual empty states
│   ├── TaskItem.jsx           # Task card with badge, date, status dropdown, edit & delete
│   ├── TaskForm.jsx           # Reusable modal for creating and editing tasks
│   ├── DeleteConfirmModal.jsx # Explicit delete confirmation dialog
│   └── Notification.jsx       # Success / error feedback toast alerts
├── services/
│   └── taskService.js         # Firestore CRUD & real-time onSnapshot subscription
├── App.jsx                    # Auth listener, Firestore sync, and main view controller
├── main.jsx                   # React DOM entry point
└── index.css                  # Tailwind CSS directives
├── firestore.rules            # Security rules ensuring user data isolation
├── firebase.json              # Firebase CLI deployment configuration
├── .env.example               # Environment variables template
└── vite.config.js             # Vite configuration
```

---

## 🔑 Firebase Configuration

Set your Firebase Web App credentials in a `.env` file (copied from `.env.example`):

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
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

### 4. Deploy Firestore Rules (Optional via Firebase CLI)
```bash
firebase deploy --only firestore:rules
```
