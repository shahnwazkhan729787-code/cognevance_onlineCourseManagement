# 🎓 EduFlow — Online Course Management System

> **Cognevance Technologies — Full Stack Web Developer Project Task (Level 2: Intermediate)**  
> **Repository Name:** `cognevance_onlineCourseManagement`  
> **Developer:** Shahnawaz Khan  
> **Submission Email:** support@cognevance.online  
> **Framework:** Next.js 16 (App Router) + React 19 + Tailwind CSS + JWT Authentication + REST APIs

---

## 🌟 Executive Summary

**EduFlow** is an enterprise-grade, responsive full-stack web application built to streamline online learning, course publishing, and student progress tracking. The platform provides a modern, high-performance experience with role-based access control (RBAC), interactive syllabus checklists, live progress calculation, comprehensive admin analytics, and dynamic RESTful APIs.

---

## 🚀 Key Features Implemented

### 1. 🔐 User Authentication & Authorization (RBAC)
- **Role-Based Access Control:** Distinct experiences for **Students** and **Admin Instructors**.
- **Secure Password Hashing:** Salted passwords using `bcryptjs` (Cost factor 10).
- **Session Security:** Stateless JSON Web Tokens (JWT) with authorization middleware.
- **One-Click Demo Switcher:** Instant buttons in the navigation bar to login as either Student or Admin for rapid evaluation.

### 2. 📚 REST APIs for Courses and Enrollments
- Standard HTTP REST endpoints for complete CRUD operations on courses and student enrollments.
- Dynamic query parameter filters: `search`, `category`, `level`, and `sort`.
- Complete endpoint documentation available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### 3. 🎯 Student Learning Dashboard & Course Player
- **Student Dashboard:** View enrolled masterclasses, active courses, completed courses, and overall average completion rate.
- **Interactive Course Player:** HD video viewing screen, interactive lesson syllabus playlist, and live progress updating.
- **Interactive Checklist:** Students mark lessons as completed with real-time recalculation of progress percentages (0% to 100%) and celebration badges.

### 4. ⚡ Admin Studio & Platform Analytics
- **Live Platform Metrics:** Total registered students, published courses, active enrollments, and gross revenue generated.
- **Course Management:** Modal-driven Create, Edit, and Delete course workflows with input validations.
- **Live Enrollments Feed:** Table displaying student names, enrolled courses, progress bars, and completion statuses.

### 5. 🔍 Real-Time Search, Filtering & Sorting
- **Instant Search:** Debounced keyword search across course titles, descriptions, and instructor names.
- **Category Filter Tabs:** Web Development, AI & Data Science, Cloud & DevOps, UI/UX Design, Mobile Development, Cybersecurity.
- **Difficulty Tiers:** Beginner, Intermediate, and Advanced pills.
- **Sorting Modes:** Most Popular, Highest Rated, and Newly Added.

### 6. 📱 Responsive Design & Form Validations
- Mobile-first responsive layouts with dynamic drawers, glassmorphism headers, and glowing cards.
- Client-side & server-side validation on forms (Registration, Login, Course Publishing) with accessible error feedback.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS, Lucide React Icons |
| **Backend** | Next.js API Routes (Node.js runtime), RESTful Architecture |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Database** | Persistent JSON Database Engine (`data/db.json`) with Atomic File Locks |
| **Deployment** | Vercel / Render / Railway Ready with zero external configuration required |

---

## 🔑 Pre-Configured Demo Credentials

For immediate testing, use the built-in quick login buttons or sign in with:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin Instructor** | `admin@cognevance.com` | `Admin@123` | Publish courses, edit curriculum, delete courses, view financial stats |
| **Student** | `student@cognevance.com` | `Student@123` | Browse catalog, enroll in courses, track progress, complete lessons |

*(You can also click **Sign Up** to create any new custom student or instructor account!)*

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js version 18.x or 20.x or higher
- npm, yarn, or pnpm

### Step 1: Clone or Navigate to Project
```bash
git clone https://github.com/your-username/cognevance_onlineCourseManagement.git
cd cognevance_onlineCourseManagement
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your web browser.

### Step 4: Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Directory Structure

```
cognevance_onlineCourseManagement/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── stats/route.js        # Analytics & metrics API
│   │   ├── auth/
│   │   │   ├── login/route.js        # User login endpoint
│   │   │   ├── register/route.js     # User registration endpoint
│   │   │   └── me/route.js           # Current user profile endpoint
│   │   ├── courses/
│   │   │   ├── [id]/route.js         # Single course GET/PUT/DELETE
│   │   │   └── route.js              # Course list & Admin POST
│   │   └── enrollments/
│   │       ├── [id]/progress/route.js# Live progress update API
│   │       └── route.js              # User enrollments & enroll API
│   ├── globals.css                   # Global styles & theme tokens
│   ├── layout.js                     # Root layout & SEO meta tags
│   └── page.js                       # Main application page
├── components/
│   ├── AdminCourseModal.jsx          # Course create/edit modal
│   ├── AdminDashboard.jsx            # Admin analytics & course tables
│   ├── AuthModal.jsx                 # Login & Registration modal
│   ├── CourseCard.jsx                # Course display card with progress
│   ├── CourseDetailsModal.jsx        # Syllabus & course overview modal
│   ├── CoursePlayerModal.jsx         # Video player & lesson checklist
│   ├── Navbar.jsx                    # Header with role switcher & search
│   ├── StudentDashboard.jsx          # Student learning & progress hub
│   └── Toast.jsx                     # Notification toast alert system
├── data/
│   └── db.json                       # Seed database with courses & users
├── lib/
│   ├── auth.js                       # JWT signing, verification & bcrypt
│   └── db.js                         # Database read/write persistence
├── API_DOCUMENTATION.md              # REST API reference specifications
├── DATABASE_SCHEMA.md                # ER diagram & collection schemas
├── README.md                         # Project documentation
└── package.json
```

---

## 🌐 Deployment Instructions (Vercel)

This application is optimized for 1-click deployment to **Vercel**:

1. Push this repository to GitHub with the name `cognevance_onlineCourseManagement`.
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Keep the Framework Preset as **Next.js**.
5. Add an optional environment variable `JWT_SECRET` (or use the built-in fallback).
6. Click **Deploy**. Vercel will build and provide a live URL within 60 seconds!

---

## 📄 Submission Checklist

- [x] **Frontend Source Code:** Next.js 16 + React 19 + Tailwind CSS.
- [x] **Backend Source Code:** Complete REST API routes with authentication & validations.
- [x] **Database Setup:** Fully structured, persistent database with realistic seed courses.
- [x] **REST API Documentation:** Detailed [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
- [x] **Database Schema:** Detailed [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).
- [x] **Repository Naming:** Conforms to `cognevance_projectName` format (`cognevance_onlineCourseManagement`).
- [x] **Deployment Ready:** Validated with `npm run build` with 0 compile errors.

---

**Developed with ❤️ by Shahnawaz Khan for Cognevance Technologies**
