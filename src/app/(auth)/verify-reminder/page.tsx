// src/app/(auth)/verify-reminder/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function VerificationReminder() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
    if (!email || resendStatus === 'sending') return;
    
    setResendStatus('sending');
    setError('');

    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resend verification email');
      }

      setResendStatus('success');
    } catch (error) {
      console.error('Resend error:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend verification email');
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-semibold text-center">Check Your Email</h2>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            We&apos;ve sent a verification link to:
          </p>
          <p className="font-medium text-gray-900">{email}</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Please check your email and click the verification link to activate your account.
              The link will expire in 24 hours.
            </p>
          </div>
          <div className="space-y-2">
            
            {/* TODO: Add resend verification email functionality */}
            <div className="space-y-2">
            <p className="text-sm text-gray-500">
                Didn&apos;t receive the email?
            </p>
            <p className="text-sm text-gray-500">
                • Check your spam folder
            </p>
            {resendStatus === 'success' ? (
                <p className="text-sm text-green-600">
                Verification email resent successfully!
                </p>
            ) : (
                <Button 
                variant="link" 
                className="text-blue-600 hover:text-blue-800"
                onClick={handleResendVerification}
                disabled={resendStatus === 'sending'}
                >
                {resendStatus === 'sending' 
                    ? 'Sending...' 
                    : 'Click here to resend'}
                </Button>
            )}
            {error && (
                <p className="text-sm text-red-600">
                {error}
                </p>
            )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login">
            <Button variant="outline">
              Return to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}