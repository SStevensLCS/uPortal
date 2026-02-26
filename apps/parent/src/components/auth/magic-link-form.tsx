'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { magicLinkSchema, type MagicLinkInput } from '@admissions-compass/shared';
import { Button, Input, Label } from '@admissions-compass/ui';
import { createClient } from '@/lib/supabase/client';

export function MagicLinkForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: MagicLinkInput) {
    setError(null);
    setIsSuccess(false);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/v1/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <div className="rounded-md bg-primary/10 p-4 text-center">
        <p className="text-sm font-medium text-primary">
          Check your email for a login link
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          We sent a magic link to your email address. Click the link to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="magic-link-email">Email</Label>
        <Input
          id="magic-link-email"
          type="email"
          placeholder="parent@example.com"
          autoComplete="email"
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending link...' : 'Send Magic Link'}
      </Button>
    </form>
  );
}
