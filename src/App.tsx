import { useState } from 'react'
import LandingPage from './components/LandingPage'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard'>('landing');

  return (
    <div className="min-h-screen font-sans antialiased text-slate-200">
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentPage('auth')} />
      )}

      {currentPage === 'auth' && (
        <div className="flex items-center justify-center min-h-screen bg-[#020617]">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Sign In coming soon</h2>
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-blue-500 hover:underline font-medium"
            >
              Go back to landing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
