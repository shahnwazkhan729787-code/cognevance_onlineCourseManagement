"use client";
import React, { useState } from "react";
import { GraduationCap, LayoutDashboard, Shield, LogOut, LogIn, UserPlus, Sparkles, BookOpen, Menu, X } from "lucide-react";

export default function Navbar({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onQuickLogin
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("catalog")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                EduFlow
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-indigo-400 uppercase -mt-1">
                Cognevance LMS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "catalog"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Courses</span>
            </button>

            {user && (
              <button
                onClick={() => setActiveTab("student")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "student"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Learning</span>
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "admin"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                    : "text-purple-400 hover:text-white hover:bg-purple-950/40"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Studio</span>
              </button>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Demo Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo:
              </span>
              <button
                onClick={() => onQuickLogin("student")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600/80 text-slate-300 hover:text-white font-medium transition-all"
                title="Login with sample Student credentials"
              >
                Student
              </button>
              <button
                onClick={() => onQuickLogin("admin")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-purple-600/80 text-slate-300 hover:text-white font-medium transition-all"
                title="Login with sample Admin credentials"
              >
                Admin
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <span className={`text-[10px] font-medium uppercase px-1.5 py-0.2 rounded ${
                      user.role === "admin" ? "bg-purple-900/60 text-purple-300 border border-purple-700/50" : "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth("login")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-md shadow-indigo-600/20 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up Free</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab("catalog"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === "catalog" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Courses</span>
            </button>
            {user && (
              <button
                onClick={() => { setActiveTab("student"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === "student" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Learning</span>
              </button>
            )}
            {user?.role === "admin" && (
              <button
                onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === "admin" ? "bg-purple-600 text-white" : "text-purple-300 hover:bg-slate-900"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Studio</span>
              </button>
            )}
          </div>

          {/* Demo switcher mobile */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Quick Demo Login:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { onQuickLogin("student"); setMobileMenuOpen(false); }}
                className="px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-medium"
              >
                Student
              </button>
              <button
                onClick={() => { onQuickLogin("admin"); setMobileMenuOpen(false); }}
                className="px-2.5 py-1 rounded bg-slate-800 text-purple-300 font-medium"
              >
                Admin
              </button>
            </div>
          </div>

          {/* User Auth Info Mobile */}
          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 text-xs text-rose-400 bg-rose-950/40 rounded-lg border border-rose-800/40"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenAuth("login"); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center text-sm font-medium text-white bg-slate-800 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenAuth("register"); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center text-sm font-medium text-white bg-indigo-600 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
