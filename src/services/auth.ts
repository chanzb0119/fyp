// src/services/auth.ts
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const authService = {
  async signUpWithEmail(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<UserProfile> {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user')
      .select('email')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser: Partial<UserProfile> = {
      user_id: uuidv4(),
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: false,
      verification_token: verificationToken,
      verification_token_expires: tokenExpires.toISOString(),
    };

    const { data, error } = await supabase
      .from('user')
      .insert(newUser)
      .select()
      .single();

    if (error) throw error;

    // Send verification email using API route
    const response = await fetch('/api/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        token: verificationToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send verification email');
    }
    
    return data;
  },

  async verifyEmail(token: string): Promise<boolean> {
    const { data: user, error } = await supabase
      .from('user')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (error || !user) {
      throw new Error('Invalid verification token');
    }

    if (new Date(user.verification_token_expires) < new Date()) {
      throw new Error('Verification token has expired');
    }

    const { error: updateError } = await supabase
      .from('user')
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expires: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.user_id);

    if (updateError) throw updateError;
    return true;
  },

  async verifyCredentials(email: string, password: string): Promise<UserProfile> {
    const { data: user, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    if (!user.email_verified) {
      throw new Error('Please verify your email before logging in');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return user;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  },

  async getUserProfileWithEmail(email: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }
};