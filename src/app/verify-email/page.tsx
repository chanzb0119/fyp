// src/app/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          router.push('/login?message=Email verified successfully! Please log in.');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setError(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">Email Verification</h2>
        </CardHeader>
        <CardContent>
          {status === 'verifying' && (
            <Alert>
              <AlertDescription>Verifying your email...</AlertDescription>
            </Alert>
          )}
          {status === 'success' && (
            <Alert>
              <AlertDescription>
                Email verified successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}
          {status === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}