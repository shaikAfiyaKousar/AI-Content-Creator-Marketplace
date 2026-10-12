import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatorDiscoveryPage from './pages/CreatorDiscoveryPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import CreativeBriefsPage from './pages/CreativeBriefsPage';
import CreateBriefPage from './pages/CreateBriefPage';
import BriefDetailsPage from './pages/BriefDetailsPage';
import BrandDashboard from './pages/BrandDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import MessagingPage from './pages/MessagingPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

// Protected Route Helpers
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to={user.role === 'brand' ? '/dashboard/brand' : '/dashboard/creator'} replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-dark-base dark:text-gray-100 transition-colors selection:bg-brand-500 selection:text-white">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/creators" element={<CreatorDiscoveryPage />} />
                <Route path="/creators/:id" element={<CreatorProfilePage />} />
                <Route path="/briefs" element={<CreativeBriefsPage />} />
                <Route path="/briefs/:id" element={<BriefDetailsPage />} />

                {/* Protected Brand Routes */}
                <Route
                  path="/dashboard/brand"
                  element={
                    <ProtectedRoute requiredRole="brand">
                      <BrandDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/briefs/create"
                  element={
                    <ProtectedRoute requiredRole="brand">
                      <CreateBriefPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Creator Routes */}
                <Route
                  path="/dashboard/creator"
                  element={
                    <ProtectedRoute requiredRole="creator">
                      <CreatorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Common Protected Routes */}
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessagingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <ProfileSettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
