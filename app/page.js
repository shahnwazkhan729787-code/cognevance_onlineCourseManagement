"use client";
import React, { useState, useEffect } from "react";
import { Search, Sparkles, Filter, SlidersHorizontal, BookOpen, Star, CheckCircle2, ArrowRight, Shield, Award, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import CoursePlayerModal from "@/components/CoursePlayerModal";
import CourseDetailsModal from "@/components/CourseDetailsModal";
import AdminCourseModal from "@/components/AdminCourseModal";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" | "student" | "admin"
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = useState(null);
  const [selectedEnrollmentForPlayer, setSelectedEnrollmentForPlayer] = useState(null);
  const [detailsModalCourse, setDetailsModalCourse] = useState(null);
  const [adminCourseModalOpen, setAdminCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Restore user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
    fetchCourses();
  }, []);

  // Fetch enrollments whenever user changes
  useEffect(() => {
    if (user) {
      fetchEnrollments();
    } else {
      setEnrollments([]);
    }
  }, [user]);

  // Fetch courses with filters
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedLevel !== "All") params.append("level", selectedLevel);
      if (sortBy) params.append("sort", sortBy);

      const res = await fetch(`/api/courses?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error("Fetch courses failed:", err);
      showToast("Failed to load courses. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Fetch enrollments for student
  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/enrollments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollments(data.enrollments || []);
      }
    } catch (err) {
      console.error("Fetch enrollments failed:", err);
    }
  };

  // Enroll in a course
  const handleEnroll = async (courseId) => {
    if (!user) {
      setAuthModalMode("login");
      setAuthModalOpen(true);
      showToast("Please sign in or create an account to enroll.", "info");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Enrollment failed.");
      }

      showToast(data.message || "Enrolled successfully!", "success");
      await fetchEnrollments();
      await fetchCourses();

      // Open the course player directly!
      const targetCourse = courses.find((c) => c.id === courseId);
      if (targetCourse) {
        setSelectedCourseForPlayer(targetCourse);
        setSelectedEnrollmentForPlayer(data.enrollment);
        setPlayerModalOpen(true);
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Progress update handler
  const handleUpdateProgress = async (courseId, lessonId, completed) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/enrollments/${courseId}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId, completed })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update progress.");
      }

      // Update local state
      setSelectedEnrollmentForPlayer(data.enrollment);
      setEnrollments((prev) =>
        prev.map((e) => (e.id === data.enrollment.id ? { ...e, ...data.enrollment, course: selectedCourseForPlayer } : e))
      );

      if (data.progress === 100) {
        showToast("🎉 Congratulations! You have completed this course!", "success");
      } else {
        showToast(`Progress saved: ${data.progress}% completed`, "info");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Quick Demo Login
  const handleQuickLogin = async (role) => {
    try {
      const email = role === "admin" ? "admin@cognevance.com" : "student@cognevance.com";
      const password = role === "admin" ? "Admin@123" : "Student@123";

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Demo login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      showToast(`Logged in as Demo ${data.user.role === "admin" ? "Admin Instructor" : "Student"}!`, "success");

      if (data.user.role === "admin") {
        setActiveTab("admin");
      } else {
        setActiveTab("student");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setActiveTab("catalog");
    showToast("Logged out successfully.", "info");
  };

  // Delete Course (Admin)
  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete course.");
      }

      showToast("Course deleted successfully.", "success");
      fetchCourses();
      fetchEnrollments();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const categories = [
    "All",
    "Web Development",
    "AI & Data Science",
    "Cloud & DevOps",
    "UI/UX Design",
    "Mobile Development",
    "Cybersecurity"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* STUDENT DASHBOARD TAB */}
        {activeTab === "student" && user && (
          <StudentDashboard
            user={user}
            enrollments={enrollments}
            onOpenPlayer={(course, enrollment) => {
              setSelectedCourseForPlayer(course);
              setSelectedEnrollmentForPlayer(enrollment);
              setPlayerModalOpen(true);
            }}
            onExploreCourses={() => setActiveTab("catalog")}
          />
        )}

        {/* ADMIN STUDIO TAB */}
        {activeTab === "admin" && user?.role === "admin" && (
          <AdminDashboard
            courses={courses}
            onOpenCreateCourse={() => {
              setCourseToEdit(null);
              setAdminCourseModalOpen(true);
            }}
            onOpenEditCourse={(course) => {
              setCourseToEdit(course);
              setAdminCourseModalOpen(true);
            }}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {/* CATALOG TAB (Default Exploration View) */}
        {activeTab === "catalog" && (
          <div className="space-y-10">
            {/* Hero Section */}
            <section className="relative rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-950 border border-slate-800 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Cognevance Full-Stack Developer Task</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Master High-Income Skills with{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Interactive Video Masterclasses
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                  Industry-oriented online course management platform featuring live syllabus tracking, role-based admin controls, dynamic REST APIs, and instant enrollment.
                </p>

                {/* Hero Search Bar */}
                <div className="pt-4 max-w-xl mx-auto">
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      placeholder="Search courses by keyword, topic, or instructor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xl backdrop-blur-md"
                    />
                  </div>
                </div>

                {/* Hero Stats */}
                <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center border-t border-slate-800/80">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">6+ Courses</p>
                    <span className="text-[11px] text-slate-500">Across 6 Domains</span>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-indigo-400">5,000+</p>
                    <span className="text-[11px] text-slate-500">Global Learners</span>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-amber-400">4.9 ★</p>
                    <span className="text-[11px] text-slate-500">Top Rated Reviews</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter and Categories Section */}
            <section className="space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Controls bar: Level filter & Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-indigo-400" /> Filter Difficulty:
                  </span>
                  <div className="flex gap-1.5">
                    {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-3 py-1 rounded-lg font-medium transition-all ${
                          selectedLevel === lvl
                            ? "bg-indigo-950 text-indigo-300 border border-indigo-700/60"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newly Added</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Courses Grid */}
            <section>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="rounded-2xl bg-slate-900/60 border border-slate-800 h-80 animate-pulse p-4 flex flex-col justify-between">
                      <div className="aspect-video bg-slate-800 rounded-xl" />
                      <div className="space-y-2 mt-4">
                        <div className="h-4 bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-800 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white">No courses match your filter</h3>
                  <p className="text-xs text-slate-400 mt-1">Try resetting search keywords or selecting another category.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedLevel("All");
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const enrollment = enrollments.find((e) => e.courseId === course.id);
                    const isEnrolled = !!enrollment;

                    return (
                      <CourseCard
                        key={course.id}
                        course={course}
                        isEnrolled={isEnrolled}
                        enrollment={enrollment}
                        onEnroll={handleEnroll}
                        onOpenPlayer={(c, enr) => {
                          setSelectedCourseForPlayer(c);
                          setSelectedEnrollmentForPlayer(enr || enrollment);
                          setPlayerModalOpen(true);
                        }}
                        onViewDetails={(c) => setDetailsModalCourse(c)}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">EduFlow — Online Course Management System</p>
              <p className="text-[11px] text-slate-500">Built for Cognevance Technologies Full Stack Web Developer Task</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>Next.js 16</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>JWT Auth & REST API</span>
          </div>

          <p className="text-slate-500">
            © 2026 Shahnawaz Khan. All rights reserved.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser, token, msg) => {
          setUser(newUser);
          showToast(msg, "success");
          fetchEnrollments();
        }}
        onQuickLogin={handleQuickLogin}
      />

      {/* 2. Interactive Course Player Modal */}
      {playerModalOpen && selectedCourseForPlayer && (
        <CoursePlayerModal
          course={selectedCourseForPlayer}
          enrollment={selectedEnrollmentForPlayer}
          onClose={() => setPlayerModalOpen(false)}
          onUpdateProgress={handleUpdateProgress}
        />
      )}

      {/* 3. Course Details / Syllabus Modal */}
      {detailsModalCourse && (
        <CourseDetailsModal
          course={detailsModalCourse}
          isEnrolled={enrollments.some((e) => e.courseId === detailsModalCourse.id)}
          enrollment={enrollments.find((e) => e.courseId === detailsModalCourse.id)}
          onClose={() => setDetailsModalCourse(null)}
          onEnroll={handleEnroll}
          onOpenPlayer={(course, enr) => {
            setSelectedCourseForPlayer(course);
            setSelectedEnrollmentForPlayer(enr);
            setPlayerModalOpen(true);
          }}
        />
      )}

      {/* 4. Admin Course Create/Edit Modal */}
      <AdminCourseModal
        isOpen={adminCourseModalOpen}
        courseToEdit={courseToEdit}
        onClose={() => setAdminCourseModalOpen(false)}
        onSave={(savedCourse, msg) => {
          showToast(msg, "success");
          fetchCourses();
        }}
      />

      {/* 5. Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
