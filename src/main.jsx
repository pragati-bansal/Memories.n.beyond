import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import './index.css';

const isAdminLoginPath = window.location.pathname === '/admin-login';

// Redirect to home after successful login from the standalone /admin-login page
function handleAdminLoginSuccess() {
  window.location.href = '/#admin';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isAdminLoginPath ? (
        <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
      ) : (
        <App />
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
