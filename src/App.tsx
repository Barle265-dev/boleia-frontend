import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Explore } from './pages/Explore';
import { PublishRide } from './pages/PublishRide';
import { RideDetails } from './pages/RideDetails';
import { Profile } from './pages/Profile';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { UsersPage } from './pages/UsersPage';
import { MyRides } from './pages/MyRides';
import { MessagesPage } from './pages/MessagesPage';
import { HelpPage } from './pages/HelpPage';
import { RequestCarPage } from './pages/RequestCarPage';

import { AuthModal } from './components/layout/AuthModal';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, setAuthModalOpen } = useAppStore();

  React.useEffect(() => {
    if (!user) {
      setAuthModalOpen(true);
    }
  }, [user, setAuthModalOpen]);

  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthModal />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <Explore />
          } />
          <Route path="/community" element={<UsersPage />} />
          <Route path="/my-rides" element={
            <ProtectedRoute>
              <MyRides />
            </ProtectedRoute>
          } />
          <Route path="/pedir-carro" element={
            <RequestCarPage />
          } />
          <Route path="/publish" element={
            <ProtectedRoute>
              <PublishRide />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          } />
          <Route path="/ride/:id" element={<RideDetails />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

