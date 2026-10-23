import { z } from 'zod';
import { Trip, Itinerary, Place, Hotel, Restaurant, TransportOption, Destination, DestinationSearchResult } from '../types';
import { SEED_DESTINATIONS, SEED_PLACES, SEED_HOTELS, SEED_RESTAURANTS, SEED_DEMO_ITINERARY, SEED_REVIEWS } from '../data/seed';

// When backend is hosted locally or remotely, hit same-origin /api or VITE_API_BASE_URL
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

// Standard API error response schema
export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string()
  })
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

// Destination Search schema
export const DestinationSearchResultSchema = z.object({
  geoId: z.string(),
  name: z.string(),
  region: z.string(),
  country: z.string(),
  countryCode: z.string(),
  flag: z.string(),
  lat: z.number(),
  lng: z.number(),
  type: z.enum(['city', 'town', 'attraction', 'region'])
});

export const DestinationSearchResponseSchema = z.object({
  results: z.array(DestinationSearchResultSchema)
});

// Destination Details schema
export const DestinationResponseSchema = z.object({
  destination: z.object({
    geoId: z.string(),
    name: z.string(),
    region: z.string().optional(),
    country: z.string(),
    countryCode: z.string(),
    flag: z.string(),
    lat: z.number(),
    lng: z.number(),
    type: z.string(),
    heroImage: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    sourceBadge: z.string().optional(),
    photoCredit: z.string().optional(),
    currency: z.string().optional(),
    languages: z.array(z.string()).optional(),
    callingCode: z.string().optional(),
    timeZone: z.string().optional()
  })
});

// Assistant response schema
export const AssistantResponseSchema = z.object({
  reply: z.string(),
  sources: z.array(z.string()).optional()
});

// Telegram status response schema
export const TelegramStatusSchema = z.object({
  connected: z.boolean(),
  botUsername: z.string().optional(),
  lastActive: z.string().optional()
});

// Route response schema
export const RouteResponseSchema = z.object({
  distanceMeters: z.number(),
  durationSeconds: z.number(),
  polyline: z.array(z.tuple([z.number(), z.number()]))
});

class WayfarerApiClient {
  private getAuthHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Worldwide destinations autocomplete: GET /api/search/destinations?q=
  async searchDestinations(q: string): Promise<DestinationSearchResult[]> {
    const cleanQ = q.trim();
    if (!cleanQ) return [];

    try {
      const url = `${API_BASE_URL}/api/search/destinations?q=${encodeURIComponent(cleanQ)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const parsed = DestinationSearchResponseSchema.safeParse(data);
        if (parsed.success) {
          return parsed.data.results;
        }
        return data.results || [];
      }
    } catch (e) {
      console.warn('Backend destination search unavailable, using client fallback:', e);
    }

    // Client fallback: match seed destinations + worldwide hubs
    const fallbackSeed = [
      { geoId: 'in_agra', name: 'Agra', region: 'Uttar Pradesh', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 27.1767, lng: 78.0081, type: 'city' as const },
      { geoId: 'in_jaipur', name: 'Jaipur', region: 'Rajasthan', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 26.9124, lng: 75.7873, type: 'city' as const },
      { geoId: 'in_udaipur', name: 'Udaipur', region: 'Rajasthan', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 24.5854, lng: 73.7125, type: 'city' as const },
      { geoId: 'in_delhi', name: 'Delhi', region: 'National Capital Region', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 28.6139, lng: 77.2090, type: 'city' as const },
      { geoId: 'in_amritsar', name: 'Amritsar', region: 'Punjab', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 31.6340, lng: 74.8723, type: 'city' as const },
      { geoId: 'in_varanasi', name: 'Varanasi', region: 'Uttar Pradesh', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 25.3176, lng: 82.9739, type: 'city' as const },
      { geoId: 'in_munnar', name: 'Munnar', region: 'Kerala', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 10.0889, lng: 77.0595, type: 'town' as const },
      { geoId: 'in_goa', name: 'Goa', region: 'Goa', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 15.2993, lng: 74.1240, type: 'region' as const },
      { geoId: 'fr_paris', name: 'Paris', region: 'Île-de-France', country: 'France', countryCode: 'FR', flag: '🇫🇷', lat: 48.8566, lng: 2.3522, type: 'city' as const },
      { geoId: 'it_rome', name: 'Rome', region: 'Lazio', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', lat: 41.9028, lng: 12.4964, type: 'city' as const },
      { geoId: 'it_amalfi', name: 'Amalfi Coast', region: 'Campania', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', lat: 40.6340, lng: 14.6027, type: 'region' as const },
      { geoId: 'jp_kyoto', name: 'Kyoto', region: 'Kansai', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', lat: 35.0116, lng: 135.7681, type: 'city' as const },
      { geoId: 'jp_tokyo', name: 'Tokyo', region: 'Kanto', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', lat: 35.6762, lng: 139.6503, type: 'city' as const },
      { geoId: 'ae_dubai', name: 'Dubai', region: 'Emirate of Dubai', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', lat: 25.2048, lng: 55.2708, type: 'city' as const },
      { geoId: 'es_barcelona', name: 'Barcelona', region: 'Catalonia', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', lat: 41.3879, lng: 2.1699, type: 'city' as const },
      { geoId: 'eg_cairo', name: 'Cairo & Giza', region: 'Cairo Governorate', country: 'Egypt', countryCode: 'EG', flag: '🇪🇬', lat: 30.0444, lng: 31.2357, type: 'city' as const }
    ];

    return fallbackSeed.filter(d =>
      d.name.toLowerCase().includes(cleanQ.toLowerCase()) ||
      d.country.toLowerCase().includes(cleanQ.toLowerCase()) ||
      d.region.toLowerCase().includes(cleanQ.toLowerCase())
    );
  }

  // Get curated worldwide destinations catalog: GET /api/destinations/worldwide/catalog
  async getWorldwideCatalog(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/destinations/worldwide/catalog`);
      if (res.ok) {
        const data = await res.json();
        return data.destinations || [];
      }
    } catch (e) {
      console.warn('Failed to load worldwide catalog from backend:', e);
    }
    return [];
  }

  // Get destination details: GET /api/destinations/:geoId
  async getDestination(geoId: string): Promise<Destination> {
    try {
      const url = `${API_BASE_URL}/api/destinations/${encodeURIComponent(geoId)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const d = data.destination;
        return {
          id: d.geoId,
          geoId: d.geoId,
          slug: d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: d.name,
          region: d.region,
          country: d.country,
          countryCode: d.countryCode,
          flag: d.flag,
          heroImage: d.heroImage,
          description: d.description,
          lat: d.lat,
          lng: d.lng,
          tags: d.tags || ['Travel Discovery'],
          sourceBadge: d.sourceBadge || 'From OpenStreetMap & Wikipedia',
          photoCredit: d.photoCredit || 'Wikimedia Commons / OpenStreetMap'
        };
      }
    } catch (e) {
      console.warn('Backend getDestination unavailable:', e);
    }

    // Client fallback
    const seed = SEED_DESTINATIONS.find(d => d.slug.includes(geoId) || geoId.includes(d.slug) || d.id === geoId) || SEED_DESTINATIONS[0];
    return {
      id: seed.id,
      geoId: seed.id,
      slug: seed.slug,
      name: seed.name,
      country: seed.country,
      countryCode: seed.country === 'Italy' ? 'IT' : seed.country === 'Japan' ? 'JP' : 'IN',
      flag: seed.country === 'Italy' ? '🇮🇹' : seed.country === 'Japan' ? '🇯🇵' : '🇮🇳',
      heroImage: seed.heroImage,
      description: seed.description,
      lat: seed.lat,
      lng: seed.lng,
      tags: seed.tags,
      sourceBadge: 'From OpenStreetMap',
      photoCredit: 'Wayfarer Photography'
    };
  }

  // Get destination places & restaurants: GET /api/destinations/:geoId/places?category=&page=&limit=
  async getDestinationPlaces(geoId: string, category: string = 'All', page: number = 1, limit: number = 6): Promise<{
    places: Place[];
    restaurants: Restaurant[];
    hasMore: boolean;
    total: number;
    sourceBadge?: string;
  }> {
    try {
      const url = `${API_BASE_URL}/api/destinations/${encodeURIComponent(geoId)}/places?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend getDestinationPlaces unavailable, using store fallback:', e);
    }

    return {
      places: [],
      restaurants: [],
      hasMore: false,
      total: 0,
      sourceBadge: 'Wayfarer Verified'
    };
  }

  // Get hotels for specific destination: GET /api/destinations/:geoId/hotels
  async getDestinationHotels(geoId: string): Promise<Hotel[]> {
    try {
      const url = `${API_BASE_URL}/api/destinations/${encodeURIComponent(geoId)}/hotels`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.hotels || [];
      }
    } catch (e) {
      console.warn('Backend getDestinationHotels unavailable:', e);
    }
    return [];
  }

  // Get single place by ID: GET /api/places/:id
  async getPlaceById(id: string): Promise<{ place: Place; destination?: any } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/places/${encodeURIComponent(id)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch place by ID:', e);
    }
    return null;
  }

  // Get single hotel by ID: GET /api/hotels/:id
  async getHotelById(id: string): Promise<{ hotel: Hotel; destination?: any } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hotels/${encodeURIComponent(id)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch hotel by ID:', e);
    }
    return null;
  }

  // Get single restaurant by ID: GET /api/restaurants/:id
  async getRestaurantById(id: string): Promise<{ restaurant: Restaurant; destination?: any } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/restaurants/${encodeURIComponent(id)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch restaurant by ID:', e);
    }
    return null;
  }

  // Places near coordinates: GET /api/places/near?lat=&lng=&radiusKm=
  async getNearPlaces(lat: number, lng: number, radiusKm: number = 5): Promise<{
    places: Place[];
    restaurants: Restaurant[];
    sourceBadge: string;
  }> {
    try {
      const url = `${API_BASE_URL}/api/places/near?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend near places failed, using fallback:', e);
    }

    return {
      places: SEED_PLACES.map((p, i) => ({ ...p, distanceKm: (i + 1) * 0.8 })),
      restaurants: SEED_RESTAURANTS.map((r, i) => ({ ...r, distanceKm: (i + 1) * 0.5 })),
      sourceBadge: 'From OpenStreetMap'
    };
  }

  async checkHealth(): Promise<{ status: string; uptime?: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'offline_fallback' };
    }
  }

  // Create a new trip
  async createTrip(params: {
    origin: string;
    destination: string;
    budget: number;
    days: number;
    transportPreference: 'flight' | 'train' | 'bus' | 'any';
  }, token?: string): Promise<Trip> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trips`, {
          method: 'POST',
          headers: this.getAuthHeaders(token),
          body: JSON.stringify(params)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend unavailable, using client fallback:', err);
      }
    }

    const destMatch = SEED_DESTINATIONS.find(d => 
      d.name.toLowerCase().includes(params.destination.toLowerCase()) || 
      params.destination.toLowerCase().includes(d.name.toLowerCase())
    ) || SEED_DESTINATIONS[0];

    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      userId: token ? 'user_current' : 'guest_user',
      origin: params.origin,
      destination: destMatch.name,
      destinationId: destMatch.id,
      budget: params.budget,
      currency: 'INR',
      days: params.days,
      transportPreference: params.transportPreference,
      createdAt: new Date().toISOString(),
      shareId: `wf-${Math.random().toString(36).substring(2, 9)}`,
      isPublic: true
    };

    return newTrip;
  }

  // Generate itinerary for trip
  async generateItinerary(tripId: string, token?: string): Promise<Itinerary> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/itinerary/generate`, {
          method: 'POST',
          headers: this.getAuthHeaders(token)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend unavailable, using client fallback:', err);
      }
    }

    return {
      ...SEED_DEMO_ITINERARY,
      tripId
    };
  }

  // Get places for destination or trip
  async getTripPlaces(tripId: string, token?: string): Promise<Place[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/places`, {
          headers: this.getAuthHeaders(token)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable:', e);
      }
    }
    return SEED_PLACES;
  }

  // Get transport options for trip
  async getTripTransport(tripId: string, token?: string): Promise<TransportOption[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/transport`, {
          headers: this.getAuthHeaders(token)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable:', e);
      }
    }
    return SEED_DEMO_ITINERARY.transportOptions;
  }

  // Get hotel options for trip
  async getTripHotels(tripId: string, token?: string): Promise<Hotel[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/hotels`, {
          headers: this.getAuthHeaders(token)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable:', e);
      }
    }
    return SEED_HOTELS;
  }

  // Get restaurant options for trip
  async getTripRestaurants(tripId: string, token?: string): Promise<Restaurant[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/restaurants`, {
          headers: this.getAuthHeaders(token)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable:', e);
      }
    }
    return SEED_RESTAURANTS;
  }

  // Route between two lat/lng coordinates (OpenRouteService via backend)
  async getRoute(from: { lat: number; lng: number }, to: { lat: number; lng: number }): Promise<{
    distanceMeters: number;
    durationSeconds: number;
    polyline: [number, number][];
  }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/route?from=${from.lat},${from.lng}&to=${to.lat},${to.lng}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend route failed:', e);
      }
    }

    const steps = 8;
    const polyline: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = from.lat + (to.lat - from.lat) * t + Math.sin(t * Math.PI) * 0.003;
      const lng = from.lng + (to.lng - from.lng) * t;
      polyline.push([lat, lng]);
    }
    
    const rad = Math.PI / 180;
    const dLat = (to.lat - from.lat) * rad;
    const dLng = (to.lng - from.lng) * rad;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from.lat * rad) * Math.cos(to.lat * rad) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceMeters = Math.round(6371000 * c);
    const durationSeconds = Math.round(distanceMeters / 11);

    return { distanceMeters, durationSeconds, polyline };
  }

  // On-site AI assistant chat
  async chatAssistant(params: {
    message: string;
    destinationName?: string;
    tripId?: string;
  }, token?: string): Promise<{ reply: string; sources?: string[] }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
          method: 'POST',
          headers: this.getAuthHeaders(token),
          body: JSON.stringify(params)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend assistant chat failed, using local grounding fallback:', e);
      }
    }

    const q = params.message.toLowerCase();
    const dest = params.destinationName || 'your destination';

    if (q.includes('day 2') || q.includes('day two')) {
      return {
        reply: `For Day 2 in ${dest}, your plan spotlights Coastal Cuisine & Quiet Beaches. Morning: browse boutique artisan studios in Assagao. Lunch: feast at Gunpowder (their Kerala mutton fry & appams are rated 5/5 by travelers). Evening: take a tranquil sunset stroll at Morjim beach.`,
        sources: ['Approved Itinerary Day 2', 'Review by Ananya Sharma']
      };
    }

    if (q.includes('eat') || q.includes('cheap') || q.includes('food') || q.includes('restaurant')) {
      return {
        reply: `In ${dest}, verified travelers recommend Gunpowder in Assagao (casual South Indian coastal, approx ₹800/person) and Mum’s Kitchen in Panaji for heritage Goan fish curry rice. Both have approved 4.8★ reviews.`,
        sources: ['Wayfarer Approved Reviews', 'Community Dining Guide']
      };
    }

    if (q.includes('hotel') || q.includes('stay') || q.includes('book')) {
      return {
        reply: `Top rated accommodations for ${dest} include The Postcard Moira (214-year-old restored Portuguese estate, ₹18,500/night) and Ahilya by the Sea (seafront villa at Dolphin Bay, ₹24,000/night). You can reserve directly via verified partner links.`,
        sources: ['Wayfarer Hotel Directory']
      };
    }

    return {
      reply: `I am your Wayfarer travel guide. Based on verified listings and itineraries for ${dest}, I can help you with day-by-day timing, vetted hotel recommendations, and walking routes. What would you like to explore next?`,
      sources: ['Wayfarer Knowledge Base']
    };
  }

  // Telegram Connect
  async connectTelegram(botToken: string, token?: string): Promise<{ success: boolean; botUsername: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/telegram/connect`, {
          method: 'POST',
          headers: this.getAuthHeaders(token),
          body: JSON.stringify({ token: botToken })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend telegram connect failed, using fallback:', e);
      }
    }

    return {
      success: true,
      botUsername: 'WayfarerTripGuideBot'
    };
  }

  // Telegram Disconnect
  async disconnectTelegram(token?: string): Promise<{ success: boolean }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/telegram/disconnect`, {
          method: 'POST',
          headers: this.getAuthHeaders(token)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend telegram disconnect failed:', e);
      }
    }
    return { success: true };
  }

  // Telegram Status
  async getTelegramStatus(token?: string): Promise<{ connected: boolean; botUsername?: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/telegram/status`, {
          headers: this.getAuthHeaders(token)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend telegram status check failed:', e);
      }
    }
    return { connected: false };
  }
}

export const wayfarerApi = new WayfarerApiClient();
