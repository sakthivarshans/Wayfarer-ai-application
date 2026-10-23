import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Place, Hotel, Restaurant } from '../../types';
import { Compass, Maximize2, Minimize2, Navigation, Layers, RotateCcw } from 'lucide-react';

export type MapItemType = 'place' | 'hotel' | 'restaurant';

export interface MapItem {
  id: string;
  type: MapItemType;
  name: string;
  categoryOrCuisine: string;
  lat: number;
  lng: number;
  photo?: string;
  rating?: number;
  price?: string;
  linkUrl: string;
}

interface WayfarerMapProps {
  center: [number, number];
  zoom?: number;
  items: MapItem[];
  selectedItemId?: string | null;
  onSelectItem?: (item: MapItem | null) => void;
  hoveredItemId?: string | null;
  routePolyline?: [number, number][];
  routeInfo?: { distanceMeters: number; durationSeconds: number };
  className?: string;
  showRadiusFilter?: boolean;
}

// Custom Violet Pin SVGs for Leaflet
function createCustomPin(type: MapItemType, isSelected: boolean, isHovered: boolean) {
  const bgColor = isSelected ? '#5B21B6' : isHovered ? '#7C3AED' : '#6D28D9';
  const strokeColor = '#FFFFFF';
  const size = isSelected ? 42 : isHovered ? 38 : 34;

  let iconInner = '';
  if (type === 'hotel') {
    // Bed icon
    iconInner = '<path d="M4 14V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M2 18h20M4 18v3M20 18v3" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>';
  } else if (type === 'restaurant') {
    // Utensils
    iconInner = '<path d="M18 2v6a3 3 0 0 1-3 3h-1m4-9v14M6 2v14M3 2v6a3 3 0 0 0 3 3m0 0v11" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>';
  } else {
    // Compass / place pin
    iconInner = '<circle cx="12" cy="12" r="3" fill="#FFF"/><path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" stroke="#FFF" stroke-width="1.5"/>';
  }

  const svg = `
    <div style="position: relative; width: ${size}px; height: ${size + 10}px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.15s ease;">
      <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background: ${bgColor}; box-shadow: 0 4px 14px rgba(109, 40, 217, 0.4); border: 2.5px solid ${strokeColor}; display: flex; align-items: center; justify-content: center;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">${iconInner}</svg>
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${bgColor}; margin-top: -2px;"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-wayfarer-pin',
    html: svg,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -(size + 12)]
  });
}

export function WayfarerMap({
  center,
  zoom = 13,
  items,
  selectedItemId,
  onSelectItem,
  hoveredItemId,
  routePolyline,
  routeInfo,
  className = 'h-[500px]',
  showRadiusFilter = true
}: WayfarerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number | null>(null);
  const [showSearchThisArea, setShowSearchThisArea] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'place' | 'hotel' | 'restaurant'>('all');

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: true
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.on('moveend', () => {
      setShowSearchThisArea(true);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when prop changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    const filteredItems = items.filter(item => {
      if (activeCategory === 'all') return true;
      return item.type === activeCategory;
    });

    filteredItems.forEach(item => {
      const isSelected = item.id === selectedItemId;
      const isHovered = item.id === hoveredItemId;
      const icon = createCustomPin(item.type, isSelected, isHovered);

      const marker = L.marker([item.lat, item.lng], { icon });

      // Popup content
      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; font-size: 13px; max-width: 220px;">
          ${item.photo ? `<img src="${item.photo}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" alt="${item.name}"/>` : ''}
          <div style="font-weight: 700; color: #1F1637; font-size: 14px; line-height: 1.2; margin-bottom: 4px;">${item.name}</div>
          <div style="color: #6B6385; font-size: 11px; margin-bottom: 6px;">${item.categoryOrCuisine}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 600; color: #6D28D9;">
            <span>${item.rating ? `★ ${item.rating.toFixed(1)}` : 'New'}</span>
            <span>${item.price || ''}</span>
          </div>
          <a href="${item.linkUrl}" style="display: block; margin-top: 8px; text-align: center; background: #6D28D9; color: #FFF; padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 11px; text-decoration: none;">View Details</a>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false });

      marker.on('click', () => {
        if (onSelectItem) onSelectItem(item);
      });

      marker.addTo(map);
      markersRef.current[item.id] = marker;

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [items, selectedItemId, hoveredItemId, activeCategory]);

  // Handle selected item popup open & center
  useEffect(() => {
    if (selectedItemId && markersRef.current[selectedItemId]) {
      const marker = markersRef.current[selectedItemId];
      marker.openPopup();
      const pos = marker.getLatLng();
      mapInstanceRef.current?.panTo(pos, { animate: true });
    }
  }, [selectedItemId]);

  // Handle Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (routePolyline && routePolyline.length > 0) {
      const line = L.polyline(routePolyline, {
        color: '#6D28D9',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8'
      }).addTo(map);

      map.fitBounds(line.getBounds(), { padding: [40, 40] });
      polylineRef.current = line;
    }
  }, [routePolyline]);

  // Radius circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    if (selectedRadiusKm) {
      const circle = L.circle(center, {
        radius: selectedRadiusKm * 1000,
        color: '#6D28D9',
        fillColor: '#8B5CF6',
        fillOpacity: 0.12,
        weight: 2
      }).addTo(map);

      map.fitBounds(circle.getBounds(), { padding: [20, 20] });
      circleRef.current = circle;
    }
  }, [selectedRadiusKm, center]);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapInstanceRef.current?.flyTo([latitude, longitude], 14);
      },
      (err) => console.warn('Geolocation error:', err)
    );
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : className}`}>
      
      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Category Filter Pills (Functional Buttons) */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-[#EDE9FE]">
          {(['all', 'place', 'hotel', 'restaurant'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-[#6D28D9] text-white shadow-sm'
                  : 'text-[#6B6385] hover:text-[#1F1637] hover:bg-[#F5F3FF]'
              }`}
            >
              {cat === 'all' ? 'All Places' : `${cat}s`}
            </button>
          ))}
        </div>

        {/* Radius control & Tools */}
        <div className="pointer-events-auto flex items-center gap-2">
          {showRadiusFilter && (
            <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-[#EDE9FE] text-xs">
              <span className="text-[#6B6385] px-2 font-medium">Radius:</span>
              {[1, 3, 5, 10].map((km) => (
                <button
                  key={km}
                  onClick={() => setSelectedRadiusKm(selectedRadiusKm === km ? null : km)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedRadiusKm === km
                      ? 'bg-[#6D28D9] text-white'
                      : 'text-[#6B6385] hover:bg-[#F5F3FF]'
                  }`}
                >
                  {km}km
                </button>
              ))}
            </div>
          )}

          {/* Geolocate Button */}
          <button
            onClick={handleGeolocate}
            title="Locate me"
            className="p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-[#EDE9FE] text-[#1F1637] hover:text-[#6D28D9] hover:bg-[#F5F3FF] transition-colors"
          >
            <Navigation className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit fullscreen' : 'Full screen'}
            className="p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-[#EDE9FE] text-[#1F1637] hover:text-[#6D28D9] hover:bg-[#F5F3FF] transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* "Search this area" floating button */}
      {showSearchThisArea && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto">
          <button
            onClick={() => setShowSearchThisArea(false)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#6D28D9] font-semibold text-xs rounded-full shadow-wayfarer-lg border border-[#EDE9FE] hover:bg-[#F5F3FF] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Search this area</span>
          </button>
        </div>
      )}

      {/* Route Info Badge if active */}
      {routeInfo && (
        <div className="absolute bottom-4 left-4 z-[1000] pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-[#EDE9FE] flex items-center gap-3 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6D28D9]" />
          <div>
            <p className="font-semibold text-[#1F1637]">
              {(routeInfo.distanceMeters / 1000).toFixed(1)} km · ~{Math.round(routeInfo.durationSeconds / 60)} min drive
            </p>
            <p className="text-[11px] text-[#6B6385]">OpenRouteService ETA calculation</p>
          </div>
        </div>
      )}

      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
