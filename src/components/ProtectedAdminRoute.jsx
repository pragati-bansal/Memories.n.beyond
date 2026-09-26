import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * ProtectedAdminRoute — wraps any admin-only content.
 *
 * Usage:
 *   <ProtectedAdminRoute onUnauthenticated={() => navigateTo('/admin-login')}>
 *     <AdminDashboard />
 *   </ProtectedAdminRoute>
 *
 * Behaviour:
 *  - Shows a loading spinner while the session check is in flight.
 *  - If a valid Supabase session exists → renders children.
 *  - If no session exists → calls onUnauthenticated() and renders nothing.
 *  - Never calls onUnauthenticated() when the user is already on /admin-login,
 *    which would cause an infinite redirect loop.
 */

/**
 * Safely invoke onUnauthenticated only when the visitor is NOT already on
 * the login page — prevents the infinite /admin-login → /admin-login loop.
 */
function redirectIfNotOnLoginPage(onUnauthenticated) {
  if (window.location.pathname !== '/admin-login') {
    onUnauthenticated?.();
  }
}

export default function ProtectedAdminRoute({ children, onUnauthenticated }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setStatus('unauthenticated');
      redirectIfNotOnLoginPage(onUnauthenticated);
      return;
    }

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
        redirectIfNotOnLoginPage(onUnauthenticated);
      }
    });

    // React to auth state changes, but only redirect on an explicit sign-out
    // event — not on every null-session tick (which fires during the login
    // flow itself and would cause a redirect before the user finishes logging in).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
        // Only redirect on explicit sign-out, not on intermediate null states
        // (e.g. INITIAL_SESSION with no session, or mid-login token exchange).
        if (event === 'SIGNED_OUT') {
          redirectIfNotOnLoginPage(onUnauthenticated);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [onUnauthenticated]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#1a0a0a] flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-[#e8a0a8]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
