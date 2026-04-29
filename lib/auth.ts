import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export interface AuthUser {
  userId: string;
  email: string;
  role: string[];
}

export const getAuthUser = async (request: NextRequest): Promise<AuthUser | null> => {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
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
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth-page/login',
  },
};
