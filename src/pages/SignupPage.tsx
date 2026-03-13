import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle } from
'../components/ui/Card';
import { signup } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AlertCircle } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const { saveUser } = useAuth();
  useTheme(); // Initialize theme hook
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup(name, email, password);
      if (response.success && response.user) {
        saveUser(response.user);
        navigate('/');
      } else {
        setError(response.error || 'Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mesh-gradient p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4 shadow-lg">
            SS
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Section Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            Create your account to get started
          </p>
        </div>

        <Card className="glass-strong border-border/50 shadow-2xl">
          <form onSubmit={handleSignup}>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Join our community and start building today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full border border-border"
                onClick={() => {
                  saveUser({
                    id: 'demo-1',
                    name: 'Demo User',
                    email: 'demo@example.com',
                    initials: 'DU'
                  });
                  navigate('/');
                }}
              >
                Demo Login (Skip)
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>);
}
