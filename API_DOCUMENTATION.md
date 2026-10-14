# 📚 REST API Documentation — Online Course Management System

**Organization:** Cognevance Technologies  
**Project:** Level 2 - Online Course Management System (Full Stack)  
**Developer:** Shahnawaz Khan  
**Base URL:** `http://localhost:3000/api` (or production domain)

---

## 🔐 1. Authentication & Authorization

All protected routes expect a JSON Web Token (JWT) sent via either:
- Header: `Authorization: Bearer <token>`
- Or Cookie: `token=<jwt_token>`

### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Access:** Public
- **Request Body (JSON):**
  ```json
  {
    "name": "Aman Sharma",
    "email": "aman@example.com",
    "password": "Password@123",
    "role": "student"
  }
  ```
  *(Note: `role` can be `"student"` or `"admin"`)*
- **Response (201 Created):**
  ```json
  {
    "message": "Registration successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": "usr_1712345678",
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "role": "student",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=Aman%20Sharma",
      "createdAt": "2026-02-15T10:00:00.000Z"
    }
  }
  ```

---

### 1.2 User Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Access:** Public
- **Request Body (JSON):**
  ```json
  {
    "email": "student@cognevance.com",
    "password": "Student@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Login successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": "usr_student",
      "name": "Rahul Verma (Student)",
      "email": "student@cognevance.com",
      "role": "student"
    }
  }
  ```

---

### 1.3 Get Current User Profile
- **Method:** `GET`
- **Endpoint:** `/api/auth/me`
- **Access:** Authenticated (Student / Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "user": {
      "id": "usr_student",
      "name": "Rahul Verma (Student)",
      "email": "student@cognevance.com",
      "role": "student",
      "avatar": "https://images.unsplash.com/..."
    }
  }
  ```

---

## 🎓 2. Course Management APIs

### 2.1 Get All Courses (with Search & Filters)
- **Method:** `GET`
- **Endpoint:** `/api/courses`
- **Access:** Public
- **Query Parameters:**
  - `search` (string) — Filter by title, description, or instructor
  - `category` (string) — Filter by: `Web Development`, `AI & Data Science`, `Cloud & DevOps`, `UI/UX Design`, `Mobile Development`, `Cybersecurity`
  - `level` (string) — Filter by: `Beginner`, `Intermediate`, `Advanced`
  - `sort` (string) — Sort by: `popular` (default), `rating`, `newest`
- **Example Request:**
  `GET /api/courses?category=Web%20Development&level=Beginner&sort=rating`
- **Response (200 OK):**
  ```json
  {
    "courses": [
      {
        "id": "crs_1",
        "title": "Full-Stack Web Development Bootcamp 2026",
        "slug": "full-stack-web-development-bootcamp",
        "category": "Web Development",
        "level": "Beginner",
        "duration": "24 Hours",
        "price": 49.99,
        "rating": 4.9,
        "enrolledCount": 1240,
        "thumbnail": "https://images.unsplash.com/...",
        "shortDescription": "Master HTML, CSS, Next.js, Node.js, REST APIs...",
        "instructor": {
          "name": "Shahnawaz Khan",
          "title": "Lead Full-Stack Engineer"
        },
        "lessons": [
          {
            "id": "les_1_1",
            "title": "Course Introduction & Development Setup",
            "duration": "18m",
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "summary": "Welcome to the course..."
          }
        ]
      }
    ],
    "total": 1
  }
  ```

---

### 2.2 Get Single Course Details
- **Method:** `GET`
- **Endpoint:** `/api/courses/:id`
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "course": {
      "id": "crs_1",
      "title": "Full-Stack Web Development Bootcamp 2026",
      "category": "Web Development",
      "lessons": [ ... ]
    }
  }
  ```

---

### 2.3 Create New Course
- **Method:** `POST`
- **Endpoint:** `/api/courses`
- **Access:** Restricted (Admin role required)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (JSON):**
  ```json
  {
    "title": "Next.js 16 Production Architectures",
    "category": "Web Development",
    "level": "Intermediate",
    "duration": "14 Hours",
    "price": 39.99,
    "thumbnail": "https://images.unsplash.com/...",
    "shortDescription": "Learn Server Components, Turbopack, and Cache API.",
    "description": "Comprehensive guide to scaling Next.js apps.",
    "lessons": [
      {
        "title": "Deep Dive into App Router & Server Actions",
        "duration": "30m",
        "summary": "Core setup and execution model."
      }
    ]
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Course created successfully!",
    "course": { "id": "crs_1712349999", ... }
  }
  ```

---

### 2.4 Update Course
- **Method:** `PUT`
- **Endpoint:** `/api/courses/:id`
- **Access:** Restricted (Admin role required)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "message": "Course updated successfully!",
    "course": { ... }
  }
  ```

---

### 2.5 Delete Course
- **Method:** `DELETE`
- **Endpoint:** `/api/courses/:id`
- **Access:** Restricted (Admin role required)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "message": "Course deleted successfully!"
  }
  ```

---

## 📈 3. Enrollment & Progress Tracking APIs

### 3.1 Get Student's Enrollments
- **Method:** `GET`
- **Endpoint:** `/api/enrollments`
- **Access:** Authenticated (Student)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "enrollments": [
      {
        "id": "enr_1",
        "userId": "usr_student",
        "courseId": "crs_1",
        "progress": 33,
        "completedLessons": ["les_1_1", "les_1_2"],
        "status": "in-progress",
        "course": {
          "id": "crs_1",
          "title": "Full-Stack Web Development Bootcamp 2026",
          ...
        }
      }
    ]
  }
  ```

---

### 3.2 Enroll in a Course
- **Method:** `POST`
- **Endpoint:** `/api/enrollments`
- **Access:** Authenticated (Student)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "courseId": "crs_2"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Successfully enrolled in course!",
    "enrollment": {
      "id": "enr_1712398888",
      "userId": "usr_student",
      "courseId": "crs_2",
      "progress": 0,
      "completedLessons": [],
      "status": "in-progress"
    }
  }
  ```

---

### 3.3 Update Lesson Progress
- **Method:** `PUT`
- **Endpoint:** `/api/enrollments/:id/progress`
- **Access:** Authenticated (Owner of enrollment)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "lessonId": "les_2_2",
    "completed": true
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Progress updated successfully!",
    "progress": 50,
    "completedLessons": ["les_2_1", "les_2_2"],
    "status": "in-progress"
  }
  ```

---

## 📊 4. Admin Analytics & Stats API

### 4.1 Get Platform Metrics & Overview
- **Method:** `GET`
- **Endpoint:** `/api/admin/stats`
- **Access:** Restricted (Admin role required)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "metrics": {
      "totalStudents": 1,
      "totalCourses": 6,
      "totalEnrollments": 2,
      "totalRevenue": 119.98,
      "averageProgress": 29
    },
    "categoryCounts": {
      "Web Development": 1,
      "AI & Data Science": 1,
      "Cloud & DevOps": 1,
      "UI/UX Design": 1,
      "Mobile Development": 1,
      "Cybersecurity": 1
    },
    "recentEnrollments": [
      {
        "id": "enr_2",
        "studentName": "Rahul Verma (Student)",
        "studentEmail": "student@cognevance.com",
        "courseTitle": "Artificial Intelligence & Generative AI with Python",
        "progress": 25,
        "status": "in-progress",
        "enrolledAt": "2026-02-05T15:30:00.000Z"
      }
    ]
  }
  ```
