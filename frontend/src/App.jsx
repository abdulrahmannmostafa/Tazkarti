import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';

// Admin Pages
import UserManagement from './pages/admin/UserManagement';

// Manager Pages
import CreateMatch from './pages/manager/CreateMatch';
import EditMatch from './pages/manager/EditMatch';
import CreateStadium from './pages/manager/CreateStadium';
import MatchSeats from './pages/manager/MatchSeats';

// Fan Pages
import Profile from './pages/fan/Profile';
import SeatSelection from './pages/fan/SeatSelection';
import Checkout from './pages/fan/Checkout';
import ReservationConfirmation from './pages/fan/ReservationConfirmation';
import MyReservations from './pages/fan/MyReservations';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/:id" element={<MatchDetail />} />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="/manager/matches/create"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <CreateMatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/matches/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <EditMatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/stadiums/create"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <CreateStadium />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/matches/:id/seats"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <MatchSeats />
                </ProtectedRoute>
              }
            />

            {/* Fan Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['fan']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matches/:id/seats"
              element={
                <ProtectedRoute allowedRoles={['fan']}>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={['fan']}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirmation"
              element={
                <ProtectedRoute allowedRoles={['fan']}>
                  <ReservationConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reservations"
              element={
                <ProtectedRoute allowedRoles={['fan']}>
                  <MyReservations />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
