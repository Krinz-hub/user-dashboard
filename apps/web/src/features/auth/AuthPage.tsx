import React, { useState } from 'react';
import { useAuth } from './auth.context';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Terminal } from 'lucide-react';

export function AuthPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('developer@devos.local');
    setPassword('devpass123');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
            <Terminal className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">DevOS</h1>
          <p className="text-xs text-muted-foreground">
            Personal Developer Operating System
          </p>
        </div>

        <Card className="p-6 shadow-md border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {error}
              </div>
            )}

            {isRegister && (
              <Input
                label="Full Name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="developer@devos.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {isRegister && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            <Button size="md" className="w-full" type="submit" isLoading={isLoading}>
              {isRegister ? 'Create Developer Account' : 'Sign In to Workspace'}
            </Button>

            <div className="pt-2 flex flex-col items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="hover:text-foreground underline underline-offset-4"
              >
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
              </button>

              {!isRegister && (
                <button
                  type="button"
                  onClick={fillDemo}
                  className="text-[11px] text-primary hover:underline"
                >
                  Fill Demo Credentials
                </button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
