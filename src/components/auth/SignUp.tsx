"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home } from 'lucide-react';
import GoogleIcon from './google';
import { signIn } from 'next-auth/react';
import { authService } from '@/services/auth';

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleGoogleSignUp = async () => {
    try {
      await signIn('google', {
        callbackUrl: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Failed to sign up with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await authService.signUpWithEmail({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });

      router.push(`/verify-reminder?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
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
          <h2 className="text-2xl font-semibold text-center">Create an Account</h2>
          <p className="text-sm text-gray-500 text-center">
            Sign up to start your property search
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleSignUp}
            className="w-full h-12"
          >
            <GoogleIcon />
            <span className="ml-4">Continue with Google</span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="px-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-blue-600 hover:underline"
            >
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;