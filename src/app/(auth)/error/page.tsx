// src/app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-center">Authentication Error</h2>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            {error === 'OAuthSignin' && 'An error occurred during sign in. Please try again.'}
            {error === 'OAuthCallback' && 'An error occurred during the callback. Please try again.'}
            {error === 'OAuthCreateAccount' && 'Could not create user account. Please try again.'}
            {error === 'EmailCreateAccount' && 'Could not create user account. Email might be already registered.'}
            {error === 'Callback' && 'An error occurred during the authentication. Please try again.'}
            {!error && 'An unknown error occurred. Please try again.'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/login">
            <Button variant="default">
              Return to Login
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Go to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}