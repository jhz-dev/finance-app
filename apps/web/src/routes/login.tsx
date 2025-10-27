
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/domain/auth/auth.store';
import { authRepository } from '@/infrastructure/ApiAuthRepository';
import { isAxiosError } from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { LanguageSelector } from '@/components/LanguageSelector';

import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => authRepository.login({ email, password }),
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      navigate({ to: '/' });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setErrorMessage(error.response?.data.message || t('Login failed.'));
      } else {
        setErrorMessage(t('An unexpected error occurred.'));
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    mutation.mutate();
  };

  return (
    <form className="flex flex-col items-center gap-4 w-[100%]" onSubmit={handleSubmit}>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{t('Login')}</CardTitle>
          <CardDescription>
            {t('Enter your email below to login to your account.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>{t('Error')}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">{t('Email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('Password')}</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="grid gap-2">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? t('Signing in...') : t('Sign in')}
          </Button>
          <div className="gap-2">
            <LanguageSelector />
          </div>
          <span className="mt-4 text-center text-sm">
            {t("Don't have an account?")}{' '}
            <Link to="/register" className="underline">
              {t('Sign up')}
            </Link>
          </span>
        </CardFooter>
      </Card>
    </form>
  );
}
