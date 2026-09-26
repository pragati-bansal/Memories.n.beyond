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
 * AdminRoute — handles session verification and renders the admin dashboard or login page.
 *
 * Rules:
 * - loading state explicitly initialized to true
 * - session state explicitly initialized to null
 * - Checks supabase.auth.getSession() on mount and sets up onAuthStateChange listener
 * - Shows loading spinner while loading is true
 * - If session is null after loading, explicitly renders <AdminLoginPage />
 * - Only renders the admin dashboard (<AdminModal />) if session exists
 */
function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setSession(null);
      setLoading(false);
      return;
    }

    // Retrieve active session on mount
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setLoading(false);
    }).catch(() => {
      setSession(null);
      setLoading(false);
    });

    // Listen for auth state transitions (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (newSession) {
        setSession(newSession);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 1. While loading is true, return a clean loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0a0a] flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-[#e8a0a8]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // 2. If session is null after loading, explicitly render AdminLoginPage
  if (!session) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          if (!supabase || !isSupabaseConfigured) return;
          supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            if (currentSession) {
              setSession(currentSession);
            }
          });
        }}
      />
    );
  }

  // 3. Only render the admin dashboard if session exists
  return (
    <ProductProvider>
      <AdminModal
        isOpen
        onClose={() => {
          window.location.href = '/';
        }}
      />
    </ProductProvider>
  );
}

// ---------------------------------------------------------------------------
// Root render
// ---------------------------------------------------------------------------
const isAdminPath =
  window.location.pathname === '/admin' ||
  window.location.pathname === '/admin-login' ||
  window.location.hash === '#admin' ||
  window.location.hash.startsWith('#admin');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isAdminPath ? <AdminRoute /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>
);
