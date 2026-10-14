# 🗄️ Database Schema — Online Course Management System

**Organization:** Cognevance Technologies  
**Project:** Level 2 - Online Course Management System  
**Developer:** Shahnawaz Khan  
**Database File:** `data/db.json` (Atomic JSON-backed database, fully compatible with MongoDB/PostgreSQL schemas)

---

## 📐 Entity Relationship (ER) Diagram

```
+------------------+         1 : N         +-------------------+
|      USERS       | --------------------> |    ENROLLMENTS    |
|------------------|                       |-------------------|
| id (PK)          |                       | id (PK)           |
| name             |                       | userId (FK)       |
| email (Unique)   |                       | courseId (FK)     |
| password (Hash)  |                       | progress (%)      |
| role             |                       | completedLessons  |
| avatar           |                       | status            |
| createdAt        |                       | enrolledAt        |
+------------------+                       | lastAccessedAt    |
         |                                 +-------------------+
         | (Admin teaches)                           ^
         v                                           | N : 1
+------------------+                                 |
|     COURSES      | --------------------------------+
|------------------|
| id (PK)          |
| title            |
| slug (Unique)    |
| category         |
| level            |
| duration         |
| price            |
| rating           |
| enrolledCount    |
| thumbnail        |
| shortDescription |
| description      |
| instructor (Obj) |
| lessons (Array)  |
| createdAt        |
| updatedAt        |
+------------------+
```

---

## 📋 1. Collection: `users`

Stores authentication credentials, user roles (`student` vs `admin`), and personal profile data.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | Primary Key, Unique | Unique user identifier (`usr_xxx`) |
| `name` | `String` | Required | Full display name of the user |
| `email` | `String` | Required, Unique, Lowercase | Validated email address for login |
| `password` | `String` | Required | Salted hash generated using `bcryptjs` (Cost factor 10) |
| `role` | `String` | Enum (`"student"`, `"admin"`) | Defines role-based access control (RBAC) |
| `avatar` | `String` | Optional URL | User profile picture or DiceBear SVG |
| `createdAt`| `ISOString`| Required | Registration timestamp |

---

## 📋 2. Collection: `courses`

Stores all educational masterclasses, metadata, difficulty tiers, pricing, and curriculum syllabus modules.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | Primary Key, Unique | Unique course identifier (`crs_xxx`) |
| `title` | `String` | Required | Official title of the masterclass |
| `slug` | `String` | Unique, URL-safe | URL slug for clean routing |
| `category` | `String` | Enum | e.g., Web Development, AI, Cloud, UI/UX |
| `level` | `String` | Enum (`"Beginner"`, `"Intermediate"`, `"Advanced"`) | Difficulty classification |
| `duration` | `String` | Required | Total estimated video/study hours |
| `price` | `Number` | Min: 0 | Course enrollment price ($0.00 for Free) |
| `rating` | `Number` | Min: 1.0, Max: 5.0 | Average student feedback rating |
| `enrolledCount` | `Integer` | Min: 0 | Total number of students enrolled |
| `thumbnail` | `String` | Valid URL | Cover graphic for cards and banners |
| `shortDescription` | `String` | Max: 160 chars | Summary preview for course cards |
| `description` | `String` | Required | Detailed curriculum breakdown and overview |
| `instructor` | `Object` | Required | Object containing `{ name, title, avatar }` |
| `lessons` | `Array<Lesson>` | Min: 1 | Array of embedded lesson modules (see below) |
| `createdAt` | `ISOString` | Required | Initial creation timestamp |
| `updatedAt` | `ISOString` | Required | Last updated timestamp |

### Embedded Schema: `Lesson`
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `String` | Unique lesson ID (`les_xxx`) |
| `title` | `String` | Lesson module title |
| `duration` | `String` | Duration (e.g. `"25m"`) |
| `videoUrl` | `String` | Video stream or embed URL |
| `summary` | `String` | Actionable takeaway notes |

---

## 📋 3. Collection: `enrollments`

Tracks student enrollments, completion checkpoints, and real-time percentage progress.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | Primary Key | Unique enrollment identifier (`enr_xxx`) |
| `userId` | `String` | Foreign Key (`users.id`) | Student who purchased/enrolled |
| `courseId` | `String` | Foreign Key (`courses.id`) | Course enrolled in |
| `progress` | `Integer` | Min: 0, Max: 100 | Percentage completed `(completed / total) * 100` |
| `completedLessons` | `Array<String>` | Unique lesson IDs | Array of finished lesson IDs |
| `status` | `String` | Enum (`"in-progress"`, `"completed"`) | Auto-switches to `"completed"` at 100% |
| `enrolledAt` | `ISOString` | Required | Date student joined |
| `lastAccessedAt` | `ISOString` | Required | Timestamp of last lesson opened |
