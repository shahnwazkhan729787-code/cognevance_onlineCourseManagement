import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data with rich content for demonstration
const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminHashedPassword = bcrypt.hashSync("Admin@123", salt);
  const studentHashedPassword = bcrypt.hashSync("Student@123", salt);

  return {
    users: [
      {
        id: "usr_admin",
        name: "Shahnawaz (Admin Instructor)",
        email: "admin@cognevance.com",
        password: adminHashedPassword,
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_student",
        name: "Rahul Verma (Student)",
        email: "student@cognevance.com",
        password: studentHashedPassword,
        role: "student",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      }
    ],
    courses: [
      {
        id: "crs_1",
        title: "Full-Stack Web Development Bootcamp 2026",
        slug: "full-stack-web-development-bootcamp",
        category: "Web Development",
        level: "Beginner",
        duration: "24 Hours",
        price: 49.99,
        rating: 4.9,
        enrolledCount: 1240,
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Master HTML, CSS, Next.js, Node.js, REST APIs, and modern database architecture from scratch.",
        description: "An intensive industry-aligned bootcamp designed for aspiring full-stack engineers. Learn how to architect, develop, and deploy production-grade modern web applications with cutting-edge tools.",
        instructor: {
          name: "Shahnawaz Khan",
          title: "Lead Full-Stack Engineer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        lessons: [
          { id: "les_1_1", title: "Course Introduction & Development Setup", duration: "18m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Welcome to the course! Learn how to configure your VS Code, Node.js, and Git workflow." },
          { id: "les_1_2", title: "Modern JavaScript (ES6+) Deep Dive", duration: "45m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Arrow functions, destructuring, async/await, and promises in modern JavaScript." },
          { id: "les_1_3", title: "Building RESTful APIs with Node.js & Express", duration: "55m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Routing, middleware, request validation, and status codes." },
          { id: "les_1_4", title: "Database Design, Schemas & Relationships", duration: "40m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Learn normalized database schemas, primary keys, and foreign keys." },
          { id: "les_1_5", title: "React & Next.js App Router Masterclass", duration: "1h 15m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Server components, client components, state management, and Tailwind CSS." },
          { id: "les_1_6", title: "Deployment to Vercel and Production Monitoring", duration: "30m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "CI/CD pipelines, environment variables, SSL, and custom domain setup." }
        ],
        createdAt: "2026-01-10T10:00:00.000Z",
        updatedAt: "2026-01-10T10:00:00.000Z"
      },
      {
        id: "crs_2",
        title: "Artificial Intelligence & Generative AI with Python",
        slug: "ai-generative-ai-python",
        category: "AI & Data Science",
        level: "Intermediate",
        duration: "30 Hours",
        price: 69.99,
        rating: 4.8,
        enrolledCount: 980,
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Build LLM applications, prompt engineering pipelines, and RAG systems using Python and OpenAI/Gemini APIs.",
        description: "Step into the future of software development with generative AI. Understand embedding models, vector databases, LangChain, and how to integrate AI agents into real-world applications.",
        instructor: {
          name: "Dr. Ayesha Malik",
          title: "AI Research Scientist",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
        },
        lessons: [
          { id: "les_2_1", title: "Introduction to Machine Learning & Neural Networks", duration: "35m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Foundations of perceptrons, loss functions, and backpropagation." },
          { id: "les_2_2", title: "Working with Large Language Models (LLMs)", duration: "50m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Understanding tokens, temperature, context windows, and embeddings." },
          { id: "les_2_3", title: "Building Retrieval-Augmented Generation (RAG)", duration: "1h 10m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Vector databases, similarity search, chunking, and context injection." },
          { id: "les_2_4", title: "Deploying Autonomous AI Agents", duration: "45m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Function calling, tools execution, and guardrails in production." }
        ],
        createdAt: "2026-01-15T12:00:00.000Z",
        updatedAt: "2026-01-15T12:00:00.000Z"
      },
      {
        id: "crs_3",
        title: "Cloud Architecture & DevOps: Docker, K8s & AWS",
        slug: "cloud-devops-docker-kubernetes-aws",
        category: "Cloud & DevOps",
        level: "Advanced",
        duration: "20 Hours",
        price: 59.99,
        rating: 4.9,
        enrolledCount: 750,
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Master containerization, Kubernetes orchestration, CI/CD pipelines, and scalable cloud infrastructure on AWS.",
        description: "Comprehensive guide to modern enterprise infrastructure. Learn to write Dockerfiles, manage multi-pod clusters, automate GitHub Actions, and deploy zero-downtime microservices.",
        instructor: {
          name: "Vikram Sengupta",
          title: "Principal Cloud Architect",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        },
        lessons: [
          { id: "les_3_1", title: "Docker Essentials: Containers vs Virtual Machines", duration: "30m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Container lifecycle, Dockerfile optimization, and multi-stage builds." },
          { id: "les_3_2", title: "Docker Compose for Multi-Service Applications", duration: "40m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Linking frontend, backend, Redis, and PostgreSQL locally." },
          { id: "les_3_3", title: "Kubernetes Deployments, Pods & Ingress", duration: "1h 20m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Declarative cluster architecture and load balancer ingress." },
          { id: "les_3_4", title: "Automated CI/CD with GitHub Actions", duration: "45m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Automated linting, testing, Docker image push, and AWS rollout." }
        ],
        createdAt: "2026-01-20T14:00:00.000Z",
        updatedAt: "2026-01-20T14:00:00.000Z"
      },
      {
        id: "crs_4",
        title: "Modern UI/UX Design System with Figma",
        slug: "modern-ui-ux-design-figma",
        category: "UI/UX Design",
        level: "Beginner",
        duration: "16 Hours",
        price: 39.99,
        rating: 4.7,
        enrolledCount: 1540,
        thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Learn wireframing, color theory, typography, auto-layout, interactive prototyping, and design token handoff.",
        description: "From napkin sketches to pixel-perfect design systems. Discover how to create modern responsive web and mobile interfaces that captivate users and streamline developer handoff.",
        instructor: {
          name: "Neha Patel",
          title: "Senior Product Designer",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        },
        lessons: [
          { id: "les_4_1", title: "Design Fundamentals: Layout, Contrast & Hierarchy", duration: "25m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Master visual weight, whitespace, and accessibility standards." },
          { id: "les_4_2", title: "Figma Components, Variants & Auto-Layout", duration: "50m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Build scalable reusable components with responsive auto-layout." },
          { id: "les_4_3", title: "Building a Full Design System & Style Guide", duration: "1h 05m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Design tokens for colors, typography scales, shadows, and spacing." },
          { id: "les_4_4", title: "Interactive Prototyping & Micro-animations", duration: "40m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Smart animate, interactive states, and hover effects in Figma." }
        ],
        createdAt: "2026-01-22T09:00:00.000Z",
        updatedAt: "2026-01-22T09:00:00.000Z"
      },
      {
        id: "crs_5",
        title: "Cross-Platform Mobile App Development with React Native",
        slug: "cross-platform-react-native",
        category: "Mobile Development",
        level: "Intermediate",
        duration: "22 Hours",
        price: 54.99,
        rating: 4.8,
        enrolledCount: 820,
        thumbnail: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Build native iOS and Android apps using React Native, Expo, navigation, camera access, and offline storage.",
        description: "One codebase, two platforms. Create high-performance native mobile apps with animations, push notifications, native device APIs, and app store deployment workflows.",
        instructor: {
          name: "Arjun Rao",
          title: "Mobile Tech Lead",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
        },
        lessons: [
          { id: "les_5_1", title: "React Native & Expo Router Setup", duration: "30m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Initialize modern Expo project and configure TypeScript." },
          { id: "les_5_2", title: "Native UI Elements & Flexbox Styling", duration: "45m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "View, Text, Image, FlatList, and platform-specific styling." },
          { id: "les_5_3", title: "Device Sensors, Camera & Permissions", duration: "50m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Accessing location, media library, and camera safely." },
          { id: "les_5_4", title: "Publishing to Apple App Store & Google Play", duration: "40m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "App signing, asset bundling, and EAS Build pipelines." }
        ],
        createdAt: "2026-01-25T11:00:00.000Z",
        updatedAt: "2026-01-25T11:00:00.000Z"
      },
      {
        id: "crs_6",
        title: "Cybersecurity Fundamentals & Ethical Hacking",
        slug: "cybersecurity-ethical-hacking",
        category: "Cybersecurity",
        level: "Beginner",
        duration: "18 Hours",
        price: 44.99,
        rating: 4.9,
        enrolledCount: 1100,
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Learn network security, OWASP Top 10 vulnerabilities, penetration testing tools, and defensive measures.",
        description: "Protect systems against cyber threats. Understand SQL injection, XSS, CSRF, security headers, password hashing algorithms, and vulnerability assessment practices.",
        instructor: {
          name: "Rohan Kapoor",
          title: "Certified Ethical Hacker (CEH)",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
        },
        lessons: [
          { id: "les_6_1", title: "Information Security Principles (CIA Triad)", duration: "25m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Confidentiality, Integrity, and Availability concepts." },
          { id: "les_6_2", title: "OWASP Top 10 Vulnerabilities Explained", duration: "55m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Deep dive into Injection, Broken Authentication, and Sensitive Data Exposure." },
          { id: "les_6_3", title: "Securing Node.js & Web Applications", duration: "45m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "CORS, Helmet, Rate Limiting, and JWT best practices." },
          { id: "les_6_4", title: "Penetration Testing Lab Setup with Kali Linux", duration: "50m", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Setting up virtual testing environments and ethical guidelines." }
        ],
        createdAt: "2026-01-28T16:00:00.000Z",
        updatedAt: "2026-01-28T16:00:00.000Z"
      }
    ],
    enrollments: [
      {
        id: "enr_1",
        userId: "usr_student",
        courseId: "crs_1",
        enrolledAt: "2026-02-01T10:00:00.000Z",
        completedLessons: ["les_1_1", "les_1_2"],
        progress: 33,
        status: "in-progress",
        lastAccessedAt: new Date().toISOString()
      },
      {
        id: "enr_2",
        userId: "usr_student",
        courseId: "crs_2",
        enrolledAt: "2026-02-05T15:30:00.000Z",
        completedLessons: ["les_2_1"],
        progress: 25,
        status: "in-progress",
        lastAccessedAt: new Date().toISOString()
      }
    ]
  };
};

// Read database
export function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database:", err);
    return getInitialData();
  }
}

// Write database
export function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}
