import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard'>(() => {
    return localStorage.getItem("orbdyn_auth_token") ? "dashboard" : "landing";
  });
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleNavigateToAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleAuthSuccess = () => {
    localStorage.setItem("orbdyn_auth_token", "true");
    setCurrentPage('dashboard');
  };

  const handleSignOut = () => {
    localStorage.removeItem("orbdyn_auth_token");
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen font-sans antialiased text-slate-200">
      {currentPage === 'landing' && (
        <LandingPage
          onGetStarted={() => handleNavigateToAuth('signup')}
          onSignIn={() => handleNavigateToAuth('signin')}
        />
      )}

      {currentPage === 'auth' && (
        <AuthPage
          initialMode={authMode}
          onBack={() => setCurrentPage('landing')}
          onSuccess={handleAuthSuccess}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          onSignOut={handleSignOut}
        />
      )}
    </div>
  )
}

export default App
