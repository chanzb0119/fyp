'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

// Dynamically import the GoogleIcon component
const GoogleIcon = dynamic(() => import('@/components/auth/google'), { ssr: false });

// Separate the Login component that uses client-side hooks
function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Use proper imports instead of require
  const searchParams = useSearchParams();
  const { status } = useSession();
  const router = useRouter();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push('/');
    }
  }, [status, router]);

  // Show success message from URL params (e.g., after signup)
  const message = searchParams.get('message');

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', {
        callbackUrl: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to login with Google');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-semibold text-center">Welcome back</h2>
        <p className="text-sm text-gray-500 text-center">
          Sign in to your account
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {message && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md">
            {message}
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <a 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={handleGoogleLogin}
          className="w-full h-12"
        >
          <GoogleIcon />
          <span className="ml-4">Continue with Google</span>
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a 
            href="/signup" 
            className="text-blue-600 hover:underline"
          >
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

// Main page component with Suspense boundary
export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="mb-8 flex items-center space-x-2">
        <Home className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold text-gray-900">Rental Platform</span>
      </div>
      
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="p-4 text-center">
            <p>Loading login page...</p>
          </CardContent>
        </Card>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}