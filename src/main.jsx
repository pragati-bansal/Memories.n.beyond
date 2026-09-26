import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminModal from './components/AdminModal.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient.js';
import './index.css';

/**
 * Routing strategy — purely pathname-based, zero cross-route redirects:
 *
 *   /admin   → AdminRoute (see below) — handles both login and dashboard in one place
 *   *        → public App
 *
 * AdminRoute renders:
 *   - A loading spinner while the Supabase session check is in flight
 *   - <AdminLoginPage>  when unauthenticated  (no redirect to another URL)
 *   - <AdminModal>      when authenticated    (no redirect to another URL)
 *
 * Because both states live at the same pathname (/admin), there are no
 * cross-route redirects and therefore no redirect loops.
 */

// ---------------------------------------------------------------------------
// AdminRoute — single-page auth gate + dashboard for /admin
// ---------------------------------------------------------------------------
function AdminRoute() {
  // 'loading' | 'authenticated' | 'unauthenticated'
  const [authStatus, setAuthStatus] = useState('loading');

  useEffect(() => {
    // If Supabase isn't configured, skip straight to the login form.
    if (!supabase || !isSupabaseConfigured) {
      setAuthStatus('unauthenticated');
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthStatus(session ? 'authenticated' : 'unauthenticated');
    });

    // Keep auth status in sync with session changes.
    // We only need to react to SIGNED_IN and SIGNED_OUT — not every
    // intermediate null-session tick — to avoid spurious state flips.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') setAuthStatus('authenticated');
      if (event === 'SIGNED_OUT') setAuthStatus('unauthenticated');
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Loading ---
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#1a0a0a] flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-[#e8a0a8]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // --- Unauthenticated: show login form inline, same URL, no redirect ---
  if (authStatus === 'unauthenticated') {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          // Auth state listener above will flip status to 'authenticated'
          // automatically after Supabase fires SIGNED_IN — no manual
          // navigation needed.
          setAuthStatus('authenticated');
        }}
      />
    );
  }

  // --- Authenticated: show the admin dashboard ---
  return (
    <ProductProvider>
      <AdminModal
        isOpen
        onClose={() => {
          // Sign out and return to the public home page
          supabase?.auth.signOut().finally(() => {
            window.location.href = '/';
          });
        }}
      />
    </ProductProvider>
  );
}

// ---------------------------------------------------------------------------
// Root render
// ---------------------------------------------------------------------------
const isAdminPath = window.location.pathname === '/admin';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isAdminPath ? <AdminRoute /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>
);
