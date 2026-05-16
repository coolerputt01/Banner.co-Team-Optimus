import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import Splash from './pages/Splash'
import AuthCallback from './pages/AuthCallback'
import Feed from './pages/Feed'
import UserProfile from './pages/UserProfile'
import Settings from './pages/Settings'
import CreateAd from './pages/CreateAd'
import NewCampaign from './pages/NewCampaign'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Splash />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Semi-public: guests can browse, auth required for actions */}
              <Route path="/feed" element={<Feed />} />

              {/* Protected */}
              <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/create-ad" element={<ProtectedRoute><CreateAd /></ProtectedRoute>} />
              <Route path="/campaigns/new" element={<ProtectedRoute><NewCampaign /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
