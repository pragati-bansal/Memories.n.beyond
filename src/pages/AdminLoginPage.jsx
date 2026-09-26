import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { logger } from '../lib/logger';

const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();

/**
 * AdminLoginPage — rendered inline at /admin when the user is unauthenticated.
 * Authenticates via Supabase and optionally checks configured admin whitelist email.
 */
export default function AdminLoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already authenticated as the correct admin, skip straight to dashboard
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      const userEmail = session.user?.email?.trim().toLowerCase();
      const isEmailRestricted = configuredAdminEmail && configuredAdminEmail !== 'your-email@example.com';
      if (!isEmailRestricted || userEmail === configuredAdminEmail) {
        onLoginSuccess();
      }
    });
  }, [onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase is not configured. Check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Attempt sign-in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        logger.warn('AdminLoginPage', 'Sign-in failed', signInError);
        setError(signInError.message || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      // Step 2: Whitelist check — only enforce if a valid, non-placeholder admin email is configured
      const userEmail = data.user?.email?.trim().toLowerCase();
      const isEmailRestricted = configuredAdminEmail && configuredAdminEmail !== 'your-email@example.com';

      if (isEmailRestricted && userEmail !== configuredAdminEmail) {
        logger.warn('AdminLoginPage', 'Unauthorised login attempt', { email: data.user?.email });
        await supabase.auth.signOut();
        setError(`Access denied. Account "${data.user?.email}" is not authorized.`);
        setLoading(false);
        return;
      }

      logger.info('AdminLoginPage', 'Admin authenticated successfully');
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      logger.error('AdminLoginPage', 'Unexpected error during sign-in', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      {/* Soft decorative blobs matching the site palette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blush/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blush-deep/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-rose/10 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-paper border border-blush-deep/40 rounded-3xl p-8 shadow-craft-modal">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blush border border-blush-deep mb-4 shadow-craft-soft">
              <svg
                className="w-7 h-7 text-burgundy"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <h1 className="font-serif text-2xl font-bold text-burgundy-deep tracking-tight">
              Admin Portal
            </h1>
            <p className="mt-1.5 text-sm text-ink-soft">
              Restricted access — authorised personnel only
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-rose/10 border border-rose rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-rose-deep mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-rose-deep font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-ink mb-1.5">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-cream border border-blush-deep rounded-xl px-4 py-3 text-ink placeholder-ink/30 text-sm outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/15 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-ink mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream border border-blush-deep rounded-xl px-4 py-3 pr-11 text-ink placeholder-ink/30 text-sm outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-burgundy transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-2 bg-gradient-to-r from-burgundy to-burgundy-light hover:from-burgundy-deep hover:to-burgundy disabled:opacity-50 disabled:cursor-not-allowed text-cream font-semibold py-3 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-craft-soft hover:shadow-craft-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-xs text-ink/30">
              This page is not indexed or linked publicly.
            </p>
            <a
              href="/"
              className="inline-block text-xs font-semibold text-burgundy/70 hover:text-burgundy transition-colors"
            >
              &larr; Return to Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
