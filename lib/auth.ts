import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { ObjectId } from 'mongodb';

export interface AuthUser {
  userId: string;
  email: string;
  role: string[];
}

export const getAuthUser = async (request: NextRequest): Promise<AuthUser | null> => {
  try {
    // First try custom auth-token
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    }

    // If no custom token, try NextAuth session by making a request to session endpoint
    // This is a fallback for Google OAuth users
    try {
      const sessionUrl = `${process.env.NEXTAUTH_URL}/api/auth/session`;
      const sessionResponse = await fetch(sessionUrl, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (sessionResponse.ok) {
        const session = await sessionResponse.json();
        if (session?.user?.id && session?.user?.email) {
          // Get user from database to get role
          const { connectToDatabase } = await import('./mongodb');
          const db = await connectToDatabase();
          const usersCollection = db.collection('users');
          
          const user = await usersCollection.findOne({ 
            _id: new ObjectId(session.user.id) 
          });

          if (user) {
            return {
              userId: user._id.toString(),
              email: user.email,
              role: user.role
            };
          }
        }
      }
    } catch (sessionError) {
      console.error('Session fallback error:', sessionError);
    }

    return null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { connectToDatabase } = await import('@/lib/mongodb');
          const db = await connectToDatabase();
          const usersCollection = db.collection('users');

          const user = await usersCollection.findOne({ email: credentials.email });
          
          if (!user) {
            return null;
          }

          const bcrypt = await import('bcryptjs');
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username || user.fullName,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth-page/login',
    error: '/auth-page/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const { connectToDatabase } = await import('@/lib/mongodb');
          const db = await connectToDatabase();
          const usersCollection = db.collection('users');

          // Check if user already exists
          const existingUser = await usersCollection.findOne({ email: user.email });

          if (!existingUser) {
            // New user - create account with welcome bonus
            const { createDefaultUser } = await import('@/lib/models/User');
            const bcrypt = await import('bcryptjs');
            
            // Generate a random password for Google users
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 12);

            // Generate username from email or Google name
            const username = user.name?.split(' ')[0] || user.email?.split('@')[0] || 'user';
            
            // Create user with default values
            const userData = createDefaultUser({
              username,
              email: user.email!,
              password: hashedPassword
            });

            // Add Google profile image if available
            if (user.image) {
              userData.profileImage = user.image;
            }

            const result = await usersCollection.insertOne({
              ...userData,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            // Send welcome email
            try {
              const { sendWelcomeEmail } = await import('@/lib/email');
              await sendWelcomeEmail(user.email!, username);
            } catch (emailError) {
              console.error('Failed to send welcome email:', emailError);
            }

            // Store user ID in the user object for later use
            user.id = result.insertedId.toString();
          } else {
            // Existing user - just return their ID
            user.id = existingUser._id.toString();
          }

          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
