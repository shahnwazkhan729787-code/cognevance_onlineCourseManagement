import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "cognevance_super_secret_jwt_key_2026";

// Generate JWT token
export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Verify token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Extract user from request headers (Authorization: Bearer ...) or cookie
export function getUserFromRequest(request) {
  try {
    // 1. Check Authorization header
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    // 2. Fallback to cookie
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(";").map((c) => {
            const [k, ...v] = c.trim().split("=");
            return [k, v.join("=")];
          })
        );
        token = cookies["token"];
      }
    }

    if (!token) return null;
    return verifyToken(token);
  } catch (err) {
    console.error("Auth extraction error:", err);
    return null;
  }
}

// Hash password
export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

// Compare password
export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}
