export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
  telegram?: {
    chatId?: string;
    botUsername?: string;
    connected: boolean;
  };
}

export interface DestinationSearchResult {
  geoId: string;
  name: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  type: 'city' | 'town' | 'attraction' | 'region';
}

export interface Destination {
  id: string;
  geoId?: string;
  slug: string;
  name: string;
  region?: string;
  country: string;
  countryCode?: string;
  flag?: string;
  heroImage: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
  sourceBadge?: string; // e.g. "From OpenStreetMap", "Wikipedia"
  photoCredit?: string;
}

export type PlaceCategory = 
  | 'Essentials'
  | 'Family friendly'
  | 'Hidden gems'
  | 'Museums'
  | 'Outdoors'
  | 'Arts and theatre'
  | 'Nightlife'
  | 'Historical';

export interface Place {
  id: string;
  destinationId: string;
  name: string;
  category: PlaceCategory;
  description: string;
  lat: number;
  lng: number;
  estimatedCost: number;
  currency: string;
  photos: string[];
  source: 'geoapify' | 'admin' | 'osm' | 'wikipedia';
  sourceBadge?: string; // "From OpenStreetMap", "Wikipedia"
  photoCredit?: string;
  externalRating?: number;
  externalRatingSource?: string;
  avgRating: number;
  reviewCount: number;
  status: 'published' | 'hidden';
  distanceKm?: number;
}

export interface Hotel {
  id: string;
  destinationId: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  address: string;
  photos: string[];
  pricePerNight: number;
  currency: string;
  amenities: string[];
  starClass: number;
  affiliateUrl: string;
  affiliateProvider: 'booking' | 'agoda' | 'other';
  source: 'admin' | 'amadeus';
  sourceBadge?: string;
  photoCredit?: string;
  avgRating: number;
  reviewCount: number;
  featured: boolean;
  status: 'published' | 'hidden';
  clicks: number;
}

export interface Restaurant {
  id: string;
  destinationId: string;
  name: string;
  cuisines: string[];
  priceLevel: 1 | 2 | 3 | 4;
  lat: number;
  lng: number;
  photos: string[];
  reservationUrl?: string;
  avgRating: number;
  reviewCount: number;
  status: 'published' | 'hidden';
  sourceBadge?: string;
  photoCredit?: string;
  distanceKm?: number;
}

export interface Review {
  id: string;
  targetType: 'place' | 'hotel' | 'restaurant';
  targetId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number; // 1-5
  title: string;
  body: string;
  photos: string[];
  visitDate: string;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  reportCount: number;
  createdAt: string;
}

export interface Report {
  id: string;
  reviewId: string;
  reporterId: string;
  reason: string;
  createdAt: string;
  resolved: boolean;
}

export interface ForumThread {
  id: string;
  destinationId: string;
  userId: string;
  title: string;
  body: string;
  replyCount: number;
  createdAt: string;
}

export type TransportPreference = 'flight' | 'train' | 'bus' | 'any';

export interface TransportOption {
  id: string;
  mode: 'flight' | 'train' | 'bus';
  carrier: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  bookingUrl: string;
  fareLabel?: 'Estimate' | 'Recent fare';
  fareDate?: string;
}

export interface TripActivity {
  id: string;
  timeSlot: string; // "09:00 AM", "01:30 PM", etc.
  title: string;
  description: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  costEstimate: number;
  currency: string;
}

export interface DayPlan {
  day: number;
  title: string;
  theme: string;
  activities: TripActivity[];
}

export interface Trip {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  destinationId?: string;
  destinationGeoId?: string;
  budget: number;
  currency: string;
  days: number;
  transportPreference: TransportPreference;
  createdAt: string;
  shareId?: string;
  isPublic: boolean;
}

export interface Itinerary {
  tripId: string;
  destinationId: string;
  places: Place[];
  transportOptions: TransportOption[];
  hotelOptions: Hotel[];
  dayPlan: DayPlan[];
}

export interface AffiliateClick {
  id: string;
  hotelId: string;
  hotelName: string;
  userId?: string;
  ts: string;
  destinationId: string;
  provider: string;
}
