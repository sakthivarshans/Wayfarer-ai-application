import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wayfarerStore } from '../../services/store';
import { wayfarerApi } from '../../services/api';
import { RatingDisplay } from '../../components/common/RatingDisplay';
import { WayfarerMap, MapItem } from '../map/WayfarerMap';
import { ReviewModal } from '../reviews/ReviewModal';
import { Destination, Place, Restaurant, Hotel } from '../../types';
import {
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  ExternalLink,
  MessageSquarePlus,
  Loader2,
  Compass,
  BookOpen,
  Navigation,
  Car,
  HelpCircle,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export function DestinationPage() {
  const { countryCode, geoId, slug } = useParams<{ countryCode?: string; geoId?: string; slug?: string }>();
  const effectiveId = geoId || slug || 'it_amalfi';

  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoadingDest, setIsLoadingDest] = useState(true);

  // Tabs state: 9 tabs as mandated by Stage 1
  const [activeTab, setActiveTab] = useState<
    'overview' | 'things-to-do' | 'hotels' | 'restaurants' | 'map' | 'guide' | 'getting-there' | 'cabs' | 'qna'
  >('overview');

  // Places, hotels & restaurants state (strictly scoped to this destination)
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [places, setPlaces] = useState<Place[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState<boolean>(false);
  const [isLoadingHotels, setIsLoadingHotels] = useState<boolean>(false);

  // Map state
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [reviewModalTarget, setReviewModalTarget] = useState<{ type: 'place' | 'hotel' | 'restaurant'; id: string; name: string } | null>(null);

  // Load destination details via GET /api/destinations/:geoId
  useEffect(() => {
    let isMounted = true;
    async function fetchDest() {
      setIsLoadingDest(true);
      // Reset places and hotels so old destination never flashes
      setPlaces([]);
      setHotels([]);
      setRestaurants([]);
      try {
        const d = await wayfarerApi.getDestination(effectiveId);
        if (isMounted && d) {
          setDestination(d);
          wayfarerStore.saveDestination(d);
        }
      } catch (err) {
        console.warn('Failed to fetch destination:', err);
      } finally {
        if (isMounted) setIsLoadingDest(false);
      }
    }
    fetchDest();
    return () => { isMounted = false; };
  }, [effectiveId]);

  // Load places and hotels specifically for this destination
  useEffect(() => {
    if (!destination) return;
    let isMounted = true;
    const destKey = destination.geoId || destination.id;

    async function fetchDestData() {
      setIsLoadingPlaces(true);
      setIsLoadingHotels(true);

      try {
        const [placesRes, hotelsList] = await Promise.all([
          wayfarerApi.getDestinationPlaces(destKey, selectedCategory, 1, 6),
          wayfarerApi.getDestinationHotels(destKey)
        ]);

        if (isMounted) {
          setPlaces(placesRes.places);
          setRestaurants(placesRes.restaurants);
          setHasMore(placesRes.hasMore);
          setPage(1);

          // Save places to store for fast lookup
          placesRes.places.forEach(p => wayfarerStore.savePlace(p));

          // Set hotels strictly for this destination
          setHotels(hotelsList);
          hotelsList.forEach(h => wayfarerStore.saveHotel(h));
        }
      } catch (err) {
        console.warn('Failed to load destination places and hotels:', err);
      } finally {
        if (isMounted) {
          setIsLoadingPlaces(false);
          setIsLoadingHotels(false);
        }
      }
    }

    fetchDestData();
    return () => { isMounted = false; };
  }, [destination, selectedCategory]);

  const loadMorePlaces = async () => {
    if (!destination || isLoadingPlaces || !hasMore) return;
    setIsLoadingPlaces(true);
    try {
      const nextPage = page + 1;
      const res = await wayfarerApi.getDestinationPlaces(destination.geoId || destination.id, selectedCategory, nextPage, 6);
      setPlaces(prev => [...prev, ...res.places]);
      setHasMore(res.hasMore);
      setPage(nextPage);
      res.places.forEach(p => wayfarerStore.savePlace(p));
    } catch (e) {
      console.warn('Load more failed:', e);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  if (isLoadingDest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin mx-auto" />
        <h3 className="font-heading font-bold text-lg text-[#1F1637]">
          Discovering Destination Data...
        </h3>
        <p className="text-xs text-[#6B6385]">Loading coordinates and OpenStreetMap heritage records.</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#1F1637]">Destination Not Found</h2>
        <p className="text-sm text-[#6B6385] mt-2">The destination you requested could not be resolved.</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl">
          Return to Explore
        </Link>
      </div>
    );
  }

  const categoryChips = [
    'All',
    'Essentials',
    'Family friendly',
    'Hidden gems',
    'Museums',
    'Outdoors',
    'Arts and theatre',
    'Nightlife',
    'Historical'
  ];

  // Prepare map items
  const mapItems: MapItem[] = [
    ...places.map(p => ({
      id: p.id,
      type: 'place' as const,
      name: p.name,
      categoryOrCuisine: p.category,
      lat: p.lat,
      lng: p.lng,
      photo: p.photos[0],
      rating: p.avgRating,
      price: p.estimatedCost === 0 ? 'Free' : `₹${p.estimatedCost}`,
      linkUrl: `/place/${p.id}`
    })),
    ...hotels.map(h => ({
      id: h.id,
      type: 'hotel' as const,
      name: h.name,
      categoryOrCuisine: `${h.starClass}★ Hotel`,
      lat: h.lat,
      lng: h.lng,
      photo: h.photos[0],
      rating: h.avgRating,
      price: `₹${h.pricePerNight.toLocaleString()}/nt`,
      linkUrl: `/hotel/${h.id}`
    })),
    ...restaurants.map(r => ({
      id: r.id,
      type: 'restaurant' as const,
      name: r.name,
      categoryOrCuisine: r.cuisines[0] || 'Cuisine',
      lat: r.lat,
      lng: r.lng,
      photo: r.photos[0],
      rating: r.avgRating,
      price: '₹'.repeat(r.priceLevel),
      linkUrl: `/restaurant/${r.id}`
    }))
  ];

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="pb-20">
      
      {/* Large Destination Hero with Honest Source Badges */}
      <div className="relative h-[380px] sm:h-[460px] overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-6 sm:p-12 text-white">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-violet-300" />
                <span>{destination.flag || '📍'} {destination.region ? `${destination.region}, ` : ''}{destination.country}</span>
              </span>
              <span className="text-[11px] bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white/90">
                {destination.sourceBadge || 'From OpenStreetMap'}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight">
              {destination.name}
            </h1>
            
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl mt-2 leading-relaxed">
              {destination.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/plan?destination=${encodeURIComponent(destination.name)}`}
                  className="px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Plan Trip to {destination.name} with AI</span>
                </Link>
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  View on Map ({places.length + hotels.length} pins)
                </button>
              </div>

              {destination.photoCredit && (
                <span className="text-[10px] text-white/70">
                  Photo: {destination.photoCredit}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tab Bar — EXACT 9 Tabs Mandated by Stage 1 */}
      <div className="sticky top-16 z-30 bg-white border-b border-[#EDE9FE] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar py-3 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'things-to-do', label: `Things to Do (${places.length})` },
            { id: 'hotels', label: `Hotels (${hotels.length})` },
            { id: 'restaurants', label: `Restaurants (${restaurants.length})` },
            { id: 'map', label: 'Map' },
            { id: 'guide', label: 'Travel Guide' },
            { id: 'getting-there', label: 'Getting There' },
            { id: 'cabs', label: 'Cabs' },
            { id: 'qna', label: 'Q&A' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#6D28D9] text-white shadow-sm'
                  : 'text-[#6B6385] hover:text-[#1F1637] hover:bg-[#F5F3FF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Viewports */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            
            {/* Quick Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE]">
              <div>
                <p className="text-[11px] text-[#6B6385]">Curated Sights</p>
                <p className="text-xl font-bold font-heading text-[#1F1637] tabular-nums">{places.length}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#6B6385]">Boutique Stays</p>
                <p className="text-xl font-bold font-heading text-[#1F1637] tabular-nums">{hotels.length}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#6B6385]">Local Food Venues</p>
                <p className="text-xl font-bold font-heading text-[#1F1637] tabular-nums">{restaurants.length}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#6B6385]">Coordinates</p>
                <p className="text-xs font-mono text-[#6D28D9] mt-1">{destination.lat.toFixed(2)}°N, {destination.lng.toFixed(2)}°E</p>
              </div>
            </div>

            {/* Top Sights Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-heading text-[#1F1637]">Top Things to Do</h3>
                <button
                  onClick={() => setActiveTab('things-to-do')}
                  className="text-xs font-semibold text-[#6D28D9] hover:underline"
                >
                  See all {places.length} attractions →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {places.slice(0, 3).map(p => (
                  <Link
                    key={p.id}
                    to={`/place/${p.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer hover:shadow-wayfarer-lg transition-all"
                  >
                    <div className="h-44 relative">
                      <img src={p.photos[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-[#6D28D9]">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-bold text-sm text-[#1F1637] group-hover:text-[#6D28D9] transition-colors line-clamp-1">{p.name}</h4>
                      </div>
                      <p className="text-xs text-[#6B6385] line-clamp-2">{p.description}</p>
                      <div className="pt-2 flex items-center justify-between">
                        <RatingDisplay
                          avgRating={p.avgRating}
                          reviewCount={p.reviewCount}
                          size="sm"
                        />
                        <span className="text-[10px] text-[#6B6385] bg-[#F5F3FF] px-1.5 py-0.5 rounded border border-[#EDE9FE]">
                          {p.sourceBadge || 'OpenStreetMap'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Stays */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-heading text-[#1F1637]">Recommended Accommodations</h3>
                <button
                  onClick={() => setActiveTab('hotels')}
                  className="text-xs font-semibold text-[#6D28D9] hover:underline"
                >
                  See all {hotels.length} hotels →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {hotels.slice(0, 2).map(h => (
                  <Link
                    key={h.id}
                    to={`/hotel/${h.id}`}
                    className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer hover:shadow-wayfarer-lg transition-all"
                  >
                    <div className="sm:w-48 h-44 sm:h-auto shrink-0">
                      <img src={h.photos[0]} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#6D28D9]">{'★'.repeat(h.starClass)} Star</span>
                        <h4 className="font-heading font-bold text-sm text-[#1F1637] group-hover:text-[#6D28D9]">{h.name}</h4>
                        <p className="text-xs text-[#6B6385] line-clamp-2 mt-1">{h.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#EDE9FE]">
                        <p className="text-sm font-bold text-[#1F1637] tabular-nums">
                          ₹{h.pricePerNight.toLocaleString()}<span className="text-xs font-normal text-[#6B6385]">/nt</span>
                        </p>
                        <span className="text-xs font-semibold text-[#6D28D9]">View Stay →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: THINGS TO DO (WITH CATEGORY CHIPS & LOAD MORE) */}
        {activeTab === 'things-to-do' && (
          <div className="space-y-6">
            
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
              {categoryChips.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#6D28D9] text-white shadow-sm'
                      : 'bg-[#F5F3FF] text-[#6B6385] hover:text-[#1F1637] border border-[#EDE9FE]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List with Synchronized Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                {places.map(place => (
                  <div
                    key={place.id}
                    onMouseEnter={() => setHoveredItemId(place.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    className="p-4 bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer hover:border-[#6D28D9] transition-all flex flex-col sm:flex-row gap-4"
                  >
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-full sm:w-44 h-36 rounded-xl object-cover"
                    />
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-[#6D28D9] uppercase tracking-wider">{place.category}</span>
                          <span className="text-xs font-bold text-[#1F1637]">
                            {place.estimatedCost === 0 ? 'Free Entry' : `₹${place.estimatedCost.toLocaleString()}`}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-base text-[#1F1637] mt-0.5">{place.name}</h4>
                        <p className="text-xs text-[#6B6385] line-clamp-2 mt-1">{place.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#EDE9FE]">
                        <div className="flex items-center gap-2">
                          <RatingDisplay
                            avgRating={place.avgRating}
                            reviewCount={place.reviewCount}
                            size="sm"
                            onWriteReviewClick={() => setReviewModalTarget({ type: 'place', id: place.id, name: place.name })}
                          />
                          <span className="text-[10px] text-[#6B6385] bg-[#F5F3FF] px-1.5 py-0.5 rounded border border-[#EDE9FE]">
                            {place.sourceBadge || 'From OpenStreetMap'}
                          </span>
                        </div>
                        <Link
                          to={`/place/${place.id}`}
                          className="px-3 py-1.5 bg-[#F5F3FF] text-[#6D28D9] font-semibold text-xs rounded-lg hover:bg-[#EDE9FE] transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={loadMorePlaces}
                      disabled={isLoadingPlaces}
                      className="px-6 py-2.5 bg-white border border-[#EDE9FE] text-[#6D28D9] hover:bg-[#F5F3FF] font-semibold text-xs rounded-xl shadow-sm transition-all"
                    >
                      {isLoadingPlaces ? 'Loading more sights...' : 'Load more sights'}
                    </button>
                  </div>
                )}
              </div>

              {/* Side Map */}
              <div className="hidden lg:block lg:col-span-5 sticky top-36 h-[560px]">
                <WayfarerMap
                  center={[destination.lat, destination.lng]}
                  zoom={12}
                  items={mapItems}
                  selectedItemId={selectedItemId}
                  hoveredItemId={hoveredItemId}
                  onSelectItem={(item) => setSelectedItemId(item?.id || null)}
                  className="h-full"
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: HOTELS */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <p className="text-xs text-[#6B6385]">
              Wayfarer partners with verified providers. Click "Check availability" to reserve directly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer flex flex-col justify-between"
                >
                  <div className="h-48 relative">
                    <img src={hotel.photos[0]} alt={hotel.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#6D28D9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {'★'.repeat(hotel.starClass)} Star
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-heading font-bold text-base text-[#1F1637]">{hotel.name}</h4>
                      <p className="text-xs text-[#6B6385] line-clamp-1 mt-0.5">{hotel.address}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {hotel.amenities.slice(0, 3).map((a: string) => (
                          <span key={a} className="text-[10px] text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded-md">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EDE9FE]">
                      <RatingDisplay
                        avgRating={hotel.avgRating}
                        reviewCount={hotel.reviewCount}
                        size="sm"
                        onWriteReviewClick={() => setReviewModalTarget({ type: 'hotel', id: hotel.id, name: hotel.name })}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-[10px] text-[#6B6385]">from</span>
                          <p className="text-lg font-bold text-[#1F1637] tabular-nums">
                            ₹{hotel.pricePerNight.toLocaleString()}
                          </p>
                        </div>
                        <Link
                          to={`/hotel/${hotel.id}`}
                          className="px-3.5 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                        >
                          View Hotel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESTAURANTS */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(rest => (
                <div key={rest.id} className="bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer">
                  <img src={rest.photos[0]} alt={rest.name} className="w-full h-44 object-cover" />
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#6D28D9]">{rest.cuisines.join(', ')}</span>
                      <span className="text-xs font-bold text-[#1F1637]">{'₹'.repeat(rest.priceLevel)}</span>
                    </div>
                    <h4 className="font-heading font-bold text-base text-[#1F1637]">{rest.name}</h4>
                    <div className="pt-2 flex items-center justify-between">
                      <RatingDisplay
                        avgRating={rest.avgRating}
                        reviewCount={rest.reviewCount}
                        size="sm"
                        onWriteReviewClick={() => setReviewModalTarget({ type: 'restaurant', id: rest.id, name: rest.name })}
                      />
                      <span className="text-[10px] text-[#6B6385] bg-[#F5F3FF] px-1.5 py-0.5 rounded border border-[#EDE9FE]">
                        {rest.sourceBadge || 'From OpenStreetMap'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#EDE9FE]">
                      <Link
                        to={`/restaurant/${rest.id}`}
                        className="block text-center py-2 bg-[#F5F3FF] text-[#6D28D9] font-semibold text-xs rounded-xl hover:bg-[#EDE9FE] transition-colors"
                      >
                        Restaurant Guide &amp; Reserve
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INTERACTIVE MAP (WITH PIN CLUSTERING & "SEARCH THIS AREA") */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#6B6385]">
                Custom violet pins for sights, hotels, and dining with OpenStreetMap tiles and clustering.
              </p>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6D28D9]" /> Sights</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Hotels</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> Food</span>
              </div>
            </div>

            <WayfarerMap
              center={[destination.lat, destination.lng]}
              zoom={13}
              items={mapItems}
              selectedItemId={selectedItemId}
              onSelectItem={(item) => setSelectedItemId(item?.id || null)}
              className="h-[600px]"
            />
          </div>
        )}

        {/* TAB 6: TRAVEL GUIDE (PREVIEW FOR STAGE 2) */}
        {activeTab === 'guide' && (
          <div className="p-8 bg-white rounded-3xl border border-[#EDE9FE] shadow-wayfarer space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1F1637]">
                  {destination.name} Comprehensive Travel Guide
                </h3>
                <p className="text-xs text-[#6B6385]">
                  Best time to visit, Getting in, Getting around, Stay safe, and Quick Facts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] space-y-1">
                <span className="font-bold text-[#6D28D9]">Best Season</span>
                <p className="text-[#1F1637]">October to March offers optimal temperature and minimal precipitation.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] space-y-1">
                <span className="font-bold text-[#6D28D9]">Getting In &amp; Around</span>
                <p className="text-[#1F1637]">Accessible via regional international airports, scenic railways, and verified app cabs.</p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#6B6385] border-t border-[#EDE9FE]">
              Full live Groq summaries &amp; Wikivoyage adaptation scheduled for Stage 2.
            </div>
          </div>
        )}

        {/* TAB 7: GETTING THERE (PREVIEW FOR STAGE 3) */}
        {activeTab === 'getting-there' && (
          <div className="p-8 bg-white rounded-3xl border border-[#EDE9FE] shadow-wayfarer space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1F1637]">
                  Getting to {destination.name}
                </h3>
                <p className="text-xs text-[#6B6385]">
                  Door-to-door transit: compare Flight, Train, Bus, and Cabs with labeled fare ranges.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#6B6385] leading-relaxed">
              Stage 3 integrates vertical journey timelines via <code>POST /api/transport-plan</code>, comparing rail classes (SL, 3A, 2A, 1A), IRCTC/ConfirmTkt integrations, redBus, and airport connections.
            </p>
          </div>
        )}

        {/* TAB 8: CABS (PREVIEW FOR STAGE 3) */}
        {activeTab === 'cabs' && (
          <div className="p-8 bg-white rounded-3xl border border-[#EDE9FE] shadow-wayfarer space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1F1637]">
                  Cabs &amp; Local Rides in {destination.name}
                </h3>
                <p className="text-xs text-[#6B6385]">
                  Live fare estimates for Auto, Bike, Hatchback, Sedan &amp; SUV via Uber, Ola, and regional apps.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#6B6385] leading-relaxed">
              Stage 3 enables direct deep links and fare estimates calling <code>GET /api/cabs/estimate</code> with route polylines.
            </p>
          </div>
        )}

        {/* TAB 9: Q&A */}
        {activeTab === 'qna' && (
          <div className="max-w-3xl space-y-4">
            <div className="p-6 bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6D28D9] mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>Community Q&amp;A</span>
              </div>
              <h3 className="font-heading font-bold text-base text-[#1F1637]">
                Ask questions to travelers who visited {destination.name}
              </h3>
              <p className="text-xs text-[#6B6385] mt-1 leading-relaxed">
                Connect with travelers and local experts. Schema is pre-provisioned for community questions and answers.
              </p>
              <button
                onClick={() => alert('Community discussions open in Phase 2!')}
                className="mt-4 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors"
              >
                Post a Question
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Review Modal Trigger */}
      {reviewModalTarget && (
        <ReviewModal
          isOpen={true}
          onClose={() => setReviewModalTarget(null)}
          targetType={reviewModalTarget.type}
          targetId={reviewModalTarget.id}
          targetName={reviewModalTarget.name}
        />
      )}
    </div>
  );
}
