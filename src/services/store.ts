import {
  Destination,
  Place,
  Hotel,
  Restaurant,
  Review,
  Report,
  Trip,
  Itinerary,
  AffiliateClick
} from '../types';
import {
  SEED_DESTINATIONS,
  SEED_PLACES,
  SEED_HOTELS,
  SEED_RESTAURANTS,
  SEED_REVIEWS,
  SEED_DEMO_TRIP,
  SEED_DEMO_ITINERARY
} from '../data/seed';

const STORAGE_KEY = 'wayfarer_data_v1';

interface WayfarerDatabase {
  destinations: Destination[];
  places: Place[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  reviews: Review[];
  reports: Report[];
  trips: Trip[];
  itineraries: Record<string, Itinerary>;
  affiliateClicks: AffiliateClick[];
  bannedUsers: string[];
}

function loadInitialData(): WayfarerDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored data:', e);
  }

  const initial: WayfarerDatabase = {
    destinations: SEED_DESTINATIONS,
    places: SEED_PLACES,
    hotels: SEED_HOTELS,
    restaurants: SEED_RESTAURANTS,
    reviews: SEED_REVIEWS,
    reports: [],
    trips: [SEED_DEMO_TRIP],
    itineraries: { [SEED_DEMO_TRIP.id]: SEED_DEMO_ITINERARY },
    affiliateClicks: [
      {
        id: 'click_1',
        hotelId: 'hotel_amalfi_1',
        hotelName: 'Hotel Santa Caterina',
        destinationId: 'dest_amalfi',
        provider: 'booking',
        ts: '2026-10-18T14:22:00Z'
      },
      {
        id: 'click_2',
        hotelId: 'hotel_kyoto_1',
        hotelName: 'Hoshinoya Kyoto',
        destinationId: 'dest_kyoto',
        provider: 'booking',
        ts: '2026-10-19T09:15:00Z'
      },
      {
        id: 'click_3',
        hotelId: 'hotel_goa_1',
        hotelName: 'The Postcard Moira',
        destinationId: 'dest_goa',
        provider: 'booking',
        ts: '2026-10-20T16:40:00Z'
      }
    ],
    bannedUsers: []
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    console.error('Failed to initialize local storage:', e);
  }

  return initial;
}

class WayfarerStore {
  private data: WayfarerDatabase = loadInitialData();
  private listeners: Set<() => void> = new Set();

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving data:', e);
    }
    this.listeners.forEach(cb => cb());
  }

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Reset to default seed data
  resetToSeed() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = loadInitialData();
    this.persist();
  }

  // --- DESTINATIONS ---
  getDestinations(): Destination[] {
    return this.data.destinations;
  }

  getDestinationBySlug(slug: string): Destination | undefined {
    return this.data.destinations.find(d => d.slug === slug);
  }

  getDestinationById(id: string): Destination | undefined {
    return this.data.destinations.find(d => d.id === id);
  }

  saveDestination(dest: Destination) {
    const idx = this.data.destinations.findIndex(d => d.id === dest.id);
    if (idx >= 0) {
      this.data.destinations[idx] = dest;
    } else {
      this.data.destinations.unshift(dest);
    }
    this.persist();
  }

  deleteDestination(id: string) {
    this.data.destinations = this.data.destinations.filter(d => d.id !== id);
    this.persist();
  }

  // --- PLACES ---
  getPlaces(destinationId?: string): Place[] {
    if (destinationId) {
      return this.data.places.filter(p => p.destinationId === destinationId);
    }
    return this.data.places;
  }

  getPlaceById(id: string): Place | undefined {
    return this.data.places.find(p => p.id === id);
  }

  savePlace(place: Place) {
    const idx = this.data.places.findIndex(p => p.id === place.id);
    if (idx >= 0) {
      this.data.places[idx] = place;
    } else {
      this.data.places.unshift(place);
    }
    this.persist();
  }

  deletePlace(id: string) {
    this.data.places = this.data.places.filter(p => p.id !== id);
    this.persist();
  }

  // --- HOTELS ---
  getHotels(destinationId?: string): Hotel[] {
    if (destinationId) {
      return this.data.hotels.filter(h => h.destinationId === destinationId);
    }
    return this.data.hotels;
  }

  getHotelById(id: string): Hotel | undefined {
    return this.data.hotels.find(h => h.id === id);
  }

  saveHotel(hotel: Hotel) {
    const idx = this.data.hotels.findIndex(h => h.id === hotel.id);
    if (idx >= 0) {
      this.data.hotels[idx] = hotel;
    } else {
      this.data.hotels.unshift(hotel);
    }
    this.persist();
  }

  deleteHotel(id: string) {
    this.data.hotels = this.data.hotels.filter(h => h.id !== id);
    this.persist();
  }

  bulkAddHotels(hotels: Hotel[]) {
    this.data.hotels.unshift(...hotels);
    this.persist();
  }

  // --- RESTAURANTS ---
  getRestaurants(destinationId?: string): Restaurant[] {
    if (destinationId) {
      return this.data.restaurants.filter(r => r.destinationId === destinationId);
    }
    return this.data.restaurants;
  }

  getRestaurantById(id: string): Restaurant | undefined {
    return this.data.restaurants.find(r => r.id === id);
  }

  saveRestaurant(restaurant: Restaurant) {
    const idx = this.data.restaurants.findIndex(r => r.id === restaurant.id);
    if (idx >= 0) {
      this.data.restaurants[idx] = restaurant;
    } else {
      this.data.restaurants.unshift(restaurant);
    }
    this.persist();
  }

  deleteRestaurant(id: string) {
    this.data.restaurants = this.data.restaurants.filter(r => r.id !== id);
    this.persist();
  }

  // --- REVIEWS ---
  getApprovedReviews(targetId: string): Review[] {
    return this.data.reviews.filter(r => r.targetId === targetId && r.status === 'approved');
  }

  getAllReviews(): Review[] {
    return this.data.reviews;
  }

  createReview(review: Omit<Review, 'id' | 'status' | 'helpfulCount' | 'reportCount' | 'createdAt'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      status: 'pending', // Starts as pending per strict rules
      helpfulCount: 0,
      reportCount: 0,
      createdAt: new Date().toISOString()
    };
    this.data.reviews.unshift(newRev);
    this.persist();
    return newRev;
  }

  voteHelpfulReview(reviewId: string) {
    const rev = this.data.reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.helpfulCount += 1;
      this.persist();
    }
  }

  reportReview(reviewId: string, reporterId: string, reason: string) {
    const rev = this.data.reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.reportCount += 1;
      this.data.reports.push({
        id: `rep_${Date.now()}`,
        reviewId,
        reporterId,
        reason,
        createdAt: new Date().toISOString(),
        resolved: false
      });
      this.persist();
    }
  }

  getReports(): Report[] {
    return this.data.reports;
  }

  updateReviewStatus(reviewId: string, status: 'approved' | 'rejected') {
    const rev = this.data.reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.status = status;
      // Recalculate target avg rating and review count
      this.recalculateTargetRatings(rev.targetType, rev.targetId);
      this.persist();
    }
  }

  banUser(userId: string) {
    if (!this.data.bannedUsers.includes(userId)) {
      this.data.bannedUsers.push(userId);
      // Reject all pending/approved reviews from this user
      this.data.reviews.forEach(r => {
        if (r.userId === userId) {
          r.status = 'rejected';
        }
      });
      this.persist();
    }
  }

  getBannedUsers(): string[] {
    return this.data.bannedUsers;
  }

  private recalculateTargetRatings(targetType: 'place' | 'hotel' | 'restaurant', targetId: string) {
    const approved = this.data.reviews.filter(r => r.targetId === targetId && r.status === 'approved');
    const count = approved.length;
    const avg = count > 0 ? Number((approved.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1)) : 0;

    if (targetType === 'hotel') {
      const h = this.data.hotels.find(x => x.id === targetId);
      if (h) {
        h.avgRating = avg;
        h.reviewCount = count;
      }
    } else if (targetType === 'place') {
      const p = this.data.places.find(x => x.id === targetId);
      if (p) {
        h_set: {
          p.avgRating = avg;
          p.reviewCount = count;
        }
      }
    } else if (targetType === 'restaurant') {
      const r = this.data.restaurants.find(x => x.id === targetId);
      if (r) {
        r.avgRating = avg;
        r.reviewCount = count;
      }
    }
  }

  // --- AFFILIATE TRACKING ---
  recordAffiliateClick(hotelId: string, userId?: string): AffiliateClick {
    const hotel = this.data.hotels.find(h => h.id === hotelId);
    if (hotel) {
      hotel.clicks = (hotel.clicks || 0) + 1;
    }

    const click: AffiliateClick = {
      id: `click_${Date.now()}`,
      hotelId,
      hotelName: hotel?.name || 'Unknown Hotel',
      destinationId: hotel?.destinationId || '',
      provider: hotel?.affiliateProvider || 'booking',
      userId,
      ts: new Date().toISOString()
    };

    this.data.affiliateClicks.unshift(click);
    this.persist();
    return click;
  }

  getAffiliateClicks(): AffiliateClick[] {
    return this.data.affiliateClicks;
  }

  // --- TRIPS & ITINERARIES ---
  getTrips(userId?: string): Trip[] {
    if (userId) {
      return this.data.trips.filter(t => t.userId === userId);
    }
    return this.data.trips;
  }

  getTripById(id: string): Trip | undefined {
    return this.data.trips.find(t => t.id === id || t.shareId === id);
  }

  saveTrip(trip: Trip, itinerary?: Itinerary) {
    const idx = this.data.trips.findIndex(t => t.id === trip.id);
    if (idx >= 0) {
      this.data.trips[idx] = trip;
    } else {
      this.data.trips.unshift(trip);
    }
    if (itinerary) {
      this.data.itineraries[trip.id] = itinerary;
    }
    this.persist();
  }

  getItinerary(tripId: string): Itinerary | undefined {
    return this.data.itineraries[tripId] || (tripId === SEED_DEMO_TRIP.id ? SEED_DEMO_ITINERARY : undefined);
  }
}

export const wayfarerStore = new WayfarerStore();
