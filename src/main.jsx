import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminModal from './components/AdminModal.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import './index.css';

const { pathname, hash } = window.location;

/**
 * Determine which top-level "page" to render:
 *   - '/admin-login'        → standalone login form
 *   - '/#admin' (or '#admin' hash on any path)
 *                           → standalone protected admin dashboard
 *   - anything else         → public-facing App
 *
 * Keeping admin routes here — at the very root — ensures the public
 * layout (Navbar, hero, footer) is NEVER mounted on admin paths.
 */
const isAdminLoginPath = pathname === '/admin-login';
const isAdminDashboardPath = hash === '#admin' || hash.startsWith('#admin/');

// ---------------------------------------------------------------------------
// Admin dashboard wrapper — shown after a successful login
// ---------------------------------------------------------------------------
function AdminDashboardRoute() {
  const [open, setOpen] = useState(true);

  function handleClose() {
    setOpen(false);
    // Return to the public home page when the admin closes the panel
    window.location.href = '/';
  }

  return (
    <ProductProvider>
      <ProtectedAdminRoute onUnauthenticated={() => { window.location.href = '/admin-login'; }}>
        <AdminModal isOpen={open} onClose={handleClose} />
      </ProtectedAdminRoute>
    </ProductProvider>
  );
}

// ---------------------------------------------------------------------------
// Root render
// ---------------------------------------------------------------------------
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isAdminLoginPath ? (
        // Fully standalone login page — no App shell at all
        <AdminLoginPage
          onLoginSuccess={() => {
            window.location.href = '/#admin';
          }}
        />
      ) : isAdminDashboardPath ? (
        // Fully standalone admin dashboard — no App shell at all
        <AdminDashboardRoute />
      ) : (
        // Public-facing site
        <App />
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
