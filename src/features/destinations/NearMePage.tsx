import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, MapPin, Loader2, RefreshCw, Compass, AlertCircle } from 'lucide-react';
import { wayfarerApi } from '../../services/api';
import { Place, Restaurant } from '../../types';
import { RatingDisplay } from '../../components/common/RatingDisplay';
import { WayfarerMap, MapItem } from '../map/WayfarerMap';

export function NearMePage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);
  const [isFetchingPlaces, setIsFetchingPlaces] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [sourceBadge, setSourceBadge] = useState<string>('From OpenStreetMap');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick preset locations for testing
  const presets = [
    { label: 'My GPS Location', type: 'gps' },
    { label: 'Mumbai, IN', lat: 18.9220, lng: 72.8347 },
    { label: 'Goa, IN', lat: 15.2993, lng: 74.1240 },
    { label: 'New Delhi, IN', lat: 28.6139, lng: 77.2090 },
    { label: 'Amalfi, IT', lat: 40.6340, lng: 14.6027 },
    { label: 'Kyoto, JP', lat: 35.0116, lng: 135.7681 },
    { label: 'Paris, FR', lat: 48.8566, lng: 2.3522 }
  ];

  // Request browser geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser. Please select a preset city below.');
      return;
    }

    setIsLoadingLoc(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: parseFloat(pos.coords.latitude.toFixed(4)),
          lng: parseFloat(pos.coords.longitude.toFixed(4))
        });
        setIsLoadingLoc(false);
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        // Default to Mumbai for graceful UX if denied
        setCoords({ lat: 18.9220, lng: 72.8347 });
        setErrorMsg('Location permission was denied or unavailable. Showing Mumbai sample.');
        setIsLoadingLoc(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  // Fetch near places when coords or radius changes
  useEffect(() => {
    if (!coords) return;

    let isMounted = true;
    async function loadNear() {
      setIsFetchingPlaces(true);
      try {
        const res = await wayfarerApi.getNearPlaces(coords!.lat, coords!.lng, radiusKm);
        if (isMounted) {
          setPlaces(res.places || []);
          setRestaurants(res.restaurants || []);
          setSourceBadge(res.sourceBadge || 'From OpenStreetMap');
        }
      } catch (err) {
        console.warn('Failed to load nearby places:', err);
      } finally {
        if (isMounted) setIsFetchingPlaces(false);
      }
    }

    loadNear();
    return () => { isMounted = false; };
  }, [coords, radiusKm]);

  // Map items
  const mapItems: MapItem[] = [
    ...places.map(p => ({
      id: p.id,
      type: 'place' as const,
      name: p.name,
      categoryOrCuisine: p.category,
      lat: p.lat,
      lng: p.lng,
      photo: p.photos[0],
      linkUrl: `/place/${p.id}`
    })),
    ...restaurants.map(r => ({
      id: r.id,
      type: 'restaurant' as const,
      name: r.name,
      categoryOrCuisine: r.cuisines.join(', '),
      lat: r.lat,
      lng: r.lng,
      photo: r.photos[0],
      linkUrl: `/restaurant/${r.id}`
    }))
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3FF] border border-[#EDE9FE] text-xs font-semibold text-[#6D28D9] mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Nearby Discovery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1F1637]">
            Attractions &amp; Food Near You
          </h1>
          <p className="text-xs text-[#6B6385] mt-1">
            Real-time proximity search powered by <code>GET /api/places/near</code> with OpenStreetMap data.
          </p>
        </div>

        {/* Controls: Radius & Geolocation */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EDE9FE] text-xs shadow-sm">
            <span className="text-[#6B6385] px-2 font-medium">Radius:</span>
            {[1, 3, 5, 10, 20].map((km) => (
              <button
                key={km}
                onClick={() => setRadiusKm(km)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  radiusKm === km
                    ? 'bg-[#6D28D9] text-white shadow-sm'
                    : 'text-[#6B6385] hover:bg-[#F5F3FF]'
                }`}
              >
                {km}km
              </button>
            ))}
          </div>

          <button
            onClick={detectLocation}
            disabled={isLoadingLoc}
            className="px-3.5 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLoc ? 'animate-spin' : ''}`} />
            <span>GPS Locate</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-[#6B6385] shrink-0 font-medium mr-1">Quick Cities:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (p.type === 'gps') {
                detectLocation();
              } else if (p.lat && p.lng) {
                setCoords({ lat: p.lat, lng: p.lng });
              }
            }}
            className="px-2.5 py-1 bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#1F1637] rounded-lg border border-[#EDE9FE] transition-colors whitespace-nowrap shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Map & List Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Nearby Sights & Dining */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-[#1F1637]">
              Points of Interest within {radiusKm} km
            </h3>
            <span className="text-[11px] text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded border border-[#EDE9FE] font-medium">
              {sourceBadge}
            </span>
          </div>

          {isFetchingPlaces ? (
            <div className="p-12 text-center bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE] space-y-2">
              <Loader2 className="w-6 h-6 text-[#6D28D9] animate-spin mx-auto" />
              <p className="text-xs text-[#6B6385]">Querying OpenStreetMap proximity coordinates...</p>
            </div>
          ) : places.length === 0 ? (
            <div className="p-12 text-center bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE] space-y-2">
              <Compass className="w-8 h-8 text-[#6D28D9] mx-auto opacity-70" />
              <p className="text-sm font-semibold text-[#1F1637]">No attractions found within {radiusKm} km</p>
              <p className="text-xs text-[#6B6385]">Try expanding the radius to 10km or 20km.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="p-4 bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer hover:border-[#6D28D9] transition-all flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={place.photos[0]}
                    alt={place.name}
                    className="w-full sm:w-40 h-32 rounded-xl object-cover"
                  />
                  <div className="flex-1 flex flex-col justify-between space-y-1.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-wider">
                          {place.category}
                        </span>
                        {place.distanceKm && (
                          <span className="text-xs font-bold text-[#1F1637] bg-[#F5F3FF] px-2 py-0.5 rounded-full border border-[#EDE9FE] tabular-nums">
                            {place.distanceKm} km away
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[#1F1637] mt-0.5">
                        {place.name}
                      </h4>
                      <p className="text-xs text-[#6B6385] line-clamp-2 mt-1">
                        {place.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RatingDisplay avgRating={place.avgRating} reviewCount={place.reviewCount} size="sm" />
                        <span className="text-[10px] text-[#6B6385]">· {place.sourceBadge || 'OpenStreetMap'}</span>
                      </div>
                      <Link
                        to={`/place/${place.id}`}
                        className="px-3 py-1 bg-[#F5F3FF] text-[#6D28D9] text-xs font-semibold rounded-lg hover:bg-[#EDE9FE] transition-colors"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Interactive Map */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white p-4 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F1637]">Proximity Radar</span>
              {coords && (
                <span className="font-mono text-[10px] text-[#6D28D9]">
                  {coords.lat.toFixed(3)}°N, {coords.lng.toFixed(3)}°E
                </span>
              )}
            </div>

            {coords ? (
              <div className="h-[520px]">
                <WayfarerMap
                  center={[coords.lat, coords.lng]}
                  zoom={13}
                  items={mapItems}
                  className="h-full"
                  showRadiusFilter={false}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-[#F5F3FF] rounded-xl text-xs text-[#6B6385]">
                Locating position...
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
