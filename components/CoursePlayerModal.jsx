"use client";
import React, { useState } from "react";
import { X, Play, CheckCircle2, Circle, Clock, Award, BookOpen, ChevronRight, Sparkles } from "lucide-react";

export default function CoursePlayerModal({
  course,
  enrollment,
  onClose,
  onUpdateProgress
}) {
  if (!course) return null;

  const lessons = course.lessons || [];
  const completedSet = new Set(enrollment?.completedLessons || []);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [updating, setUpdating] = useState(false);

  const activeLesson = lessons[activeLessonIndex] || lessons[0];
  const progressPercent = enrollment?.progress || 0;

  const toggleLesson = async (lessonId) => {
    const isCurrentlyDone = completedSet.has(lessonId);
    setUpdating(true);
    await onUpdateProgress(course.id, lessonId, !isCurrentlyDone);
    setUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">{course.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Lesson {activeLessonIndex + 1} of {lessons.length}</span>
                <span>•</span>
                <span>Instructor: {course.instructor?.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Completion Badge */}
            {progressPercent === 100 && (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold animate-pulse">
                <Award className="w-4 h-4" /> Course Completed!
              </span>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid: Video/Lecture + Sidebar Playlist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden min-h-[480px]">
          
          {/* Left Column: Player & Active Lesson Content */}
          <div className="lg:col-span-2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40 p-4 sm:p-6 overflow-y-auto">
            {/* Video Mockup Screen */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/60 via-slate-900/80 to-slate-950" />
              
              {/* Play Center icon */}
              <div className="relative z-10 flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
                <h4 className="mt-4 text-base font-bold text-white max-w-md">{activeLesson?.title}</h4>
                <p className="mt-1 text-xs text-indigo-300 font-medium">Click to Play Interactive HD Video ({activeLesson?.duration})</p>
              </div>

              {/* Progress Bar inside video player */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Lesson Info & Action Controls */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Current Lesson {activeLessonIndex + 1}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{activeLesson?.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duration: {activeLesson?.duration}</span>
                </div>
              </div>

              <button
                onClick={() => toggleLesson(activeLesson?.id)}
                disabled={updating}
                className={`py-2.5 px-5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  completedSet.has(activeLesson?.id)
                    ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                }`}
              >
                {completedSet.has(activeLesson?.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completed (Click to Undo)</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Mark Lesson Complete</span>
                  </>
                )}
              </button>
            </div>

            {/* Lesson Summary & Notes */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Lesson Overview & Key Takeaways
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {activeLesson?.summary || "In this lesson, you will master the essential concepts, patterns, and hands-on code examples necessary to implement production-grade architectures."}
              </p>
            </div>
          </div>

          {/* Right Column: Course Syllabus Playlist */}
          <div className="flex flex-col bg-slate-900/90 overflow-hidden">
            {/* Progress Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Course Syllabus</span>
                <span className={`text-xs font-bold ${progressPercent === 100 ? "text-emerald-400" : "text-indigo-400"}`}>
                  {completedSet.size}/{lessons.length} Completed ({progressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    progressPercent === 100
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-indigo-500 to-cyan-400"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Scrollable Lesson Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {lessons.map((lesson, idx) => {
                const isCompleted = completedSet.has(lesson.id);
                const isActive = idx === activeLessonIndex;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? "bg-indigo-950/50 border-indigo-500/50 text-white shadow-md"
                        : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    {/* Checkbox Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLesson(lesson.id);
                      }}
                      className="mt-0.5 p-0.5 hover:scale-110 transition-transform"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>

                    {/* Lesson Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold text-slate-400">Lesson {idx + 1}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.duration}
                        </span>
                      </div>
                      <h5 className={`text-xs font-medium line-clamp-1 mt-0.5 ${isActive ? "text-indigo-200 font-semibold" : "text-slate-200"}`}>
                        {lesson.title}
                      </h5>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isActive ? "text-indigo-400 translate-x-0.5" : "text-slate-600"}`} />
                  </div>
                );
              })}
            </div>

            {/* Bottom Celebration when 100% */}
            {progressPercent === 100 && (
              <div className="p-4 bg-emerald-950/80 border-t border-emerald-500/30 text-center">
                <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-1 animate-bounce" />
                <p className="text-xs font-bold text-emerald-300">🎉 Congratulations!</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">You have mastered all modules in this course.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
