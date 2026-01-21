import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleNavigateToAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setCurrentPage('auth');
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
          onSuccess={() => setCurrentPage('dashboard')}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          onSignOut={() => setCurrentPage('landing')}
        />
      )}
    </div>
  )
}

export default App
