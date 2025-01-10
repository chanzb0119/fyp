"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home } from 'lucide-react';
import GoogleIcon from './google';
import { signIn, useSession } from 'next-auth/react';

const Login = () => {
  const router = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      router.push('/');
    }
  }, [status, router]);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="mb-8 flex items-center space-x-2">
        <Home className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold text-gray-900">Rental Platform</span>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-semibold text-center">Welcome back</h2>
          <p className="text-sm text-gray-500 text-center">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
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
    </div>
  );
};

export default Login;