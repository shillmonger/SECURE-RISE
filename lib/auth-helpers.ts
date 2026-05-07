import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function getUserFromRequest(request: NextRequest) {
  // Try to get user ID from multiple possible cookie names
  const possibleCookies = ["auth-token", "token", "userId", "user-id"];
  
  for (const cookieName of possibleCookies) {
    const token = request.cookies.get(cookieName)?.value;
    if (token) {
      console.log(`Found auth token in cookie: ${cookieName}`);
      try {
        // Check if it's a JWT token (contains dots) or a direct userId
        if (token.includes('.')) {
          // It's a JWT token, decode it to get userId
          const decoded = jwt.decode(token) as any;
          if (decoded && decoded.userId) {
            console.log("Extracted userId from JWT:", decoded.userId);
            return decoded.userId;
          }
        } else {
          // It's a direct userId string
          console.log("Using direct userId:", token);
          return token;
        }
      } catch (error) {
        console.error("Error parsing auth token:", error);
        continue;
      }
    }
  }

  console.log("No auth token found in any cookie");
  return null;
}

export function getAuthCookieName() {
  return "auth-token";
}
