import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EduFlow — Online Course Management System (Cognevance Technologies)",
  description: "Industry-oriented full-stack web application for managing online courses, student enrollments, interactive syllabus progress tracking, and role-based admin controls. Developed by Shahnawaz Khan.",
  keywords: ["online courses", "course management", "lms", "full stack developer", "cognevance technologies", "nextjs", "react"],
  authors: [{ name: "Shahnawaz Khan" }]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-slate-100">
        {children}
      </body>
    </html>
  );
}
