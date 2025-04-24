'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Create a client component that uses useSearchParams
function VerificationContent() {
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
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus('success');
          setTimeout(() => {
            router.push('/login?message=Email verified successfully! Please log in.');
          }, 3000);
        } else {
          const data = await response.json();
          setStatus('error');
          setError(data.error || 'Verification failed');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setStatus('error');
        setError('An error occurred during verification');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
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
  );
}

// Main page component with Suspense boundary
export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="p-4 text-center">
            <p>Loading verification page...</p>
          </CardContent>
        </Card>
      }>
        <VerificationContent />
      </Suspense>
    </div>
  );
}