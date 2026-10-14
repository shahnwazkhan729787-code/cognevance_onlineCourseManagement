"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, BookPlus, Save, Check } from "lucide-react";

export default function AdminCourseModal({
  isOpen,
  courseToEdit = null,
  onClose,
  onSave
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("10 Hours");
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [lessons, setLessons] = useState([
    { title: "Introduction & Foundations", duration: "20m", summary: "Welcome to the course and core setup." }
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseToEdit) {
      setTitle(courseToEdit.title || "");
      setCategory(courseToEdit.category || "Web Development");
      setLevel(courseToEdit.level || "Beginner");
      setDuration(courseToEdit.duration || "10 Hours");
      setPrice(courseToEdit.price || 0);
      setThumbnail(courseToEdit.thumbnail || "");
      setShortDescription(courseToEdit.shortDescription || "");
      setDescription(courseToEdit.description || "");
      setLessons(courseToEdit.lessons?.length ? courseToEdit.lessons : [
        { title: "Introduction & Foundations", duration: "20m", summary: "Welcome to the course." }
      ]);
    } else {
      // Reset form
      setTitle("");
      setCategory("Web Development");
      setLevel("Beginner");
      setDuration("12 Hours");
      setPrice(29.99);
      setThumbnail("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80");
      setShortDescription("");
      setDescription("");
      setLessons([
        { title: "Introduction & Course Setup", duration: "25m", summary: "Setting up modern developer tools." },
        { title: "Core Architecture Principles", duration: "45m", summary: "Understanding standard design patterns." }
      ]);
    }
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      { title: `Module ${lessons.length + 1}: Practical Implementation`, duration: "30m", summary: "Hands-on guided walkthrough." }
    ]);
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const handleRemoveLesson = (index) => {
    if (lessons.length <= 1) return;
    setLessons(lessons.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form validation
    if (!title.trim()) {
      setError("Please provide a course title.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a course description.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        category,
        level,
        duration,
        price: parseFloat(price) || 0,
        thumbnail,
        shortDescription,
        description,
        lessons
      };

      const endpoint = courseToEdit
        ? `/api/courses/${courseToEdit.id}`
        : `/api/courses`;
      const method = courseToEdit ? "PUT" : "POST";

      const token = localStorage.getItem("token");
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save course.");
      }

      onSave(data.course, courseToEdit ? "Course updated successfully!" : "New course published!");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <BookPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {courseToEdit ? "Edit Course Information" : "Create New Masterclass Course"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Course Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js 16 & Server Actions Full Course"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Category, Level, Price, Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="Web Development">Web Development</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration</label>
              <input
                type="text"
                placeholder="e.g. 15 Hours"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cover Image (Thumbnail URL)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Short Summary (for Card preview)</label>
            <input
              type="text"
              placeholder="Concise 1-2 sentence pitch of this course..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Course Curriculum Overview *</label>
            <textarea
              rows={3}
              required
              placeholder="Detailed description of what students will achieve upon completion..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Lessons / Modules List Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Course Lessons ({lessons.length})
              </label>
              <button
                type="button"
                onClick={handleAddLesson}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Lesson
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {lessons.map((lesson, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    placeholder="Lesson title"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(idx, "title", e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={lesson.duration}
                    onChange={(e) => handleLessonChange(idx, "duration", e.target.value)}
                    className="w-20 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLesson(idx)}
                    disabled={lessons.length <= 1}
                    className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : courseToEdit ? "Update Course" : "Publish Course"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
