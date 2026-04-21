import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { AuthProvider } from './context/AuthContext';
import PlaceDetails from './Pages/PlaceDetails';
import Explore from './Pages/Explore';
import Planning from './Pages/Planning';
import Comments from './Pages/Comments';
import Dashboard from './Pages/Dashboard/Dashboard';
import Favorites from './Pages/Dashboard/Favorites';
import BookingRequests from './Pages/Dashboard/BookingRequests';
import MyBookings from './Pages/Dashboard/MyBookings';
import MyServices from './Pages/Dashboard/MyServices';
import Profile from './Pages/Dashboard/Profile';
import ProviderProfile from './Pages/ProviderProfile';
import Images from './Pages/Dashboard/Images';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page – shown first when opening the app */}
          <Route path="/" element={<LandingPage />} />

          {/* Main app routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/place/:id/comments" element={<Comments />} />
          <Route path="/provider" element={<ProviderProfile />} />
          <Route path="/provider/:type/:id" element={<ProviderProfile />} />
          <Route path="/comments/:id" element={<Comments />} />

          {/* Protected Dashboard Routes */}
          {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/dashboard/bookings" element={<ProtectedRoute><BookingRequests /></ProtectedRoute>} />
          <Route path="/dashboard/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard/services" element={<ProtectedRoute><MyServices /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/favorites" element={<Favorites />} />
          <Route path="/dashboard/bookings" element={<BookingRequests />} />
          <Route path="/dashboard/my-bookings" element={<MyBookings />} />
          <Route path="/dashboard/services" element={<MyServices />} />
          <Route path="/dashboard/settings" element={<Profile />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/images" element={<Images />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
