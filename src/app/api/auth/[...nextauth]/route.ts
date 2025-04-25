/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/services/auth';
import { Session } from 'next-auth';
import { supabase } from '@/lib/supabase/client';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          const user = await authService.verifyCredentials(
            credentials.email,
            credentials.password
          );

          return {
            id: user.user_id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profile_image
          };
        } catch (error: any) {
            if (error.message === 'Please verify your email before logging in') {
              throw new Error('Please verify your email before logging in');
            }
            throw new Error('Invalid email or password');
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Check if user already exists
          const { data: existingUser } = await supabase
            .from('user')
            .select('*')
            .eq('email', user.email)
            .maybeSingle()

          if (existingUser) {
            // If user exists but was created with email/password
            if (!existingUser.google_id) {
              // Update user to link Google account
              const { error: updateError } = await supabase
                .from('user')
                .update({
                  google_id: user.id,
                  email_verified: true, // Mark as verified since Google account is verified
                  updated_at: new Date().toISOString(),
                })
                .eq('email', user.email);

              if (updateError) throw updateError;
            }
            return true;
          }
          
          // If user doesn't exist, create new user
          const { error: createError } = await supabase
            .from('user')
            .insert({
              user_id: user.id,
              email: user.email,
              name: user.name,
              google_id: user.id,
              role: 'user',
              email_verified: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (createError) throw createError;
          } catch (error) {
            console.error('Error in Google sign in:', error);
            return false;
          }
        }
        return true;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (session?.user) {
        // Get user from database
        const { data: user } = await supabase
          .from('user')
          .select('*')
          .or(`email.eq.${session.user.email},google_id.eq.${token.sub}`)
          .single();

        if (user) {
          session.user.id = user.user_id;
          session.user.role = user.role;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, 
  },
});

export { handler as GET, handler as POST };
