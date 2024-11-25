// src/app/api/resend-verification/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Get user and check if already verified
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.email_verified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24);

    // Update user with new token
    const { error: updateError } = await supabase
      .from('user')
      .update({
        verification_token: verificationToken,
        verification_token_expires: tokenExpires.toISOString(),
      })
      .eq('user_id', user.user_id);

    if (updateError) {
      throw updateError;
    }

    // Send new verification email
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-verification-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        token: verificationToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send verification email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resending verification:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}