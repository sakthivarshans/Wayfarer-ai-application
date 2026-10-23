import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { HomePage } from './features/destinations/HomePage';
import { DestinationPage } from './features/destinations/DestinationPage';
import { HotelDetailPage } from './features/hotels/HotelDetailPage';
import { PlaceDetailPage } from './features/places/PlaceDetailPage';
import { RestaurantDetailPage } from './features/restaurants/RestaurantDetailPage';
import { TripPlannerPage } from './features/itinerary/TripPlannerPage';
import { TripResultsPage } from './features/itinerary/TripResultsPage';
import { ItineraryViewPage } from './features/itinerary/ItineraryViewPage';
import { MyTripsPage } from './features/itinerary/MyTripsPage';
import { TelegramSetupPage } from './features/telegram/TelegramSetupPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { AIAssistantDrawer } from './features/assistant/AIAssistantDrawer';

import { NearMePage } from './features/destinations/NearMePage';

function AppLayout() {
  const location = useLocation();

  // Extract destination context if viewing a destination or trip
  let currentDestName: string | undefined;
  if (location.pathname.includes('amalfi')) currentDestName = 'Amalfi Coast';
  else if (location.pathname.includes('kyoto')) currentDestName = 'Kyoto';
  else if (location.pathname.includes('goa')) currentDestName = 'Goa';

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1F1637] font-sans">
      <Header />

      <div className="flex-1 pb-16 md:pb-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/destination/:countryCode/:geoId" element={<DestinationPage />} />
          <Route path="/destination/:slug" element={<DestinationPage />} />
          <Route path="/nearme" element={<NearMePage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/place/:id" element={<PlaceDetailPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/trip/share/:shareId" element={<ItineraryViewPage isReadOnlyShared={true} />} />

          {/* Signed-in / Planner Routes */}
          <Route path="/plan" element={<TripPlannerPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/trips/:id" element={<TripResultsPage />} />
          <Route path="/trips/:id/itinerary" element={<ItineraryViewPage />} />
          <Route path="/telegram" element={<TelegramSetupPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {/* Footer on non-admin screens */}
      {!isAdminRoute && <Footer />}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Floating On-Site AI Assistant Drawer */}
      <AIAssistantDrawer currentDestinationName={currentDestName} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
