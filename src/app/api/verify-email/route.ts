// src/app/api/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    const verified = await authService.verifyEmail(token);
    
    if (verified) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }
  } catch (error) {
    console.error('Email verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify email';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}