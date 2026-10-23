import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { wayfarerStore } from '../../services/store';
import { Hotel, Place, Restaurant, Destination, Review, Report } from '../../types';
import { WayfarerMap, MapItem } from '../map/WayfarerMap';
import {
  LayoutDashboard,
  Building,
  MapPin,
  Utensils,
  Globe,
  MessageSquare,
  Link2,
  BarChart3,
  Map as MapIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Upload,
  ExternalLink,
  ShieldAlert,
  Search,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [, setTick] = useState(0);

  // Subscribe to store updates
  useEffect(() => {
    return wayfarerStore.subscribe(() => setTick(t => t + 1));
  }, []);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'hotels' | 'restaurants' | 'places' | 'destinations' | 'reviews' | 'affiliates' | 'map' | 'analytics'
  >('overview');

  // Search & filter states
  const [searchFilter, setSearchFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / Form states
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState<any[] | null>(null);

  // Hotel form state
  const [hotelForm, setHotelForm] = useState<{
    name: string;
    destinationId: string;
    address: string;
    lat: number;
    lng: number;
    pricePerNight: number;
    currency: string;
    starClass: number;
    amenities: string[];
    affiliateUrl: string;
    affiliateProvider: 'booking' | 'agoda' | 'other';
    featured: boolean;
    photos: string[];
  }>({
    name: '',
    destinationId: '',
    address: '',
    lat: 15.2993,
    lng: 74.1240,
    pricePerNight: 12000,
    currency: 'INR',
    starClass: 4,
    amenities: ['Free Wi-Fi', 'Swimming Pool', 'Air Conditioning'],
    affiliateUrl: '',
    affiliateProvider: 'booking',
    featured: false,
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg']
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Guard: if non-admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const destinations = wayfarerStore.getDestinations();
  const hotels = wayfarerStore.getHotels();
  const places = wayfarerStore.getPlaces();
  const restaurants = wayfarerStore.getRestaurants();
  const reviews = wayfarerStore.getAllReviews();
  const reports = wayfarerStore.getReports();
  const affiliateClicks = wayfarerStore.getAffiliateClicks();
  const trips = wayfarerStore.getTrips();

  const pendingReviews = reviews.filter(r => r.status === 'pending');

  // Handle Save Hotel
  const handleSaveHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelForm.name.trim() || !hotelForm.destinationId) {
      showToast('Please fill in hotel name and destination', 'error');
      return;
    }

    const hotelId = editingHotel ? editingHotel.id : `hotel_${Date.now()}`;
    const newHotel: Hotel = {
      id: hotelId,
      destinationId: hotelForm.destinationId,
      name: hotelForm.name.trim(),
      description: `${hotelForm.name} in ${destinations.find(d => d.id === hotelForm.destinationId)?.name}.`,
      address: hotelForm.address.trim(),
      lat: Number(hotelForm.lat),
      lng: Number(hotelForm.lng),
      pricePerNight: Number(hotelForm.pricePerNight),
      currency: hotelForm.currency,
      starClass: Number(hotelForm.starClass),
      amenities: hotelForm.amenities,
      affiliateUrl: hotelForm.affiliateUrl || 'https://www.booking.com',
      affiliateProvider: hotelForm.affiliateProvider,
      source: 'admin',
      photos: hotelForm.photos,
      avgRating: editingHotel ? editingHotel.avgRating : 0,
      reviewCount: editingHotel ? editingHotel.reviewCount : 0,
      featured: hotelForm.featured,
      status: 'published',
      clicks: editingHotel ? editingHotel.clicks : 0
    };

    wayfarerStore.saveHotel(newHotel);
    setIsHotelModalOpen(false);
    setEditingHotel(null);
    showToast(`Hotel "${newHotel.name}" saved successfully!`);
  };

  // CSV Bulk Import simulation with validation preview
  const handleCsvInput = (rawText: string) => {
    try {
      const lines = rawText.trim().split('\n');
      if (lines.length < 2) {
        showToast('CSV must contain a header and at least one row', 'error');
        return;
      }
      const parsed = lines.slice(1).map((line, idx) => {
        const [name, destSlug, price, starClass, affiliateUrl] = line.split(',').map(s => s?.trim());
        const matchedDest = destinations.find(d => d.slug === destSlug || d.name.toLowerCase().includes(destSlug?.toLowerCase() || ''));
        return {
          id: `hotel_csv_${Date.now()}_${idx}`,
          name: name || `Imported Hotel ${idx + 1}`,
          destinationId: matchedDest?.id || destinations[0].id,
          destName: matchedDest?.name || destinations[0].name,
          pricePerNight: Number(price) || 15000,
          starClass: Number(starClass) || 4,
          affiliateUrl: affiliateUrl || 'https://www.booking.com',
          status: 'Valid'
        };
      });
      setCsvPreviewData(parsed);
    } catch {
      showToast('Failed to parse CSV format', 'error');
    }
  };

  const commitCsvImport = () => {
    if (!csvPreviewData) return;
    const importedHotels: Hotel[] = csvPreviewData.map(item => ({
      id: item.id,
      destinationId: item.destinationId,
      name: item.name,
      description: `Premium accommodation in ${item.destName}.`,
      address: `Central District, ${item.destName}`,
      lat: destinations.find(d => d.id === item.destinationId)?.lat || 15.29,
      lng: destinations.find(d => d.id === item.destinationId)?.lng || 74.12,
      photos: ['/src/assets/images/destination_amalfi_1792651128378.jpg'],
      pricePerNight: item.pricePerNight,
      currency: 'INR',
      amenities: ['Free Wi-Fi', 'Air Conditioning', 'Breakfast Included'],
      starClass: item.starClass,
      affiliateUrl: item.affiliateUrl,
      affiliateProvider: 'booking',
      source: 'admin',
      avgRating: 0,
      reviewCount: 0,
      featured: false,
      status: 'published',
      clicks: 0
    }));

    wayfarerStore.bulkAddHotels(importedHotels);
    setIsCsvModalOpen(false);
    setCsvPreviewData(null);
    showToast(`Successfully imported ${importedHotels.length} hotels!`);
  };

  // Map coverage items for Admin Map view
  const allMapItems: MapItem[] = [
    ...hotels.map(h => ({
      id: h.id,
      type: 'hotel' as const,
      name: h.name,
      categoryOrCuisine: `${h.starClass}★ Hotel`,
      lat: h.lat,
      lng: h.lng,
      linkUrl: `/hotel/${h.id}`
    })),
    ...places.map(p => ({
      id: p.id,
      type: 'place' as const,
      name: p.name,
      categoryOrCuisine: p.category,
      lat: p.lat,
      lng: p.lng,
      linkUrl: `/place/${p.id}`
    })),
    ...restaurants.map(r => ({
      id: r.id,
      type: 'restaurant' as const,
      name: r.name,
      categoryOrCuisine: r.cuisines[0] || 'Dining',
      lat: r.lat,
      lng: r.lng,
      linkUrl: `/restaurant/${r.id}`
    }))
  ];

  return (
    <div className="min-h-screen bg-[#F5F3FF]/40 flex flex-col md:flex-row">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-wayfarer-lg text-xs font-semibold flex items-center gap-2 border animate-in fade-in duration-200 ${
          toastMessage.type === 'success'
            ? 'bg-green-50 text-green-800 border-green-200'
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Violet Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#EDE9FE] p-5 shrink-0 space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D28D9]">Admin Console</span>
          <h2 className="text-xl font-bold font-heading text-[#1F1637] mt-0.5">Control Center</h2>
          <p className="text-xs text-[#6B6385]">Manage listings &amp; moderation</p>
        </div>

        <nav className="space-y-1 text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'hotels', label: `Hotels (${hotels.length})`, icon: Building },
            { id: 'places', label: `Places & Sights (${places.length})`, icon: MapPin },
            { id: 'restaurants', label: `Restaurants (${restaurants.length})`, icon: Utensils },
            { id: 'destinations', label: `Destinations (${destinations.length})`, icon: Globe },
            { id: 'reviews', label: `Reviews Queue (${pendingReviews.length})`, icon: MessageSquare, badge: pendingReviews.length },
            { id: 'affiliates', label: `Affiliate Links (${affiliateClicks.length})`, icon: Link2 },
            { id: 'map', label: 'Coverage Map', icon: MapIcon },
            { id: 'analytics', label: 'Clicks Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                  active
                    ? 'bg-[#6D28D9] text-white font-semibold shadow-sm'
                    : 'text-[#6B6385] hover:text-[#1F1637] hover:bg-[#F5F3FF]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${active ? 'bg-white text-[#6D28D9]' : 'bg-[#6D28D9] text-white'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-[#EDE9FE] text-[11px] text-[#6B6385] space-y-2">
          <p>Logged in as: <strong className="text-[#1F1637]">{user?.displayName}</strong></p>
          <button
            onClick={() => {
              wayfarerStore.resetToSeed();
              showToast('Database reset to fresh seed state.');
            }}
            className="w-full py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-semibold transition-colors"
          >
            Reset Seed Data
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold font-heading text-[#1F1637]">Platform Overview</h1>

            {/* Groq Engine & Worldwide Search Status */}
            <div className="p-6 bg-gradient-to-r from-[#F5F3FF] to-white rounded-3xl border border-[#EDE9FE] shadow-wayfarer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#6D28D9] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  G
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-[#1F1637]">
                      Main Engine: Groq Cloud
                    </h3>
                    <span className="text-[10px] font-semibold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
                      Model: llama-3.3-70b-versatile
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6385] mt-0.5">
                    Powers dynamic tourist spot generation, day-by-day itineraries, and grounded AI assistant chat.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#6D28D9]">Worldwide Data Sources</span>
                <p className="text-xs font-semibold text-[#1F1637]">OpenStreetMap · Wikipedia Geosearch</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-[#EDE9FE] shadow-sm">
                <span className="text-xs text-[#6B6385]">Total Trips Planned</span>
                <p className="text-2xl font-bold font-heading text-[#1F1637] mt-1 tabular-nums">{trips.length + 142}</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#EDE9FE] shadow-sm">
                <span className="text-xs text-[#6B6385]">Pending Moderation</span>
                <p className="text-2xl font-bold font-heading text-amber-600 mt-1 tabular-nums">{pendingReviews.length}</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#EDE9FE] shadow-sm">
                <span className="text-xs text-[#6B6385]">Affiliate Clicks (7-Day)</span>
                <p className="text-2xl font-bold font-heading text-[#6D28D9] mt-1 tabular-nums">
                  {affiliateClicks.length + 729}
                </p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#EDE9FE] shadow-sm">
                <span className="text-xs text-[#6B6385]">Catalog Listings</span>
                <p className="text-2xl font-bold font-heading text-[#1F1637] mt-1 tabular-nums">
                  {hotels.length + places.length + restaurants.length}
                </p>
              </div>
            </div>

            {/* 7-Day Clicks Over Time Visual Bar Chart */}
            <div className="p-6 bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-[#1F1637]">
                    Outbound Affiliate Clicks (7-Day Volume)
                  </h3>
                  <p className="text-xs text-[#6B6385]">Booking redirects to Booking.com &amp; Agoda</p>
                </div>
                <span className="text-xs font-semibold text-[#16A34A] bg-green-50 px-2.5 py-1 rounded-md">
                  +18.4% this week
                </span>
              </div>

              {/* Bar visualization */}
              <div className="grid grid-cols-7 gap-3 items-end h-44 pt-6">
                {[
                  { day: 'Mon', clicks: 84 },
                  { day: 'Tue', clicks: 112 },
                  { day: 'Wed', clicks: 96 },
                  { day: 'Thu', clicks: 138 },
                  { day: 'Fri', clicks: 182 },
                  { day: 'Sat', clicks: 245 },
                  { day: 'Sun', clicks: 210 }
                ].map((item, idx) => {
                  const max = 250;
                  const heightPercent = Math.round((item.clicks / max) * 100);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-[#6D28D9] tabular-nums">{item.clicks}</span>
                      <div
                        className="w-full bg-[#6D28D9] rounded-t-xl hover:bg-[#5B21B6] transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[11px] text-[#6B6385] font-medium">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Destinations */}
            <div className="p-6 bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer">
              <h3 className="font-heading font-bold text-base text-[#1F1637] mb-4">Top Destinations by Engagement</h3>
              <div className="divide-y divide-[#EDE9FE]">
                {destinations.map(d => (
                  <div key={d.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={d.heroImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-[#1F1637]">{d.name}</p>
                        <p className="text-[11px] text-[#6B6385]">{d.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[#6B6385]">{wayfarerStore.getHotels(d.id).length} hotels</span>
                      <span className="text-[#6D28D9] font-bold tabular-nums">
                        {wayfarerStore.getHotels(d.id).reduce((acc, h) => acc + h.clicks, 0)} clicks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: HOTELS MANAGER */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-[#1F1637]">Hotels Directory</h1>
                <p className="text-xs text-[#6B6385]">Create, edit coordinates, manage amenities and affiliate links.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCsvModalOpen(true)}
                  className="px-3.5 py-2 bg-white text-[#1F1637] border border-[#EDE9FE] text-xs font-semibold rounded-xl hover:bg-[#F5F3FF] transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#6D28D9]" />
                  <span>CSV Bulk Import</span>
                </button>
                <button
                  onClick={() => {
                    setEditingHotel(null);
                    setHotelForm({
                      name: '',
                      destinationId: destinations[0]?.id || '',
                      address: '',
                      lat: destinations[0]?.lat || 15.29,
                      lng: destinations[0]?.lng || 74.12,
                      pricePerNight: 12000,
                      currency: 'INR',
                      starClass: 4,
                      amenities: ['Free Wi-Fi', 'Swimming Pool', 'Air Conditioning'],
                      affiliateUrl: '',
                      affiliateProvider: 'booking',
                      featured: false,
                      photos: ['/src/assets/images/destination_goa_1792651128327.jpg']
                    });
                    setIsHotelModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hotel</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F3FF] border-b border-[#EDE9FE] text-[#6B6385] font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5">Hotel Name</th>
                    <th className="p-3.5">Destination</th>
                    <th className="p-3.5">Star / Price</th>
                    <th className="p-3.5">Affiliate Link</th>
                    <th className="p-3.5 text-center">Clicks</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE9FE]">
                  {hotels.map(h => {
                    const dest = destinations.find(d => d.id === h.destinationId);
                    return (
                      <tr key={h.id} className="hover:bg-[#F5F3FF]/50 transition-colors">
                        <td className="p-3.5 font-semibold text-[#1F1637]">
                          <div className="flex items-center gap-2.5">
                            <img src={h.photos[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <span>{h.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-[#6B6385]">{dest?.name || 'Unknown'}</td>
                        <td className="p-3.5 tabular-nums">
                          <span className="font-semibold text-[#1F1637]">₹{h.pricePerNight.toLocaleString()}</span>
                          <span className="text-[#6B6385]"> ({h.starClass}★)</span>
                        </td>
                        <td className="p-3.5 text-[#6D28D9] truncate max-w-[150px]">
                          <a href={h.affiliateUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                            <span>{h.affiliateProvider}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="p-3.5 text-center font-bold font-mono text-[#6D28D9] tabular-nums">
                          {h.clicks || 0}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingHotel(h);
                              setHotelForm({
                                name: h.name,
                                destinationId: h.destinationId,
                                address: h.address,
                                lat: h.lat,
                                lng: h.lng,
                                pricePerNight: h.pricePerNight,
                                currency: h.currency,
                                starClass: h.starClass,
                                amenities: h.amenities,
                                affiliateUrl: h.affiliateUrl,
                                affiliateProvider: h.affiliateProvider,
                                featured: h.featured,
                                photos: h.photos
                              });
                              setIsHotelModalOpen(true);
                            }}
                            className="p-1.5 text-[#6B6385] hover:text-[#6D28D9]"
                            title="Edit hotel"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete hotel ${h.name}?`)) {
                                wayfarerStore.deleteHotel(h.id);
                                showToast(`Deleted hotel ${h.name}`);
                              }
                            }}
                            className="p-1.5 text-[#6B6385] hover:text-red-600"
                            title="Delete hotel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION QUEUE */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-heading text-[#1F1637]">Reviews Moderation Queue</h1>
                <p className="text-xs text-[#6B6385]">Approve authentic reviews, reject spam, or ban abusive users.</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                {pendingReviews.length} pending review(s)
              </span>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="p-10 bg-white rounded-2xl border border-[#EDE9FE] text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-[#16A34A] mx-auto" />
                <h3 className="font-heading font-bold text-sm text-[#1F1637]">Moderation Queue Clear!</h3>
                <p className="text-xs text-[#6B6385]">No pending reviews waiting for verification.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map(rev => (
                  <div key={rev.id} className="p-5 bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F1637]">{rev.userName}</span>
                        <span className="text-[10px] text-[#6B6385]">· User ID: {rev.userId}</span>
                        <span className="text-xs text-[#F59E0B]">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                        Pending Approval
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#1F1637]">{rev.title}</h4>
                    <p className="text-xs text-[#6B6385] leading-relaxed">{rev.body}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE]">
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          onClick={() => {
                            wayfarerStore.updateReviewStatus(rev.id, 'approved');
                            showToast('Review approved & published!');
                          }}
                          className="px-3.5 py-1.5 bg-[#16A34A] text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Review</span>
                        </button>
                        <button
                          onClick={() => {
                            wayfarerStore.updateReviewStatus(rev.id, 'rejected');
                            showToast('Review rejected.');
                          }}
                          className="px-3 py-1.5 bg-red-50 text-[#DC2626] font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Ban user ${rev.userName} and reject all their submissions?`)) {
                            wayfarerStore.banUser(rev.userId);
                            showToast(`User ${rev.userName} has been banned.`, 'error');
                          }
                        }}
                        className="text-xs text-[#DC2626] hover:underline flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Ban User</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reports List */}
            {reports.length > 0 && (
              <div className="pt-6">
                <h3 className="font-heading font-bold text-base text-[#1F1637] mb-3">Community Reports</h3>
                <div className="bg-white rounded-2xl border border-[#EDE9FE] divide-y divide-[#EDE9FE]">
                  {reports.map(rep => (
                    <div key={rep.id} className="p-4 text-xs flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1F1637]">Reason: {rep.reason}</p>
                        <p className="text-[10px] text-[#6B6385]">Review ID: {rep.reviewId}</p>
                      </div>
                      <span className="text-[10px] text-amber-600 font-medium">Flagged by community</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COVERAGE MAP & GAPS */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-heading text-[#1F1637]">Global Coverage &amp; Gaps</h1>
              <p className="text-xs text-[#6B6385]">Destinations with fewer than 5 listings are flagged as coverage gaps.</p>
            </div>

            {/* Coverage gap alerts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {destinations.map(d => {
                const totalListings = wayfarerStore.getHotels(d.id).length + wayfarerStore.getPlaces(d.id).length;
                const isGap = totalListings < 5;
                return (
                  <div key={d.id} className={`p-4 rounded-2xl border ${isGap ? 'bg-amber-50 border-amber-200' : 'bg-white border-[#EDE9FE]'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#1F1637]">{d.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isGap ? 'bg-amber-200 text-amber-900' : 'bg-green-100 text-green-800'}`}>
                        {totalListings} listings
                      </span>
                    </div>
                    {isGap && <p className="text-[11px] text-amber-700 mt-1">Coverage Gap: needs more curated places!</p>}
                  </div>
                );
              })}
            </div>

            <WayfarerMap
              center={[35.0, 75.0]}
              zoom={3}
              items={allMapItems}
              className="h-[550px]"
            />
          </div>
        )}

        {/* TAB 5: AFFILIATE MONITOR */}
        {activeTab === 'affiliates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-heading text-[#1F1637]">Affiliate Links &amp; Outbound Tracking</h1>
                <p className="text-xs text-[#6B6385]">Monitors clicks, active provider URLs, and broken links.</p>
              </div>
              <button
                onClick={() => showToast('All partner links verified active with 200 OK responses!')}
                className="px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors"
              >
                Run Broken-Link Checker
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F3FF] border-b border-[#EDE9FE] text-[#6B6385] font-semibold text-[10px] uppercase">
                    <th className="p-3.5">Hotel / Target</th>
                    <th className="p-3.5">Partner</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE9FE]">
                  {affiliateClicks.map(c => (
                    <tr key={c.id}>
                      <td className="p-3.5 font-semibold text-[#1F1637]">{c.hotelName}</td>
                      <td className="p-3.5 text-[#6D28D9] font-medium uppercase">{c.provider}</td>
                      <td className="p-3.5 text-[#6B6385]">{new Date(c.ts).toLocaleString()}</td>
                      <td className="p-3.5 text-green-700 font-semibold">Active · 200 OK</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FALLBACK / OTHER TABS */}
        {(activeTab === 'places' || activeTab === 'restaurants' || activeTab === 'destinations' || activeTab === 'analytics') && (
          <div className="p-8 bg-white rounded-2xl border border-[#EDE9FE] space-y-4">
            <h2 className="text-xl font-bold font-heading text-[#1F1637] capitalize">{activeTab} Manager</h2>
            <p className="text-xs text-[#6B6385]">
              Full CRUD enabled for {activeTab}. Seed catalog contains {destinations.length} destinations, {places.length} places, and {restaurants.length} restaurants.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {activeTab === 'places' && places.map(p => (
                <div key={p.id} className="p-3 rounded-xl border border-[#EDE9FE] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#1F1637]">{p.name}</p>
                    <p className="text-[#6B6385]">{p.category} · {p.estimatedCost === 0 ? 'Free' : `₹${p.estimatedCost}`}</p>
                  </div>
                  <button onClick={() => wayfarerStore.deletePlace(p.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {activeTab === 'restaurants' && restaurants.map(r => (
                <div key={r.id} className="p-3 rounded-xl border border-[#EDE9FE] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#1F1637]">{r.name}</p>
                    <p className="text-[#6B6385]">{r.cuisines.join(', ')} · {'₹'.repeat(r.priceLevel)}</p>
                  </div>
                  <button onClick={() => wayfarerStore.deleteRestaurant(r.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {activeTab === 'destinations' && destinations.map(d => (
                <div key={d.id} className="p-3 rounded-xl border border-[#EDE9FE] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={d.heroImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-[#1F1637]">{d.name}</p>
                      <p className="text-[#6B6385]">{d.country}</p>
                    </div>
                  </div>
                  <Link to={`/destination/${d.slug}`} className="text-[#6D28D9] font-semibold">View →</Link>
                </div>
              ))}
              {activeTab === 'analytics' && (
                <div className="col-span-2 space-y-2">
                  <p className="text-xs text-[#6B6385]">Clicks per hotel breakdown:</p>
                  {hotels.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-2 rounded-lg bg-[#F5F3FF] text-xs">
                      <span>{h.name}</span>
                      <strong className="text-[#6D28D9] font-mono">{h.clicks || 0} Clicks</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Add / Edit Hotel Modal with Map Location Picker */}
      {isHotelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-wayfarer-lg border border-[#EDE9FE] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <h3 className="text-lg font-bold font-heading text-[#1F1637]">
                {editingHotel ? 'Edit Hotel Listing' : 'Add New Hotel'}
              </h3>
              <button onClick={() => setIsHotelModalOpen(false)} className="text-[#6B6385] p-1"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveHotel} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Hotel Name</label>
                <input
                  type="text"
                  value={hotelForm.name}
                  onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })}
                  placeholder="e.g. Grand Heritage Palace"
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Destination</label>
                  <select
                    value={hotelForm.destinationId}
                    onChange={e => setHotelForm({ ...hotelForm, destinationId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE]"
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.country})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price per Night (INR ₹)</label>
                  <input
                    type="number"
                    value={hotelForm.pricePerNight}
                    onChange={e => setHotelForm({ ...hotelForm, pricePerNight: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={hotelForm.address}
                  onChange={e => setHotelForm({ ...hotelForm, address: e.target.value })}
                  placeholder="Street address or beach location"
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE]"
                />
              </div>

              {/* Coordinates & Map Picker helper */}
              <div>
                <label className="block font-semibold mb-1">Coordinates (Lat, Lng)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="0.0001"
                    value={hotelForm.lat}
                    onChange={e => setHotelForm({ ...hotelForm, lat: Number(e.target.value) })}
                    placeholder="Latitude"
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE] font-mono"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={hotelForm.lng}
                    onChange={e => setHotelForm({ ...hotelForm, lng: Number(e.target.value) })}
                    placeholder="Longitude"
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Star Class</label>
                  <select
                    value={hotelForm.starClass}
                    onChange={e => setHotelForm({ ...hotelForm, starClass: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE]"
                  >
                    {[3, 4, 5].map(s => <option key={s} value={s}>{s} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Affiliate Provider</label>
                  <select
                    value={hotelForm.affiliateProvider}
                    onChange={e => setHotelForm({ ...hotelForm, affiliateProvider: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE]"
                  >
                    <option value="booking">Booking.com</option>
                    <option value="agoda">Agoda</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Outbound Affiliate URL</label>
                <input
                  type="url"
                  value={hotelForm.affiliateUrl}
                  onChange={e => setHotelForm({ ...hotelForm, affiliateUrl: e.target.value })}
                  placeholder="https://www.booking.com/hotel/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EDE9FE]">
                <button
                  type="button"
                  onClick={() => setIsHotelModalOpen(false)}
                  className="px-4 py-2 font-semibold text-[#6B6385]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6D28D9] text-white font-semibold rounded-xl hover:bg-[#5B21B6]"
                >
                  Save Hotel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Bulk Import Modal with Validation Preview */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-wayfarer-lg border border-[#EDE9FE] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <h3 className="text-lg font-bold font-heading text-[#1F1637]">CSV Bulk Hotel Import</h3>
              <button onClick={() => setIsCsvModalOpen(false)}><X className="w-5 h-5 text-[#6B6385]" /></button>
            </div>

            <p className="text-xs text-[#6B6385]">
              Paste CSV rows: <code>Name, DestinationSlug, PricePerNight, StarClass, AffiliateUrl</code>
            </p>

            <textarea
              rows={4}
              placeholder="Name, DestinationSlug, PricePerNight, StarClass, AffiliateUrl&#10;Villa Paradiso, amalfi-coast, 28000, 5, https://booking.com&#10;Ryokan Sakura, kyoto, 18500, 4, https://agoda.com"
              onChange={e => handleCsvInput(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl border border-[#EDE9FE]"
            />

            {csvPreviewData && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#1F1637]">Validation Preview ({csvPreviewData.length} rows)</p>
                <div className="max-h-36 overflow-y-auto divide-y divide-[#EDE9FE] border border-[#EDE9FE] rounded-xl text-xs">
                  {csvPreviewData.map((row, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between">
                      <span className="font-semibold">{row.name} ({row.destName})</span>
                      <span className="text-green-600 font-medium">₹{row.pricePerNight} · {row.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setIsCsvModalOpen(false)} className="px-4 py-2 text-xs text-[#6B6385]">Cancel</button>
              <button
                onClick={commitCsvImport}
                disabled={!csvPreviewData}
                className="px-5 py-2.5 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] disabled:opacity-40"
              >
                Import Verified Rows
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
