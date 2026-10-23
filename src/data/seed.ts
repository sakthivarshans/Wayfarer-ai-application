import { Destination, Place, Hotel, Restaurant, Review, Trip, Itinerary } from '../types';

export const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'dest_amalfi',
    slug: 'amalfi-coast',
    name: 'Amalfi Coast',
    country: 'Italy',
    heroImage: '/src/assets/images/destination_amalfi_1792651128378.jpg',
    description: 'Dramatic limestone cliffs, pastel villages clinging to steep slopes, and sparkling sapphire Mediterranean waters.',
    lat: 40.6340,
    lng: 14.6027,
    tags: ['Scenic Coastline', 'Mediterranean Cuisine', 'Cliffside Architecture', 'Romantic']
  },
  {
    id: 'dest_kyoto',
    slug: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    heroImage: '/src/assets/images/destination_kyoto_1792651129273.jpg',
    description: 'The cultural heart of Japan with thousands of classical Buddhist temples, serene Zen gardens, historic machiya, and bamboo groves.',
    lat: 35.0116,
    lng: 135.7681,
    tags: ['Historic Temples', 'Zen Gardens', 'Traditional Machiya', 'Tea Ceremony']
  },
  {
    id: 'dest_goa',
    slug: 'goa',
    name: 'Goa',
    country: 'India',
    heroImage: '/src/assets/images/destination_goa_1792651128327.jpg',
    description: 'Sun-kissed beaches, swaying palms, Portuguese colonial architecture, and lively seaside spice shacks along the Arabian Sea.',
    lat: 15.2993,
    lng: 74.1240,
    tags: ['Sun & Sand', 'Heritage Villas', 'Seafood', 'Coastal Serenity']
  }
];

export const SEED_PLACES: Place[] = [
  // Amalfi Places
  {
    id: 'place_amalfi_1',
    destinationId: 'dest_amalfi',
    name: 'Duomo di Amalfi (Cathedral of St. Andrew)',
    category: 'Essentials',
    description: '9th-century cathedral in Piazza del Duomo featuring striped Byzantine-Norman-Arab facade and bronze doors from Constantinople.',
    lat: 40.6345,
    lng: 14.6028,
    estimatedCost: 350,
    currency: 'INR',
    photos: ['/src/assets/images/destination_amalfi_1792651128378.jpg'],
    source: 'admin',
    avgRating: 4.8,
    reviewCount: 12,
    status: 'published'
  },
  {
    id: 'place_amalfi_2',
    destinationId: 'dest_amalfi',
    name: 'Path of the Gods (Sentiero degli Dei)',
    category: 'Outdoors',
    description: 'A spectacular cliffside hiking trail from Bomerano to Nocelle offering breathtaking aerial panoramas of the Amalfi coastline.',
    lat: 40.6312,
    lng: 14.5420,
    estimatedCost: 0,
    currency: 'INR',
    photos: ['/src/assets/images/hero_wayfarer_travel_1792651127301.jpg'],
    source: 'geoapify',
    externalRating: 4.9,
    externalRatingSource: 'Geoapify/OSM',
    avgRating: 0,
    reviewCount: 0,
    status: 'published'
  },
  {
    id: 'place_amalfi_3',
    destinationId: 'dest_amalfi',
    name: 'Villa Cimbrone Gardens (Ravello)',
    category: 'Hidden gems',
    description: 'Historic estate famous for its Belvedere of Infinity, a marble balcony perched high above the Mediterranean.',
    lat: 40.6475,
    lng: 14.6111,
    estimatedCost: 850,
    currency: 'INR',
    photos: ['/src/assets/images/destination_amalfi_1792651128378.jpg'],
    source: 'admin',
    avgRating: 4.7,
    reviewCount: 8,
    status: 'published'
  },
  {
    id: 'place_amalfi_4',
    destinationId: 'dest_amalfi',
    name: 'Museo della Carta (Paper Mill Museum)',
    category: 'Museums',
    description: 'Fascinating working museum located in a 13th-century paper mill demonstrating the ancient craft of handmade Bambagina paper.',
    lat: 40.6382,
    lng: 14.6015,
    estimatedCost: 450,
    currency: 'INR',
    photos: ['/src/assets/images/destination_amalfi_1792651128378.jpg'],
    source: 'admin',
    avgRating: 4.5,
    reviewCount: 2,
    status: 'published'
  },

  // Kyoto Places
  {
    id: 'place_kyoto_1',
    destinationId: 'dest_kyoto',
    name: 'Fushimi Inari Taisha',
    category: 'Essentials',
    description: 'Iconic Shinto shrine renowned for its winding paths beneath over 10,000 vibrant vermilion torii gates winding up sacred Mount Inari.',
    lat: 34.9671,
    lng: 135.7727,
    estimatedCost: 0,
    currency: 'INR',
    photos: ['/src/assets/images/destination_kyoto_1792651129273.jpg'],
    source: 'admin',
    avgRating: 4.9,
    reviewCount: 24,
    status: 'published'
  },
  {
    id: 'place_kyoto_2',
    destinationId: 'dest_kyoto',
    name: 'Kinkaku-ji (The Golden Pavilion)',
    category: 'Historical',
    description: 'Zen Buddhist temple whose top two floors are completely covered in pure gold leaf, mirrored gracefully on the mirror pond.',
    lat: 35.0394,
    lng: 135.7292,
    estimatedCost: 300,
    currency: 'INR',
    photos: ['/src/assets/images/destination_kyoto_1792651129273.jpg'],
    source: 'admin',
    avgRating: 4.7,
    reviewCount: 16,
    status: 'published'
  },
  {
    id: 'place_kyoto_3',
    destinationId: 'dest_kyoto',
    name: 'Arashiyama Bamboo Grove',
    category: 'Outdoors',
    description: 'A soaring natural tunnel of towering green bamboo stalks that whisper and sway in the mountain wind.',
    lat: 35.0169,
    lng: 135.6713,
    estimatedCost: 0,
    currency: 'INR',
    photos: ['/src/assets/images/destination_kyoto_1792651129273.jpg'],
    source: 'geoapify',
    externalRating: 4.6,
    externalRatingSource: 'Geoapify/OSM',
    avgRating: 4.6,
    reviewCount: 3,
    status: 'published'
  },

  // Goa Places
  {
    id: 'place_goa_1',
    destinationId: 'dest_goa',
    name: 'Basilica of Bom Jesus',
    category: 'Essentials',
    description: 'UNESCO World Heritage 16th-century baroque basilica holding the mortal remains of St. Francis Xavier in Old Goa.',
    lat: 15.5009,
    lng: 73.9116,
    estimatedCost: 0,
    currency: 'INR',
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg'],
    source: 'admin',
    avgRating: 4.7,
    reviewCount: 18,
    status: 'published'
  },
  {
    id: 'place_goa_2',
    destinationId: 'dest_goa',
    name: 'Fontainhas Latin Quarter',
    category: 'Hidden gems',
    description: 'Asia’s oldest surviving Latin Quarter with cobblestone alleys, ochre-and-indigo Portuguese villas, and ornate iron balconies.',
    lat: 15.4989,
    lng: 73.8278,
    estimatedCost: 0,
    currency: 'INR',
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg'],
    source: 'admin',
    avgRating: 4.8,
    reviewCount: 6,
    status: 'published'
  },
  {
    id: 'place_goa_3',
    destinationId: 'dest_goa',
    name: 'Cabo de Rama Fort & Cliff Overlook',
    category: 'Outdoors',
    description: 'Atmospheric medieval coastal fort perched atop a dramatic promontory with panoramic views across South Goa’s coastline.',
    lat: 15.0886,
    lng: 73.9234,
    estimatedCost: 50,
    currency: 'INR',
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg'],
    source: 'geoapify',
    externalRating: 4.5,
    externalRatingSource: 'Geoapify/OSM',
    avgRating: 0,
    reviewCount: 0,
    status: 'published'
  }
];

export const SEED_HOTELS: Hotel[] = [
  // Amalfi Hotels
  {
    id: 'hotel_amalfi_1',
    destinationId: 'dest_amalfi',
    name: 'Hotel Santa Caterina',
    description: 'Art Nouveau villa built into cliffs overlooking Amalfi harbor with saltwater swimming pool carved into rock and private beach club.',
    lat: 40.6300,
    lng: 14.5950,
    address: 'Via Mauro Comite 9, 84011 Amalfi, Italy',
    photos: ['/src/assets/images/destination_amalfi_1792651128378.jpg'],
    pricePerNight: 38500,
    currency: 'INR',
    amenities: ['Private Beach', 'Saltwater Pool', 'Spa & Wellness', 'Michelin Restaurant', 'Free Wi-Fi', 'Valet Parking'],
    starClass: 5,
    affiliateUrl: 'https://www.booking.com/hotel/it/santa-caterina.html?aid=wayfarer_demo',
    affiliateProvider: 'booking',
    source: 'admin',
    avgRating: 4.9,
    reviewCount: 14,
    featured: true,
    status: 'published',
    clicks: 128
  },
  {
    id: 'hotel_amalfi_2',
    destinationId: 'dest_amalfi',
    name: 'Marina Riviera Hotel',
    description: 'Central sea-facing Mediterranean hotel with rooftop infinity pool and panoramic sun terrace right above the Amalfi beach.',
    lat: 40.6329,
    lng: 14.6010,
    address: 'Via Pantaleone Comite 19, 84011 Amalfi, Italy',
    photos: ['/src/assets/images/hero_wayfarer_travel_1792651127301.jpg'],
    pricePerNight: 22400,
    currency: 'INR',
    amenities: ['Rooftop Pool', 'Sea View Terrace', 'Bar & Lounge', 'Airport Shuttle', 'Air Conditioning'],
    starClass: 4,
    affiliateUrl: 'https://www.agoda.com/partners/partnersearch.aspx?cid=wayfarer_demo&hid=marina-riviera',
    affiliateProvider: 'agoda',
    source: 'admin',
    avgRating: 4.6,
    reviewCount: 9,
    featured: false,
    status: 'published',
    clicks: 74
  },

  // Kyoto Hotels
  {
    id: 'hotel_kyoto_1',
    destinationId: 'dest_kyoto',
    name: 'Hoshinoya Kyoto',
    description: 'Secluded riverside sanctuary in Arashiyama accessed by traditional wooden riverboat, featuring hinoki wood baths and river-facing pavilions.',
    lat: 35.0135,
    lng: 135.6690,
    address: '11-2 Genrokuzan, Arashiyama, Nishikyo-ku, Kyoto',
    photos: ['/src/assets/images/destination_kyoto_1792651129273.jpg'],
    pricePerNight: 46000,
    currency: 'INR',
    amenities: ['Riverboat Transfer', 'Zen Garden', 'Traditional Kaiseki', 'Tea Salon', 'Hinoki Bathtubs'],
    starClass: 5,
    affiliateUrl: 'https://www.booking.com/hotel/jp/hoshinoya-kyoto.html?aid=wayfarer_demo',
    affiliateProvider: 'booking',
    source: 'admin',
    avgRating: 4.9,
    reviewCount: 22,
    featured: true,
    status: 'published',
    clicks: 215
  },
  {
    id: 'hotel_kyoto_2',
    destinationId: 'dest_kyoto',
    name: 'Gion Machiya Heritage Stay',
    description: 'Thoughtfully restored 120-year-old wooden townhouse with tatami rooms, tsuboniwa courtyard garden, and modern Japanese minimalist finishes.',
    lat: 35.0035,
    lng: 135.7760,
    address: 'Miyagawasuji 4-chome, Higashiyama-ku, Kyoto',
    photos: ['/src/assets/images/destination_kyoto_1792651129273.jpg'],
    pricePerNight: 16800,
    currency: 'INR',
    amenities: ['Private Courtyard Garden', 'Modern Kitchen', 'Tatami Rooms', 'Washer/Dryer', 'Wi-Fi'],
    starClass: 4,
    affiliateUrl: 'https://www.agoda.com/partners/partnersearch.aspx?cid=wayfarer_demo&hid=gion-machiya',
    affiliateProvider: 'agoda',
    source: 'admin',
    avgRating: 4.7,
    reviewCount: 7,
    featured: false,
    status: 'published',
    clicks: 92
  },

  // Goa Hotels
  {
    id: 'hotel_goa_1',
    destinationId: 'dest_goa',
    name: 'The Postcard Moira',
    description: 'A 214-year-old restored Portuguese estate in the quiet heritage village of Moira with tropical courtyard pool and bespoke Goan cuisine.',
    lat: 15.6025,
    lng: 73.8420,
    address: 'Feira Alta, Moira, Bardez, Goa 403507',
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg'],
    pricePerNight: 18500,
    currency: 'INR',
    amenities: ['Ayurvedic Spa', 'Courtyard Pool', 'Artisan Dining', 'Heritage Architecture', 'Bicycle Tours'],
    starClass: 5,
    affiliateUrl: 'https://www.booking.com/hotel/in/the-postcard-moira.html?aid=wayfarer_demo',
    affiliateProvider: 'booking',
    source: 'admin',
    avgRating: 4.8,
    reviewCount: 19,
    featured: true,
    status: 'published',
    clicks: 164
  },
  {
    id: 'hotel_goa_2',
    destinationId: 'dest_goa',
    name: 'Ahilya by the Sea (Nerul)',
    description: 'Private family villa perched on Dolphin Bay where the Mandovi River meets the Arabian Sea, surrounded by lush banyan and frangipani trees.',
    lat: 15.5050,
    lng: 73.7850,
    address: 'Coco Beach, Nerul, Bardez, Goa 403109',
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg'],
    pricePerNight: 24000,
    currency: 'INR',
    amenities: ['Two Infinity Pools', 'Seafront Dining', 'Spa Treatments', 'Lush Gardens', 'Curated Library'],
    starClass: 5,
    affiliateUrl: 'https://www.agoda.com/partners/partnersearch.aspx?cid=wayfarer_demo&hid=ahilya-by-sea',
    affiliateProvider: 'agoda',
    source: 'admin',
    avgRating: 4.9,
    reviewCount: 11,
    featured: false,
    status: 'published',
    clicks: 110
  }
];

export const SEED_RESTAURANTS: Restaurant[] = [
  // Amalfi Restaurants
  {
    id: 'rest_amalfi_1',
    destinationId: 'dest_amalfi',
    name: 'Ristorante Marina Grande',
    cuisines: ['Campanian Seafood', 'Fresh Pasta', 'Amalfi Lemons'],
    priceLevel: 3,
    lat: 40.6335,
    lng: 14.6015,
    photos: ['/src/assets/images/destination_amalfi_1792651128378.jpg'],
    reservationUrl: 'https://www.ristorantemarinagrande.com',
    avgRating: 4.8,
    reviewCount: 15,
    status: 'published'
  },
  {
    id: 'rest_amalfi_2',
    destinationId: 'dest_amalfi',
    name: 'Trattoria Da Gemma',
    cuisines: ['Handmade Scialatielli', 'Zuppa di Pesce', 'Classic Italian'],
    priceLevel: 2,
    lat: 40.6342,
    lng: 14.6022,
    photos: ['/src/assets/images/hero_wayfarer_travel_1792651127301.jpg'],
    reservationUrl: 'https://www.trattoriadagemma.com',
    avgRating: 4.6,
    reviewCount: 8,
    status: 'published'
  },

  // Kyoto Restaurants
  {
    id: 'rest_kyoto_1',
    destinationId: 'dest_kyoto',
    name: 'Gion Karyo Kaiseki',
    cuisines: ['Seasonal Kaiseki', 'Kyoto Vegetable Kyoto-ryori', 'Sake Pairing'],
    priceLevel: 4,
    lat: 35.0028,
    lng: 135.7755,
    photos: ['/src/assets/images/destination_kyoto_1792651129273.jpg'],
    reservationUrl: 'https://karyo-kyoto.jp/en',
    avgRating: 4.9,
    reviewCount: 20,
    status: 'published'
  },
  {
    id: 'rest_kyoto_2',
    destinationId: 'dest_kyoto',
    name: 'Honke Owariya (Since 1465)',
    cuisines: ['Soba Noodles', 'Hourai Soba', 'Japanese Heritage'],
    priceLevel: 2,
    lat: 35.0118,
    lng: 135.7610,
    photos: ['/src/assets/images/destination_kyoto_1792651129273.jpg'],
    reservationUrl: 'https://honke-owariya.co.jp',
    avgRating: 4.7,
    reviewCount: 14,
    status: 'published'
  },

  // Goa Restaurants
  {
    id: 'rest_goa_1',
    destinationId: 'dest_goa',
    name: 'Gunpowder (Assagao)',
    cuisines: ['South Indian Coastal', 'Kerala Beef Fry', 'Malabar Parottas'],
    priceLevel: 2,
    lat: 15.5862,
    lng: 73.7745,
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg'],
    reservationUrl: 'https://www.instagram.com/gunpowdergoa',
    avgRating: 4.8,
    reviewCount: 28,
    status: 'published'
  },
  {
    id: 'rest_goa_2',
    destinationId: 'dest_goa',
    name: 'Mum’s Kitchen (Panaji)',
    cuisines: ['Authentic Goan Heritage', 'Fish Curry Rice', 'Bebinca'],
    priceLevel: 3,
    lat: 15.4955,
    lng: 73.8180,
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg'],
    reservationUrl: 'https://www.mumskitchengoa.com',
    avgRating: 4.6,
    reviewCount: 16,
    status: 'published'
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    targetType: 'hotel',
    targetId: 'hotel_amalfi_1',
    userId: 'user_sophia',
    userName: 'Sophia Chen',
    userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'The saltwater pool cliff elevator is unforgettable',
    body: 'We stayed 4 nights here during our anniversary. The descent in the cliffside glass elevator down to the private sea cove was magical. Service is warm and unpretentious.',
    photos: ['/src/assets/images/destination_amalfi_1792651128378.jpg'],
    visitDate: '2026-06-12',
    helpfulCount: 18,
    status: 'approved',
    reportCount: 0,
    createdAt: '2026-06-16T10:00:00Z'
  },
  {
    id: 'rev_2',
    targetType: 'place',
    targetId: 'place_kyoto_1',
    userId: 'user_marcus',
    userName: 'Marcus Vance',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Hike all the way to the summit at 6:30 AM',
    body: 'Avoid the daytime tourist crowds by starting before 7:00 AM. The air was cool, the lantern lights were flicking off, and the forest silence was spiritually moving.',
    photos: ['/src/assets/images/destination_kyoto_1792651129273.jpg'],
    visitDate: '2026-09-04',
    helpfulCount: 24,
    status: 'approved',
    reportCount: 0,
    createdAt: '2026-09-06T14:20:00Z'
  },
  {
    id: 'rev_3',
    targetType: 'restaurant',
    targetId: 'rest_goa_1',
    userId: 'user_ananya',
    userName: 'Ananya Sharma',
    userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Best coastal culinary experience in Goa',
    body: 'The Kerala parottas paired with mutton pepper fry and kokum cooler under the banyan tree canopy is worth the drive to Assagao every single trip.',
    photos: ['/src/assets/images/destination_goa_1792651128327.jpg'],
    visitDate: '2026-10-10',
    helpfulCount: 9,
    status: 'approved',
    reportCount: 0,
    createdAt: '2026-10-12T18:00:00Z'
  },
  {
    id: 'rev_pending_1',
    targetType: 'place',
    targetId: 'place_amalfi_1',
    userId: 'user_test_moderation',
    userName: 'David Miller',
    rating: 4,
    title: 'Stunning mosaic facade but steep entrance staircase',
    body: 'The Norman Arab cloister (Chiostro del Paradiso) is peaceful. Just be prepared for the 62 steep stairs leading up to the main atrium.',
    photos: [],
    visitDate: '2026-10-19',
    helpfulCount: 0,
    status: 'pending',
    reportCount: 0,
    createdAt: '2026-10-20T08:30:00Z'
  }
];

export const SEED_DEMO_TRIP: Trip = {
  id: 'trip_demo_101',
  userId: 'user_wayfarer_demo',
  origin: 'Mumbai',
  destination: 'Goa',
  destinationId: 'dest_goa',
  budget: 65000,
  currency: 'INR',
  days: 3,
  transportPreference: 'flight',
  createdAt: '2026-10-20T12:00:00Z',
  shareId: 'goa-autumn-getaway-2026',
  isPublic: true
};

export const SEED_DEMO_ITINERARY: Itinerary = {
  tripId: 'trip_demo_101',
  destinationId: 'dest_goa',
  places: SEED_PLACES.filter(p => p.destinationId === 'dest_goa'),
  transportOptions: [
    {
      id: 'trans_1',
      mode: 'flight',
      carrier: 'IndiGo 6E-241',
      departureTime: '07:15 AM',
      arrivalTime: '08:35 AM',
      duration: '1h 20m',
      price: 4200,
      currency: 'INR',
      bookingUrl: 'https://www.goindigo.in'
    },
    {
      id: 'trans_2',
      mode: 'train',
      carrier: 'Vande Bharat Express 22229',
      departureTime: '05:25 AM',
      arrivalTime: '01:10 PM',
      duration: '7h 45m',
      price: 1850,
      currency: 'INR',
      bookingUrl: 'https://www.irctc.co.in'
    }
  ],
  hotelOptions: SEED_HOTELS.filter(h => h.destinationId === 'dest_goa'),
  dayPlan: [
    {
      day: 1,
      title: 'Old Goa Heritage & Latin Alleys',
      theme: 'Colonial Architecture & Heritage Flavors',
      activities: [
        {
          id: 'act_1',
          timeSlot: '10:00 AM',
          title: 'Explore Basilica of Bom Jesus & Se Cathedral',
          description: 'Walk through 16th-century baroque architecture and the mortal shrine of St. Francis Xavier.',
          costEstimate: 0,
          currency: 'INR',
          placeId: 'place_goa_1',
          lat: 15.5009,
          lng: 73.9116
        },
        {
          id: 'act_2',
          timeSlot: '01:30 PM',
          title: 'Lunch at Mum’s Kitchen in Panaji',
          description: 'Savor traditional Goan fish curry with local red rice and sol kadi.',
          costEstimate: 1400,
          currency: 'INR'
        },
        {
          id: 'act_3',
          timeSlot: '04:00 PM',
          title: 'Heritage Walk through Fontainhas',
          description: 'Photograph the ochre Portuguese villas, colorful tile plaques, and azulejos.',
          costEstimate: 0,
          currency: 'INR',
          placeId: 'place_goa_2',
          lat: 15.4989,
          lng: 73.8278
        }
      ]
    },
    {
      day: 2,
      title: 'North Goa Culinary & Coastal Sunset',
      theme: 'Coastal Cuisine & Quiet Beaches',
      activities: [
        {
          id: 'act_4',
          timeSlot: '11:00 AM',
          title: 'Boutique Shopping & Coffee in Assagao',
          description: 'Browse artisan studios and relax in heritage garden courtyards.',
          costEstimate: 800,
          currency: 'INR'
        },
        {
          id: 'act_5',
          timeSlot: '01:30 PM',
          title: 'Lunch at Gunpowder',
          description: 'Outdoor courtyard feast with Kerala beef fry and soft appams.',
          costEstimate: 1600,
          currency: 'INR'
        },
        {
          id: 'act_6',
          timeSlot: '05:30 PM',
          title: 'Sunset Walk at Morjim / Ashvem Beach',
          description: 'Quiet sandy shores, sea breeze, and evening sunset glow.',
          costEstimate: 0,
          currency: 'INR'
        }
      ]
    },
    {
      day: 3,
      title: 'South Goa Cliff Panoramas',
      theme: 'Dramatic Coastal Overlooks',
      activities: [
        {
          id: 'act_7',
          timeSlot: '10:30 AM',
          title: 'Visit Cabo de Rama Fort',
          description: 'Hike to the ancient cliff battlements overlooking the sapphire Arabian sea.',
          costEstimate: 100,
          currency: 'INR',
          placeId: 'place_goa_3',
          lat: 15.0886,
          lng: 73.9234
        },
        {
          id: 'act_8',
          timeSlot: '02:00 PM',
          title: 'Seaside lunch and dip at Palolem Bay',
          description: 'Fresh coconut water, grilled prawns, and calm turquoise water.',
          costEstimate: 1800,
          currency: 'INR'
        }
      ]
    }
  ]
};
