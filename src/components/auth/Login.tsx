"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import GoogleIcon from './google';
import { signIn } from 'next-auth/react';

const Login = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', {
        callbackUrl: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error('Google login error:', error);
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
          <h2 className="text-2xl font-semibold text-center">Welcome</h2>
          <p className="text-sm text-gray-500 text-center">
            Sign in to access your account
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full h-12 px-6 transition-colors duration-150 border rounded-lg focus:shadow-outline hover:bg-gray-50"
          >
            <GoogleIcon />
            <span className="ml-4">Continue with Google</span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="px-8 text-center text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-blue-600">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-blue-600">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;