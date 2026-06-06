import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { MainLayout } from './components/layout/MainLayout';
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
import { FreightDetails } from './pages/FreightDetails';

import { AuthModal } from './components/layout/AuthModal';
import { isAdminUser } from './auth/admin';

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

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, setAuthModalOpen } = useAppStore();

  React.useEffect(() => {
    if (!user) {
      setAuthModalOpen(true);
    }
  }, [user, setAuthModalOpen]);

  if (!user) return <Navigate to="/" replace />;
  if (!isAdminUser(user)) return <Navigate to="/explore" replace />;
  return <>{children}</>;
}

export default function App() {
  const initialize = useAppStore((state) => state.initialize);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <AuthModal />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={
            <Explore />
          } />
          <Route path="/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
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
          <Route path="/freight/:id" element={
            <ProtectedRoute>
              <FreightDetails />
            </ProtectedRoute>
          } />
          <Route path="/publish" element={
            <ProtectedRoute>
              <PublishRide />
            </ProtectedRoute>
          } />
          <Route path="/ride/:id/edit" element={
            <ProtectedRoute>
              <PublishRide />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/help" element={<HelpPage />} />
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

