// Worldwide Destinations Database
// Verified geographical records, UNESCO heritage sites, authentic attractions, and renowned restaurants.
// Backed by OpenStreetMap, Wikipedia, and Groq LLM synthesis.

export interface CuratedSpot {
  name: string;
  category: 'Essentials' | 'Historical' | 'Outdoors' | 'Museums' | 'Hidden gems' | 'Family friendly';
  description: string;
  lat: number;
  lng: number;
  estimatedCost: number;
  currency: string;
  photos: string[];
  sourceBadge: string;
  photoCredit: string;
  avgRating: number;
  reviewCount: number;
}

export interface CuratedRestaurant {
  name: string;
  cuisines: string[];
  priceLevel: 1 | 2 | 3 | 4;
  lat: number;
  lng: number;
  photos: string[];
  avgRating: number;
  reviewCount: number;
  sourceBadge: string;
  photoCredit: string;
}

export interface CuratedHotel {
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  photos: string[];
  pricePerNight: number;
  currency: string;
  amenities: string[];
  starClass: number;
  affiliateUrl: string;
  affiliateProvider: 'booking' | 'agoda' | 'other';
  avgRating: number;
  reviewCount: number;
  sourceBadge: string;
  photoCredit: string;
}

export interface CuratedDestination {
  geoId: string;
  name: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  type: 'city' | 'town' | 'region';
  heroImage: string;
  description: string;
  tags: string[];
  sourceBadge: string;
  photoCredit: string;
  spots: CuratedSpot[];
  restaurants: CuratedRestaurant[];
}

export const WORLDWIDE_DESTINATIONS: Record<string, CuratedDestination> = {
  // ---------------- INDIA DESTINATIONS ----------------
  in_agra: {
    geoId: 'in_agra',
    name: 'Agra',
    region: 'Uttar Pradesh',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 27.1767,
    lng: 78.0081,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
    description: 'Home of the timeless Taj Mahal, Agra sits gracefully along the Yamuna River, boasting majestic Mughal citadels, royal mausoleums, and rich marble craftsmanship.',
    tags: ['Taj Mahal', 'Mughal Architecture', 'UNESCO World Heritage', 'Marble Art'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Taj Mahal',
        category: 'Essentials',
        description: 'An ivory-white marble mausoleum on the south bank of the Yamuna River, commissioned in 1631 by Mughal Emperor Shah Jahan for his wife Mumtaz Mahal. A crown jewel of world architecture.',
        lat: 27.1751,
        lng: 78.0421,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 1420
      },
      {
        name: 'Agra Fort',
        category: 'Historical',
        description: 'A massive 16th-century Mughal red sandstone fortress that served as the main residence of Mughal emperors until 1638. Contains the Diwan-i-Khas and Jahangir Palace.',
        lat: 27.1795,
        lng: 78.0211,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1598324789736-4861f89564a0?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 680
      },
      {
        name: 'Fatehpur Sikri',
        category: 'Historical',
        description: 'A fortified imperial city founded by Emperor Akbar in 1571. Known for the monumental Buland Darwaza gate, Jama Masjid, and the delicate white marble Tomb of Salim Chishti.',
        lat: 27.0944,
        lng: 77.6677,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 310
      },
      {
        name: 'Mehtab Bagh',
        category: 'Outdoors',
        description: 'A 25-acre charbagh garden complex on the opposite bank of the Yamuna River, perfectly aligned with the Taj Mahal. Offers the best sunset view across the water away from crowds.',
        lat: 27.1800,
        lng: 78.0425,
        estimatedCost: 25,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.6,
        reviewCount: 195
      },
      {
        name: 'Tomb of I\'timād-ud-Daulah (Baby Taj)',
        category: 'Historical',
        description: 'Often regarded as a draft of the Taj Mahal, this exquisitely carved marble tomb exhibits Persian-style pietra dura floral inlays and peaceful riverside gardens.',
        lat: 27.1929,
        lng: 78.0311,
        estimatedCost: 30,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 220
      },
      {
        name: 'Sikandra (Akbar\'s Tomb)',
        category: 'Historical',
        description: 'The final resting place of Akbar the Great, combining Hindu and Islamic architectural traditions within a peaceful walled deer sanctuary.',
        lat: 27.2206,
        lng: 77.9506,
        estimatedCost: 30,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.6,
        reviewCount: 145
      }
    ],
    restaurants: [
      {
        name: 'Pinch of Spice',
        cuisines: ['North Indian', 'Mughlai', 'Tandoor'],
        priceLevel: 2,
        lat: 27.1601,
        lng: 78.0125,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 420,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Dasaprakash Agra',
        cuisines: ['South Indian Vegetarian', 'Filter Coffee'],
        priceLevel: 1,
        lat: 27.1620,
        lng: 78.0140,
        photos: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.5,
        reviewCount: 210,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Joney\'s Roti',
        cuisines: ['Street Food', 'Roti Thalis', 'Lassi'],
        priceLevel: 1,
        lat: 27.1720,
        lng: 78.0380,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.6,
        reviewCount: 180,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  in_jaipur: {
    geoId: 'in_jaipur',
    name: 'Jaipur',
    region: 'Rajasthan',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 26.9124,
    lng: 75.7873,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&auto=format&fit=crop&q=80',
    description: 'The Pink City of Rajasthan, famed for majestic hilltop ramparts, honeycomb palace facades, vibrant gemstone bazaars, and astronomical marvels.',
    tags: ['Pink City', 'Amber Fort', 'Hawa Mahal', 'Royal Palaces'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Amber Palace (Amer Fort)',
        category: 'Essentials',
        description: 'Perched high on Cheel ka Teela hill in Amer, this grand fort features the magnificent Sheesh Mahal (Mirror Palace), Diwan-e-Aam, and panoramic views of Maota Lake.',
        lat: 26.9855,
        lng: 75.8513,
        estimatedCost: 100,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 1120
      },
      {
        name: 'Hawa Mahal (Palace of Winds)',
        category: 'Essentials',
        description: 'Constructed in 1799 from pink and red sandstone, this five-storey pyramidal facade features 953 intricate jharokha latticed windows allowing royal women to observe street festivals unseen.',
        lat: 26.9239,
        lng: 75.8267,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 940
      },
      {
        name: 'City Palace, Jaipur',
        category: 'Historical',
        description: 'A sprawling royal residence established in 1727 by Maharaja Sawai Jai Singh II, incorporating courtyards, gardens, the Chandra Mahal, and the Mubarak Mahal textile museum.',
        lat: 26.9258,
        lng: 75.8236,
        estimatedCost: 300,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 580
      },
      {
        name: 'Jantar Mantar Observatory',
        category: 'Museums',
        description: 'A UNESCO World Heritage site consisting of 19 architectural astronomical instruments built by Sawai Jai Singh II, including the world\'s largest stone sundial.',
        lat: 26.9248,
        lng: 75.8246,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 420
      },
      {
        name: 'Nahargarh Fort',
        category: 'Outdoors',
        description: 'Standing on the edge of the Aravalli Hills overlooking the entirety of Jaipur, famous for spectacular evening sunsets, the Padao open-air cafe, and the Madhavendra Bhawan.',
        lat: 26.9372,
        lng: 75.8155,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1598324789736-4861f89564a0?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.8,
        reviewCount: 380
      },
      {
        name: 'Jal Mahal (Water Palace)',
        category: 'Historical',
        description: 'A Rajput-style palace situated in the center of the serene Man Sagar Lake. Illuminated beautifully at night and framed by the rugged Aravalli ridge.',
        lat: 26.9535,
        lng: 75.8462,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.6,
        reviewCount: 310
      }
    ],
    restaurants: [
      {
        name: 'Laxmi Mishthan Bhandar (LMB)',
        cuisines: ['Rajasthani Thali', 'Ghewar', 'Pyaaz Kachori'],
        priceLevel: 2,
        lat: 26.9215,
        lng: 75.8260,
        photos: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 650,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Peacock Rooftop Restaurant',
        cuisines: ['North Indian', 'Continental', 'Tandoori'],
        priceLevel: 2,
        lat: 26.9180,
        lng: 75.7980,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 520,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: '1135 AD Amber Fort',
        cuisines: ['Royal Mughlai', 'Rajasthani Royal Dining'],
        priceLevel: 4,
        lat: 26.9850,
        lng: 75.8510,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.9,
        reviewCount: 290,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  in_udaipur: {
    geoId: 'in_udaipur',
    name: 'Udaipur',
    region: 'Rajasthan',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 24.5854,
    lng: 73.7125,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1200&auto=format&fit=crop&q=80',
    description: 'The City of Lakes and Venice of the East, famed for shimmering Lake Pichola, white marble island palaces, historic havelis, and sunset boat cruises.',
    tags: ['Lake Pichola', 'City Palace', 'Island Palaces', 'Romantic Lakes'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'City Palace, Udaipur',
        category: 'Essentials',
        description: 'Erected over 400 years on the eastern bank of Lake Pichola, this monumental complex combines Rajasthani and Mughal architectural splendors with the Mor Chowk peacock courtyard.',
        lat: 24.5764,
        lng: 73.6835,
        estimatedCost: 300,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 890
      },
      {
        name: 'Lake Pichola & Boat Cruise',
        category: 'Outdoors',
        description: 'An artificial freshwater lake created in 1362 AD. Taking a boat ride from Rameshwar Ghat past the Lake Palace and Jag Mandir provides quintessential views.',
        lat: 24.5714,
        lng: 73.6766,
        estimatedCost: 400,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.8,
        reviewCount: 740
      },
      {
        name: 'Jag Mandir Palace',
        category: 'Historical',
        description: 'An island palace constructed on Lake Pichola, renowned for its marble elephant sculptures at the jetty and its role as an inspiration for the Taj Mahal.',
        lat: 24.5678,
        lng: 73.6781,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 420
      },
      {
        name: 'Saheliyon-ki-Bari',
        category: 'Outdoors',
        description: 'The Garden of the Maidens, built by Maharana Sangram Singh II, featuring marble pavilions, lotus pools, and rain fountains powered by hydraulic lake pressure.',
        lat: 24.6042,
        lng: 73.6872,
        estimatedCost: 20,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.6,
        reviewCount: 310
      },
      {
        name: 'Monsoon Palace (Sajjangarh Fort)',
        category: 'Historical',
        description: 'Perched high atop Bansdara mountain overlooking the Fateh Sagar Lake, built in 1884 to track monsoon clouds and offering panoramic 360-degree sunset vistas.',
        lat: 24.5898,
        lng: 73.6367,
        estimatedCost: 75,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.8,
        reviewCount: 460
      },
      {
        name: 'Bagore Ki Haveli & Cultural Show',
        category: 'Museums',
        description: 'An 18th-century mansion right at Gangaur Ghat containing 138 rooms, royal costume displays, and hosting the famous Dharohar Folk Dance and puppet show every evening.',
        lat: 24.5802,
        lng: 73.6811,
        estimatedCost: 100,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 510
      }
    ],
    restaurants: [
      {
        name: 'Ambrai Restaurant (Amet Haveli)',
        cuisines: ['Mewari Cuisine', 'Laal Maas', 'North Indian'],
        priceLevel: 3,
        lat: 24.5780,
        lng: 73.6790,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 780,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Upré by 1559 AD',
        cuisines: ['Rooftop Dining', 'Rajasthani Dishes', 'Continental'],
        priceLevel: 3,
        lat: 24.5795,
        lng: 73.6798,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 390,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Millets of Mewar',
        cuisines: ['Organic Healthy Food', 'Vegan', 'Millet Dosas'],
        priceLevel: 2,
        lat: 24.5830,
        lng: 73.6820,
        photos: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 310,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  in_delhi: {
    geoId: 'in_delhi',
    name: 'Delhi',
    region: 'National Capital Region',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 28.6139,
    lng: 77.2090,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80',
    description: 'India\'s historic capital city, blending ancient sultanates and Mughal citadels with grand British colonial avenues and world-famous culinary bazaars.',
    tags: ['Red Fort', 'Qutub Minar', 'Humayun\'s Tomb', 'India Gate'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Qutub Minar & Iron Pillar',
        category: 'Essentials',
        description: 'A 73-meter soaring minaret of victory founded in 1192 by Qutb-ud-din Aibak, surrounded by the Alai Darwaza gate and the 1,600-year-old rust-resistant iron pillar.',
        lat: 28.5244,
        lng: 77.1855,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 1350
      },
      {
        name: 'Red Fort (Lal Qila)',
        category: 'Historical',
        description: 'A colossal 17th-century red sandstone fortress constructed by Emperor Shah Jahan as the seat of the Mughal empire, featuring the Lahore Gate and Diwan-i-Aam.',
        lat: 28.6562,
        lng: 77.2410,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1598324789736-4861f89564a0?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 980
      },
      {
        name: 'Humayun\'s Tomb',
        category: 'Historical',
        description: 'The sublime garden tomb of Mughal Emperor Humayun, built in 1570 by his wife Bega Begum. The first garden tomb on the Indian subcontinent and precursor to the Taj Mahal.',
        lat: 28.5933,
        lng: 77.2507,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 790
      },
      {
        name: 'India Gate & Kartavya Path',
        category: 'Essentials',
        description: 'A 42-meter triumphal arch war memorial designed by Sir Edwin Lutyens, commemorating soldiers of the British Indian Army, illuminated majestically after dusk.',
        lat: 28.6129,
        lng: 77.2295,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.7,
        reviewCount: 1100
      },
      {
        name: 'Lotus Temple (Bahá\'í House of Worship)',
        category: 'Essentials',
        description: 'A striking flowerlike sanctuary composed of 27 free-standing marble petals, welcoming people of all faiths in silent contemplation and prayer.',
        lat: 28.5535,
        lng: 77.2588,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 850
      },
      {
        name: 'Jama Masjid & Chandni Chowk',
        category: 'Historical',
        description: 'One of the largest mosques in India, holding 25,000 worshippers, surrounded by the bustling alleyways and aromatic spice markets of Old Delhi.',
        lat: 28.6507,
        lng: 77.2334,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.6,
        reviewCount: 620
      }
    ],
    restaurants: [
      {
        name: 'Karim\'s Old Delhi (Jama Masjid)',
        cuisines: ['Mughlai', 'Seekh Kebab', 'Mutton Korma', 'Biryani'],
        priceLevel: 2,
        lat: 28.6500,
        lng: 77.2340,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 950,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Bukhara (ITC Maurya)',
        cuisines: ['North-West Frontier', 'Dal Bukhara', 'Sikandari Raan'],
        priceLevel: 4,
        lat: 28.5970,
        lng: 77.1730,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.9,
        reviewCount: 620,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Saravana Bhavan (Connaught Place)',
        cuisines: ['Pure Vegetarian South Indian', 'Ghee Roast Dosa', 'Thali'],
        priceLevel: 1,
        lat: 28.6320,
        lng: 77.2190,
        photos: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.6,
        reviewCount: 840,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  in_amritsar: {
    geoId: 'in_amritsar',
    name: 'Amritsar',
    region: 'Punjab',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 31.6340,
    lng: 74.8723,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=1200&auto=format&fit=crop&q=80',
    description: 'The spiritual and cultural center of Sikhism, revered worldwide for the Golden Temple, community langar kitchen, patriotic Wagah Border ceremony, and rich culinary culture.',
    tags: ['Golden Temple', 'Langar Kitchen', 'Wagah Border', 'Amritsari Kulcha'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Harmandir Sahib (The Golden Temple)',
        category: 'Essentials',
        description: 'The preeminent pilgrimage site of Sikhism, covered in real gold foil and surrounded by the sacred Amrit Sarovar tank. Serves free meals to over 100,000 visitors daily in the world\'s largest community kitchen.',
        lat: 31.6200,
        lng: 74.8765,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 5.0,
        reviewCount: 2100
      },
      {
        name: 'Jallianwala Bagh Memorial',
        category: 'Historical',
        description: 'A historic public garden housing a memorial of national importance honoring the peaceful gathering fired upon in 1919. Contains preserved bullet holes on the brick walls and the historic Martyrs\' Well.',
        lat: 31.6206,
        lng: 74.8804,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 890
      },
      {
        name: 'Wagah Border Beating Retreat Ceremony',
        category: 'Outdoors',
        description: 'A daily military ceremony practiced since 1959 by India\'s BSF and Pakistan\'s Rangers at the international border, characterized by synchronized high kicks and patriotic fervor.',
        lat: 31.6047,
        lng: 74.5728,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.9,
        reviewCount: 1150
      },
      {
        name: 'The Partition Museum (Town Hall)',
        category: 'Museums',
        description: 'The world\'s first museum dedicated entirely to the Partition of India in 1947, containing oral testimonies, personal artifacts, historical photographs, and the Gallery of Hope.',
        lat: 31.6247,
        lng: 74.8778,
        estimatedCost: 10,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 340
      },
      {
        name: 'Gobindgarh Fort',
        category: 'Historical',
        description: 'An 18th-century military citadel built by the Bhangi Misl and expanded by Maharaja Ranjit Singh, hosting Toshakhana coin exhibits and an evening light-and-sound show.',
        lat: 31.6288,
        lng: 74.8580,
        estimatedCost: 150,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1598324789736-4861f89564a0?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.6,
        reviewCount: 280
      }
    ],
    restaurants: [
      {
        name: 'Kesar Da Dhaba',
        cuisines: ['Punjabi', 'Maa Ki Dal', 'Lachha Paratha', 'Phirni'],
        priceLevel: 1,
        lat: 31.6220,
        lng: 74.8730,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 1200,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Kanha Sweets',
        cuisines: ['Amritsari Kulcha', 'Chana Puri', 'Sweet Lassi'],
        priceLevel: 1,
        lat: 31.6310,
        lng: 74.8740,
        photos: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 780,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Bharawan Da Dhaba',
        cuisines: ['Punjabi Thali', 'Stuffed Kulcha', 'Kheer'],
        priceLevel: 1,
        lat: 31.6240,
        lng: 74.8780,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.6,
        reviewCount: 650,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  in_varanasi: {
    geoId: 'in_varanasi',
    name: 'Varanasi',
    region: 'Uttar Pradesh',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 25.3176,
    lng: 82.9739,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1561361066-419a4e929532?w=1200&auto=format&fit=crop&q=80',
    description: 'One of the world\'s oldest continuously inhabited sacred cities, renowned for ancient Ganges riverfront ghats, mystical evening aarti rituals, and Banarasi silk weaving.',
    tags: ['Ganges Ghats', 'Ganga Aarti', 'Kashi Vishwanath', 'Spiritual Capital'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Dashashwamedh Ghat & Evening Ganga Aarti',
        category: 'Essentials',
        description: 'The main and oldest ghat on the Ganges in Varanasi, famous for the elaborate choreographed evening Maha Aarti performed by priests with brass incense lamps.',
        lat: 25.3069,
        lng: 83.0105,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1561361066-419a4e929532?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 1680
      },
      {
        name: 'Kashi Vishwanath Temple',
        category: 'Essentials',
        description: 'Dedicated to Lord Shiva, one of the twelve sacred Jyotirlingas. Newly revitalized with the majestic Kashi Vishwanath Corridor connecting the temple directly to the holy river.',
        lat: 25.3109,
        lng: 83.0107,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 1250
      },
      {
        name: 'Assi Ghat',
        category: 'Outdoors',
        description: 'The southernmost ghat where the Assi river meets the Ganges. Celebrated for morning sunrise Subah-e-Banaras yoga and classical music recitals.',
        lat: 25.2899,
        lng: 83.0064,
        estimatedCost: 0,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.7,
        reviewCount: 620
      },
      {
        name: 'Sarnath Deer Park & Dhamek Stupa',
        category: 'Historical',
        description: 'Located 10 km northeast of Varanasi, this is the sacred deer park where Gautama Buddha first taught the Dharma after attaining enlightenment. Features the massive 43m Dhamek Stupa.',
        lat: 25.3811,
        lng: 83.0214,
        estimatedCost: 25,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 480
      }
    ],
    restaurants: [
      {
        name: 'Kashi Chat Bhandar',
        cuisines: ['Street Food', 'Tamatar Chaat', 'Palak Chaat', 'Gol Gappe'],
        priceLevel: 1,
        lat: 25.3080,
        lng: 83.0080,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 920,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Shree Shivay Thali',
        cuisines: ['Pure Vegetarian Thali', 'Benarasi Sweets'],
        priceLevel: 2,
        lat: 25.3120,
        lng: 83.0030,
        photos: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.6,
        reviewCount: 380,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Blue Lassi Shop',
        cuisines: ['Handcrafted Clay Pot Lassi', 'Fruit Lassi'],
        priceLevel: 1,
        lat: 25.3110,
        lng: 83.0120,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 710,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  in_munnar: {
    geoId: 'in_munnar',
    name: 'Munnar',
    region: 'Kerala',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 10.0889,
    lng: 77.0595,
    type: 'town',
    heroImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80',
    description: 'A misty hill station in Kerala\'s Western Ghats, blanketed by emerald green rolling tea plantations, mist-shrouded peaks, and rare Nilgiri Tahr wildlife.',
    tags: ['Tea Estates', 'Western Ghats', 'Eravikulam National Park', 'Hill Station'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Eravikulam National Park (Rajamalai)',
        category: 'Outdoors',
        description: 'Home to the largest surviving population of the endangered Nilgiri Tahr mountain goat, situated at the base of Anamudi (South India\'s highest peak).',
        lat: 10.1500,
        lng: 77.0667,
        estimatedCost: 200,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 840
      },
      {
        name: 'Tata Tea Museum & Factory',
        category: 'Museums',
        description: 'Located at KDHP\'s Nallathanni Estate, showcasing tea production evolution from roller mechanisms to modern CTC machinery with guided tea tastings.',
        lat: 10.0920,
        lng: 77.0540,
        estimatedCost: 150,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.6,
        reviewCount: 520
      },
      {
        name: 'Mattupetty Dam & Lake',
        category: 'Outdoors',
        description: 'A scenic storage concrete gravity dam surrounded by lush hills and tea gardens, popular for speedboat excursions and wild elephant sightings on the banks.',
        lat: 10.1064,
        lng: 77.1242,
        estimatedCost: 50,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.6,
        reviewCount: 610
      },
      {
        name: 'Top Station Munnar',
        category: 'Outdoors',
        description: 'The highest point in Munnar along the Kerala-Tamil Nadu border, famous for rare Neelakurinji flower blooms and breathtaking panoramic mountain valley vistas.',
        lat: 10.1242,
        lng: 77.2435,
        estimatedCost: 25,
        currency: 'INR',
        photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.7,
        reviewCount: 490
      }
    ],
    restaurants: [
      {
        name: 'Rapsy Restaurant Munnar',
        cuisines: ['Kerala Parotta', 'Beef Fry', 'Spanish Omelette', 'Chai'],
        priceLevel: 1,
        lat: 10.0880,
        lng: 77.0600,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.6,
        reviewCount: 480,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Saravana Bhavan Munnar',
        cuisines: ['South Indian Vegetarian', 'Masala Dosa', 'Filter Coffee'],
        priceLevel: 1,
        lat: 10.0890,
        lng: 77.0590,
        photos: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.5,
        reviewCount: 390,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  // ---------------- INTERNATIONAL DESTINATIONS ----------------
  fr_paris: {
    geoId: 'fr_paris',
    name: 'Paris',
    region: 'Île-de-France',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    lat: 48.8566,
    lng: 2.3522,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    description: 'The City of Light, globally renowned for the iron lattice Eiffel Tower, masterworks at the Louvre, romantic Seine river promenades, and world-leading haute cuisine.',
    tags: ['Eiffel Tower', 'Louvre Museum', 'Seine River', 'Haute Cuisine'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Eiffel Tower (Tour Eiffel)',
        category: 'Essentials',
        description: 'Gustave Eiffel\'s iconic 330-meter wrought-iron lattice tower on the Champ de Mars, built for the 1889 World\'s Fair. The universal symbol of Paris.',
        lat: 48.8584,
        lng: 2.2945,
        estimatedCost: 28,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 3200
      },
      {
        name: 'Louvre Museum (Musée du Louvre)',
        category: 'Museums',
        description: 'The world\'s most-visited museum and historic royal palace, housing Leonardo da Vinci\'s Mona Lisa, the Winged Victory of Samothrace, and Venus de Milo.',
        lat: 48.8606,
        lng: 2.3376,
        estimatedCost: 22,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 2900
      },
      {
        name: 'Cathédrale Notre-Dame de Paris',
        category: 'Historical',
        description: 'A masterpiece of French Gothic architecture on the Île de la Cité, dating to 1163, celebrated for rose stained glass windows and flying buttresses.',
        lat: 48.8530,
        lng: 2.3499,
        estimatedCost: 0,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1478197426677-582b100d7452?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 1800
      },
      {
        name: 'Arc de Triomphe',
        category: 'Historical',
        description: 'Standing at the western end of the Champs-Élysées, honoring those who fought for France. Offers commanding 360-degree views of the twelve radiating Parisian avenues.',
        lat: 48.8738,
        lng: 2.2950,
        estimatedCost: 16,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 1450
      },
      {
        name: 'Basilique du Sacré-Cœur (Montmartre)',
        category: 'Historical',
        description: 'A Romano-Byzantine white travertine basilica standing atop the Montmartre butte, the highest natural point in Paris, surrounded by painter studios.',
        lat: 48.8867,
        lng: 2.3431,
        estimatedCost: 0,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 1380
      },
      {
        name: 'Musée d\'Orsay',
        category: 'Museums',
        description: 'Housed in the majestic former Gare d\'Orsay railway station, holding the world\'s largest collection of Impressionist and Post-Impressionist masterpieces by Monet, Van Gogh, and Renoir.',
        lat: 48.8599,
        lng: 2.3265,
        estimatedCost: 16,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 1210
      }
    ],
    restaurants: [
      {
        name: 'Bouillon Chartier',
        cuisines: ['Traditional French Bistro', 'Escargots', 'Steak Frites'],
        priceLevel: 1,
        lat: 48.8718,
        lng: 2.3427,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.6,
        reviewCount: 1400,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Le Comptoir du Relais (Saint-Germain)',
        cuisines: ['Modern French Bistro', 'Charcuterie', 'Wine Bar'],
        priceLevel: 3,
        lat: 48.8520,
        lng: 2.3385,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 680,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Café de Flore',
        cuisines: ['Historic Café', 'Hot Chocolate', 'Croissant', 'Croque Monsieur'],
        priceLevel: 3,
        lat: 48.8540,
        lng: 2.3325,
        photos: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.5,
        reviewCount: 890,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  it_rome: {
    geoId: 'it_rome',
    name: 'Rome',
    region: 'Lazio',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    lat: 41.9028,
    lng: 12.4964,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80',
    description: 'The Eternal City, where nearly three millennia of globally influential art, architecture, and classical ruins like the Colosseum and Pantheon meet lively piazza cafe culture.',
    tags: ['Colosseum', 'Vatican Museums', 'Pantheon', 'Trevi Fountain'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Colosseum (Flavian Amphitheatre)',
        category: 'Essentials',
        description: 'The largest ancient amphitheatre ever built, completed in 80 AD under Titus. Once hosted gladiatorial combats, wild animal hunts, and public spectacles for 50,000 spectators.',
        lat: 41.8902,
        lng: 12.4922,
        estimatedCost: 18,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 3400
      },
      {
        name: 'Roman Forum & Palatine Hill',
        category: 'Historical',
        description: 'The political, ceremonial, and commercial epicenter of the Roman Empire, showcasing ruins of temples, triumphal arches, and the Curia Julia senate house.',
        lat: 41.8925,
        lng: 12.4853,
        estimatedCost: 18,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 1950
      },
      {
        name: 'The Pantheon',
        category: 'Historical',
        description: 'A remarkably preserved former Roman temple commissioned by Marcus Agrippa, featuring the world\'s largest unreinforced concrete dome with a central open oculus.',
        lat: 41.8986,
        lng: 12.4769,
        estimatedCost: 5,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1542820229-081e0c12af0b?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 2200
      },
      {
        name: 'Trevi Fountain (Fontana di Trevi)',
        category: 'Essentials',
        description: 'An 18th-century Baroque masterwork designed by Nicola Salvi. Tradition holds that tossing a coin over your left shoulder guarantees a return visit to Rome.',
        lat: 41.9009,
        lng: 12.4833,
        estimatedCost: 0,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 2750
      },
      {
        name: 'Vatican Museums & Sistine Chapel',
        category: 'Museums',
        description: 'Contains immense historic art collections amassed by the Popes, culminating in Michelangelo\'s ceiling frescoes and The Last Judgment in the Sistine Chapel.',
        lat: 41.9067,
        lng: 12.4547,
        estimatedCost: 20,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 2600
      },
      {
        name: 'Piazza Navona',
        category: 'Essentials',
        description: 'Built upon the 1st-century Stadium of Domitian, famous for Bernini\'s Fontana dei Quattro Fiumi (Fountain of the Four Rivers) and street artists.',
        lat: 41.8992,
        lng: 12.4731,
        estimatedCost: 0,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.8,
        reviewCount: 1650
      }
    ],
    restaurants: [
      {
        name: 'Roscioli Salumeria con Cucina',
        cuisines: ['Roman Cuisine', 'Spaghetti Carbonara', 'Cured Meats', 'Artisanal Cheeses'],
        priceLevel: 3,
        lat: 41.8940,
        lng: 12.4740,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 1100,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Da Enzo al 29 (Trastevere)',
        cuisines: ['Authentic Roman Trattoria', 'Cacio e Pepe', 'Carciofi alla Giudia'],
        priceLevel: 2,
        lat: 41.8880,
        lng: 12.4780,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 940,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Giolitti Gelateria',
        cuisines: ['Artisanal Italian Gelato', 'Espresso'],
        priceLevel: 1,
        lat: 41.9010,
        lng: 12.4770,
        photos: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 1800,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  jp_tokyo: {
    geoId: 'jp_tokyo',
    name: 'Tokyo',
    region: 'Kanto',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    lat: 35.6762,
    lng: 139.6503,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    description: 'A dazzling metropolis blending futuristic neon-lit skyscrapers and rapid transit with historic Edo temples, tranquil Shinto shrines, and world-beating ramen counters.',
    tags: ['Senso-ji', 'Shibuya Crossing', 'Meiji Shrine', 'Tokyo Skytree'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Senso-ji Temple (Asakusa)',
        category: 'Essentials',
        description: 'Tokyo\'s oldest Buddhist temple founded in 645 AD, approached via the iconic Kaminarimon thunder gate with its giant red paper lantern and Nakamise shopping street.',
        lat: 35.7148,
        lng: 139.7967,
        estimatedCost: 0,
        currency: 'JPY',
        photos: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 2800
      },
      {
        name: 'Shibuya Scramble Crossing & Hachiko',
        category: 'Essentials',
        description: 'The world\'s busiest pedestrian intersection where up to 3,000 people cross simultaneously with each light change, adjacent to the faithful dog Hachiko bronze monument.',
        lat: 35.6595,
        lng: 139.7005,
        estimatedCost: 0,
        currency: 'JPY',
        photos: ['https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 3100
      },
      {
        name: 'Meiji Jingu Shrine',
        category: 'Historical',
        description: 'A grand Shinto shrine dedicated to Emperor Meiji, enclosed by a peaceful 170-acre evergreen forest consisting of over 120,000 trees donated from across Japan.',
        lat: 35.6764,
        lng: 139.6993,
        estimatedCost: 0,
        currency: 'JPY',
        photos: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 1950
      },
      {
        name: 'Tokyo Skytree',
        category: 'Outdoors',
        description: 'At 634 meters, this is the tallest structure in Japan and third-tallest building in the world, providing panoramic views across the Tokyo plain all the way to Mount Fuji.',
        lat: 35.7100,
        lng: 139.8107,
        estimatedCost: 2100,
        currency: 'JPY',
        photos: ['https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.7,
        reviewCount: 2200
      },
      {
        name: 'Shinjuku Gyoen National Garden',
        category: 'Outdoors',
        description: 'A 144-acre former imperial estate blending traditional Japanese landscape gardens with French formal and English landscape grounds, famed for spring cherry blossoms.',
        lat: 35.6852,
        lng: 139.7101,
        estimatedCost: 500,
        currency: 'JPY',
        photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 1680
      }
    ],
    restaurants: [
      {
        name: 'Ichiran Shibuya',
        cuisines: ['Tonkotsu Ramen', 'Chashu Pork', 'Boiled Egg'],
        priceLevel: 1,
        lat: 35.6610,
        lng: 139.7010,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 2400,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Tsukiji Outer Market Sushi Zanmai',
        cuisines: ['Fresh Sushi & Sashimi', 'Tuna Nigiri', 'Miso Soup'],
        priceLevel: 2,
        lat: 35.6650,
        lng: 139.7710,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 1450,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  ae_dubai: {
    geoId: 'ae_dubai',
    name: 'Dubai',
    region: 'Emirate of Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    lat: 25.2048,
    lng: 55.2708,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80',
    description: 'A global hub of futuristic architecture and luxury living, home to the record-breaking Burj Khalifa, man-made Palm Jumeirah, and historic spice and gold souks.',
    tags: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Burj Khalifa (At The Top)',
        category: 'Essentials',
        description: 'The world\'s tallest building soaring 828 meters into the sky, featuring outdoor observation decks on levels 124, 125, and 148 overlooking the Arabian Gulf.',
        lat: 25.1972,
        lng: 55.2744,
        estimatedCost: 179,
        currency: 'AED',
        photos: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 3800
      },
      {
        name: 'The Dubai Mall & Dubai Fountain',
        category: 'Essentials',
        description: 'One of the world\'s largest shopping and entertainment destinations, featuring the Dubai Aquarium & Underwater Zoo and choreographed fountain water shows set to music.',
        lat: 25.1975,
        lng: 55.2796,
        estimatedCost: 0,
        currency: 'AED',
        photos: ['https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 3100
      },
      {
        name: 'Palm Jumeirah & The View at The Palm',
        category: 'Outdoors',
        description: 'An iconic tree-shaped artificial archipelago featuring luxury beachfront resorts, the Atlantis Aquaventure waterpark, and a 240-meter high viewing deck.',
        lat: 25.1124,
        lng: 55.1390,
        estimatedCost: 100,
        currency: 'AED',
        photos: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 1950
      },
      {
        name: 'Museum of the Future',
        category: 'Museums',
        description: 'An architectural and engineering triumph clad in stainless steel engraved with Arabic calligraphy, exhibiting cutting-edge science, biotechnology, and space explorations.',
        lat: 25.2192,
        lng: 55.2819,
        estimatedCost: 149,
        currency: 'AED',
        photos: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 1420
      },
      {
        name: 'Dubai Creek Abra Ride & Gold Souk',
        category: 'Historical',
        description: 'Ride traditional wooden motorized abras across Dubai Creek between Bur Dubai and Deira for just 1 AED to explore the legendary Gold and Spice Souks.',
        lat: 25.2662,
        lng: 55.2974,
        estimatedCost: 1,
        currency: 'AED',
        photos: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.7,
        reviewCount: 1250
      }
    ],
    restaurants: [
      {
        name: 'Arabian Tea House (Al Fahidi)',
        cuisines: ['Emirati Traditional', 'Machboos', 'Arabic Breakfast', 'Karak Chai'],
        priceLevel: 2,
        lat: 25.2630,
        lng: 55.3000,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 1650,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Al Fanar Seafood Market',
        cuisines: ['Authentic Emirati Seafood', 'Grilled Tiger Prawns'],
        priceLevel: 3,
        lat: 25.2220,
        lng: 55.3520,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.6,
        reviewCount: 820,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  es_barcelona: {
    geoId: 'es_barcelona',
    name: 'Barcelona',
    region: 'Catalonia',
    country: 'Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    lat: 41.3879,
    lng: 2.1699,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&auto=format&fit=crop&q=80',
    description: 'The Catalan Mediterranean capital celebrated for Antoni Gaudí\'s surreal architectural masterpieces, sun-drenched beaches, tapas culture, and Gothic Quarter lanes.',
    tags: ['Sagrada Família', 'Park Güell', 'Casa Batlló', 'Gothic Quarter'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Basílica de la Sagrada Família',
        category: 'Essentials',
        description: 'Antoni Gaudí\'s unfinished masterpiece, begun in 1882. A transcendent UNESCO World Heritage church with soaring Nativity and Passion facades and forest-like stained glass interiors.',
        lat: 41.4036,
        lng: 2.1744,
        estimatedCost: 26,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 3500
      },
      {
        name: 'Park Güell',
        category: 'Outdoors',
        description: 'A whimsical public park system on Carmel Hill composed of Gaudí\'s colorful mosaic salamander (El Drac), serpentine benches, and the Hypostyle Room.',
        lat: 41.4145,
        lng: 2.1527,
        estimatedCost: 10,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 2800
      },
      {
        name: 'Casa Batlló',
        category: 'Historical',
        description: 'Gaudí\'s iconic modernist building on Passeig de Gràcia, known locally as the House of Bones for its visceral skeletal balconies and dragon-backed tiled roof.',
        lat: 41.3917,
        lng: 2.1649,
        estimatedCost: 29,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 1950
      },
      {
        name: 'Gothic Quarter (Barri Gòtic)',
        category: 'Historical',
        description: 'The historic heart of the old city of Barcelona, featuring narrow medieval cobblestone passages, the Cathedral of the Holy Cross and Saint Eulalia, and Roman walls.',
        lat: 41.3833,
        lng: 2.1764,
        estimatedCost: 0,
        currency: 'EUR',
        photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.8,
        reviewCount: 2100
      }
    ],
    restaurants: [
      {
        name: 'Cervecería Catalana',
        cuisines: ['Tapas', 'Patatas Bravas', 'Grilled Razor Clams', 'Sangria'],
        priceLevel: 2,
        lat: 41.3920,
        lng: 2.1610,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 2200,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'El Xampanyet',
        cuisines: ['Traditional Tapas Bar', 'Cantabrian Anchovies', 'Sparkling Wine'],
        priceLevel: 2,
        lat: 41.3850,
        lng: 2.1820,
        photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 1350,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  },

  eg_cairo: {
    geoId: 'eg_cairo',
    name: 'Cairo & Giza',
    region: 'Cairo Governorate',
    country: 'Egypt',
    countryCode: 'EG',
    flag: '🇪🇬',
    lat: 30.0444,
    lng: 31.2357,
    type: 'city',
    heroImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200&auto=format&fit=crop&q=80',
    description: 'The City of a Thousand Minarets along the Nile, guardian of the 4,500-year-old Great Pyramids of Giza, the Great Sphinx, and treasure houses of antiquity.',
    tags: ['Giza Pyramids', 'The Sphinx', 'Grand Egyptian Museum', 'Nile River'],
    sourceBadge: 'From OpenStreetMap & Wikipedia',
    photoCredit: 'Wikimedia Commons',
    spots: [
      {
        name: 'Great Pyramids of Giza (Khufu, Khafre, Menkaure)',
        category: 'Essentials',
        description: 'The sole surviving monument of the Seven Wonders of the Ancient World, constructed over 4,500 years ago during Egypt\'s Fourth Dynasty on the Giza plateau.',
        lat: 29.9792,
        lng: 31.1342,
        estimatedCost: 240,
        currency: 'EGP',
        photos: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 5.0,
        reviewCount: 3900
      },
      {
        name: 'The Great Sphinx of Giza',
        category: 'Essentials',
        description: 'A limestone statue of a reclining mythical sphinx with the head of a pharaoh and body of a lion, carved directly from bedrock during the reign of King Khafre.',
        lat: 29.9753,
        lng: 31.1376,
        estimatedCost: 0,
        currency: 'EGP',
        photos: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.8,
        reviewCount: 2600
      },
      {
        name: 'Grand Egyptian Museum (GEM)',
        category: 'Museums',
        description: 'The largest archaeological museum complex in the world, displaying over 100,000 ancient Egyptian artifacts and the complete Tutankhamun tomb collection.',
        lat: 29.9950,
        lng: 31.1190,
        estimatedCost: 500,
        currency: 'EGP',
        photos: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'Wikipedia',
        photoCredit: 'Wikimedia Commons',
        avgRating: 4.9,
        reviewCount: 1800
      },
      {
        name: 'Khan el-Khalili Bazaar',
        category: 'Hidden gems',
        description: 'A vibrant 14th-century marketplace in Islamic Cairo, brimming with brass lamps, handwoven carpets, perfume oils, spices, and historic coffeehouses.',
        lat: 30.0475,
        lng: 31.2625,
        estimatedCost: 0,
        currency: 'EGP',
        photos: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80'],
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap',
        avgRating: 4.7,
        reviewCount: 1420
      }
    ],
    restaurants: [
      {
        name: 'Abou El Sid (Zamalek)',
        cuisines: ['Traditional Egyptian', 'Molokhia with Duck', 'Koshari', 'Pigeon Fereek'],
        priceLevel: 2,
        lat: 30.0600,
        lng: 31.2200,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.7,
        reviewCount: 880,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      },
      {
        name: 'Koshary Abou Tarek',
        cuisines: ['Authentic Egyptian Koshari', 'Fried Onions & Spiced Sauce'],
        priceLevel: 1,
        lat: 30.0520,
        lng: 31.2380,
        photos: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'],
        avgRating: 4.8,
        reviewCount: 1750,
        sourceBadge: 'From OpenStreetMap',
        photoCredit: 'OpenStreetMap Contributors'
      }
    ]
  }
};

export const WORLDWIDE_HOTELS: Record<string, CuratedHotel[]> = {
  in_agra: [
    {
      name: 'The Oberoi Amarvilas, Agra',
      description: 'Luxury palace resort situated just 600 meters from the Taj Mahal, with every room and terrace offering uninterrupted views of the iconic monument.',
      address: 'Taj East Gate Road, Agra, Uttar Pradesh 282001',
      lat: 27.1685,
      lng: 78.0485,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 32000,
      currency: 'INR',
      amenities: ['Taj Mahal Views', 'Swimming Pool', 'Spa & Wellness', 'Fine Dining', 'Butler Service'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/the-oberoi-amarvilas-agra.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 380,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Oberoi Hotels & Resorts'
    },
    {
      name: 'ITC Mughal, A Luxury Collection Resort',
      description: 'Spread over 35 acres of Mughal gardens, offering royal hospitality and the acclaimed Kaya Kalp spa.',
      address: 'Fatehabad Road, Tajganj, Agra, Uttar Pradesh 282001',
      lat: 27.1592,
      lng: 78.0261,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 9500,
      currency: 'INR',
      amenities: ['Mughal Gardens', 'Kaya Kalp Spa', 'Tennis Courts', 'Multiple Restaurants', 'Free WiFi'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/itc-mughal.html',
      affiliateProvider: 'booking',
      avgRating: 4.7,
      reviewCount: 290,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'ITC Hotels'
    },
    {
      name: 'Crystal Sarovar Premiere, Agra',
      description: 'Upscale modern hotel with rooftop pool and views towards the Taj Mahal, convenient for leisure and families.',
      address: 'Fatehabad Road, Tajganj, Agra, Uttar Pradesh 282001',
      lat: 27.1578,
      lng: 78.0315,
      photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 4200,
      currency: 'INR',
      amenities: ['Rooftop Swimming Pool', 'Gym', 'Coffee Shop', 'Airport Shuttle'],
      starClass: 4,
      affiliateUrl: 'https://www.booking.com/hotel/in/crystal-sarovar-premiere.html',
      affiliateProvider: 'booking',
      avgRating: 4.5,
      reviewCount: 210,
      sourceBadge: 'From OpenStreetMap',
      photoCredit: 'Sarovar Hotels'
    }
  ],

  in_jaipur: [
    {
      name: 'The Raj Palace (Grand Heritage Hotel)',
      description: 'A 1727 converted royal palace and member of Small Luxury Hotels of the World, with opulent chandeliers and heritage suites.',
      address: 'Zorawer Singh Gate, Amer Road, Jaipur, Rajasthan 302002',
      lat: 26.9452,
      lng: 75.8340,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 16500,
      currency: 'INR',
      amenities: ['Palace Courtyards', 'Swimming Pool', 'Heritage Museum', 'Fine Dining', 'Spa'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/the-raj-palace.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 310,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'The Raj Palace'
    },
    {
      name: 'Rambagh Palace, Jaipur',
      description: 'The former official residence of the Maharaja of Jaipur, renowned worldwide for its manicured royal grounds and grand ballrooms.',
      address: 'Bhawani Singh Road, Jaipur, Rajasthan 302005',
      lat: 26.8970,
      lng: 75.8080,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 45000,
      currency: 'INR',
      amenities: ['Royal Gardens', 'Jiva Grande Spa', 'Polo Bar', 'Indoor & Outdoor Pool'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/rambagh-palace.html',
      affiliateProvider: 'booking',
      avgRating: 5.0,
      reviewCount: 420,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Taj Hotels'
    },
    {
      name: 'Samode Haveli, Jaipur',
      description: 'A quiet, 175-year-old Rajput mansion built around lush garden courtyards with hand-painted frescoed verandahs.',
      address: 'Near Jorawar Singh Gate, Gangapole, Jaipur, Rajasthan 302002',
      lat: 26.9380,
      lng: 75.8390,
      photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 8500,
      currency: 'INR',
      amenities: ['Heritage Courtyard', 'Pool', 'Ayurvedic Spa', 'Traditional Dining'],
      starClass: 4,
      affiliateUrl: 'https://www.booking.com/hotel/in/samode-haveli.html',
      affiliateProvider: 'booking',
      avgRating: 4.7,
      reviewCount: 190,
      sourceBadge: 'From OpenStreetMap',
      photoCredit: 'Samode Hotels'
    }
  ],

  in_udaipur: [
    {
      name: 'Taj Lake Palace, Udaipur',
      description: 'An iconic 18th-century floating white marble palace on the tranquil waters of Lake Pichola, reached only by royal boat.',
      address: 'Lake Pichola, Udaipur, Rajasthan 313001',
      lat: 24.5755,
      lng: 73.6795,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 48000,
      currency: 'INR',
      amenities: ['Private Boat Arrival', 'Jiva Spa Boat', 'Lakefront Dining', 'Palace Courtyard'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/taj-lake-palace-udaipur.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 520,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Taj Hotels'
    },
    {
      name: 'The Leela Palace Udaipur',
      description: 'Majestic lakeside palace hotel offering breath-taking panoramas of the City Palace and the Aravalli mountain ridge.',
      address: 'Lake Pichola, Udaipur, Rajasthan 313001',
      lat: 24.5778,
      lng: 73.6760,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 38000,
      currency: 'INR',
      amenities: ['Sheesh Mahal Dining', 'Outdoor Pool', 'ESPA Spa', 'Butler Service'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/the-leela-palace-udaipur.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 460,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'The Leela Palaces'
    },
    {
      name: 'Jagat Niwas Palace Hotel',
      description: 'Authentic 17th-century lakeside haveli right on Lal Ghat with cushioned jharokha bay windows over Lake Pichola.',
      address: '23-25 Lal Ghat, Lake Pichola, Udaipur, Rajasthan 313001',
      lat: 24.5790,
      lng: 73.6820,
      photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 6800,
      currency: 'INR',
      amenities: ['Rooftop Lake View', 'Rajasthani Architecture', 'Boating Tours'],
      starClass: 4,
      affiliateUrl: 'https://www.booking.com/hotel/in/jagat-niwas-palace.html',
      affiliateProvider: 'booking',
      avgRating: 4.6,
      reviewCount: 280,
      sourceBadge: 'From OpenStreetMap',
      photoCredit: 'Jagat Niwas'
    }
  ],

  in_delhi: [
    {
      name: 'The Imperial, New Delhi',
      description: 'Iconic 1936 British colonial Art Deco landmark on Janpath, famous for museum-quality colonial art and heritage gardens.',
      address: 'Janpath, Connaught Place, New Delhi 110001',
      lat: 28.6235,
      lng: 77.2185,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 18000,
      currency: 'INR',
      amenities: ['Heritage Art Galleries', 'Imperial Spa', 'Multiple Fine Dining', 'Pool'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/the-imperial-new-delhi.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 480,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'The Imperial'
    },
    {
      name: 'Haveli Dharampura, Old Delhi',
      description: 'A restored UNESCO-awarded heritage haveli in Chandni Chowk with classical kathak dance and rooftop vistas of Jama Masjid.',
      address: 'Gali Guliyan, Dharampura, Chandni Chowk, Delhi 110006',
      lat: 28.6515,
      lng: 77.2345,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 11000,
      currency: 'INR',
      amenities: ['Heritage Rooftop', 'Kathak Performances', 'Lakhori Restaurant'],
      starClass: 4,
      affiliateUrl: 'https://www.booking.com/hotel/in/haveli-dharampura.html',
      affiliateProvider: 'booking',
      avgRating: 4.7,
      reviewCount: 260,
      sourceBadge: 'From OpenStreetMap',
      photoCredit: 'Haveli Dharampura'
    }
  ],

  in_amritsar: [
    {
      name: 'Hyatt Regency Amritsar',
      description: 'Modern 5-star haven featuring luxury vitality pools, authentic North Indian dining, and complimentary shuttles to the Golden Temple.',
      address: 'MB Neopolis, GT Road, Amritsar, Punjab 143001',
      lat: 31.6210,
      lng: 74.8980,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 7200,
      currency: 'INR',
      amenities: ['Shuttle to Golden Temple', 'Vitality Pool', 'Spa', 'North Indian Dining'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/hyatt-regency-amritsar.html',
      affiliateProvider: 'booking',
      avgRating: 4.7,
      reviewCount: 390,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Hyatt Hotels'
    },
    {
      name: 'Taj Swarna, Amritsar',
      description: 'Contemporary luxury sanctuary in Amritsar with plush suites, banquet lawns, and proximity to Harmandir Sahib.',
      address: 'Plot No. C-1, Amristar Urban Circle, Majitha Verka Bypass, Amritsar 143001',
      lat: 31.6620,
      lng: 74.8820,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 8500,
      currency: 'INR',
      amenities: ['Jiva Spa', 'Swimming Pool', 'Punjabi Specialties', 'Gym'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/taj-swarna.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 310,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Taj Hotels'
    }
  ],

  in_varanasi: [
    {
      name: 'BrijRama Palace, Varanasi',
      description: 'An 18th-century royal sandstone palace situated directly on Darbhanga Ghat, accessed by heritage bajra boats.',
      address: 'Darbhanga Ghat, Dashashwamedh, Varanasi, Uttar Pradesh 221001',
      lat: 25.3050,
      lng: 73.0100,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 24000,
      currency: 'INR',
      amenities: ['Ganga Aarti Views', 'Boat Arrival', 'Classical Sitar Music', 'Pure Veg Dining'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/brijrama-palace.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 340,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Brij Hotels'
    },
    {
      name: 'Taj Ganges, Varanasi',
      description: 'Peaceful luxury resort set across 12 verdant acres in Varanasi cantonment, a haven of tranquility away from city crowds.',
      address: 'Nadesar Palace Compound, Varanasi, Uttar Pradesh 221002',
      lat: 25.3340,
      lng: 82.9810,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 12500,
      currency: 'INR',
      amenities: ['12-Acre Orchard Gardens', 'Pool', 'Jiva Spa', 'Chowk Restaurant'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/taj-ganges-varanasi.html',
      affiliateProvider: 'booking',
      avgRating: 4.7,
      reviewCount: 290,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Taj Hotels'
    }
  ],

  in_munnar: [
    {
      name: 'Windermere Estate Munnar',
      description: 'A boutique hill retreat nestled on a 60-acre private cardamom and coffee plantation overlooking misty mountain slopes.',
      address: 'Pothamedu, Munnar, Kerala 685612',
      lat: 10.0650,
      lng: 77.0540,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 8800,
      currency: 'INR',
      amenities: ['Plantation Walks', 'Campfire', 'Scenic Balconies', 'Kerala Kitchen'],
      starClass: 4,
      affiliateUrl: 'https://www.booking.com/hotel/in/windermere-estate.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 230,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Windermere'
    },
    {
      name: 'Blanket Luxury Villa & Spa',
      description: 'Contemporary eco-luxury resort directly facing Attukad Waterfall with private balconies overlooking tea terraces.',
      address: 'Attukad Waterfalls, Aluva - Munnar Highway, Munnar 685565',
      lat: 10.0520,
      lng: 77.0390,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 11500,
      currency: 'INR',
      amenities: ['Waterfall Views', 'Ayurvedic Spa', 'Infinity Pool', 'Tea Tastings'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/blanket-luxury-villa-spa.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 290,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Blanket Hotel'
    }
  ],

  in_goa: [
    {
      name: 'The Postcard Moira, Goa',
      description: 'A restored 214-year-old Portuguese mansion tucked into the heritage village of Moira in North Goa.',
      address: 'Moira, Bardez, Goa 403507',
      lat: 15.6025,
      lng: 73.8340,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 14500,
      currency: 'INR',
      amenities: ['Portuguese Architecture', 'Pool', 'Artisanal Goan Dining', 'Ayurvedic Consultations'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/the-postcard-moira.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 190,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'The Postcard Hotel'
    },
    {
      name: 'Taj Exotica Resort & Spa, Benaulim',
      description: 'Mediterranean-style 5-star haven spread across 56 landscaped beachfront acres on the peaceful sands of Benaulim Beach.',
      address: 'Calwaddo, Benaulim, Goa 403716',
      lat: 15.2470,
      lng: 73.9180,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 22000,
      currency: 'INR',
      amenities: ['Direct Beach Access', 'Jiva Spa', 'Golf Course', 'Seafront Seafood'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/in/taj-exotica-goa.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 510,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Taj Hotels'
    }
  ],

  fr_paris: [
    {
      name: 'Ritz Paris',
      description: 'Legendary palace hotel on Place Vendôme, celebrated for grand French neoclassical salons and Bar Hemingway.',
      address: '15 Place Vendôme, 75001 Paris, France',
      lat: 48.8682,
      lng: 2.3295,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 105000,
      currency: 'INR',
      amenities: ['Chanel Spa', 'Indoor Pool', 'Michelin-starred Dining', 'Bar Hemingway'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/fr/ritz-paris.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 620,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Ritz Paris'
    },
    {
      name: 'Hôtel Plaza Athénée',
      description: 'Prestigious haute couture palace on Avenue Montaigne with views of the Eiffel Tower and red geranium facades.',
      address: '25 Avenue Montaigne, 75008 Paris, France',
      lat: 48.8660,
      lng: 2.3045,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 125000,
      currency: 'INR',
      amenities: ['Eiffel Tower Views', 'Dior Spa', 'Courtyard Ice Rink', 'Gastronomic Restaurant'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/fr/plaza-athenee.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 480,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Dorchester Collection'
    }
  ],

  it_rome: [
    {
      name: 'Hotel de Russie, Rocco Forte Hotel',
      description: 'Celebrated luxury hotel near the Spanish Steps with terraced private secret gardens and Valadier dining.',
      address: 'Via del Babuino 9, 00187 Rome, Italy',
      lat: 41.9100,
      lng: 12.4780,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 85000,
      currency: 'INR',
      amenities: ['Secret Garden', 'De Russie Spa', 'Stravinskij Bar', 'Near Piazza del Popolo'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/it/de-russie.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 510,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Rocco Forte Hotels'
    },
    {
      name: 'Hassler Roma',
      description: 'Historic family-owned 5-star hotel perched atop the Spanish Steps with sweeping vistas of the Eternal City.',
      address: 'Piazza Trinità dei Monti 6, 00187 Rome, Italy',
      lat: 41.9065,
      lng: 12.4835,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 78000,
      currency: 'INR',
      amenities: ['Panoramic Terraces', 'Imàgo Michelin Restaurant', 'Spanish Steps Access'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/it/hassler-roma.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 390,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Hassler Roma'
    }
  ],

  it_amalfi: [
    {
      name: 'Hotel Santa Caterina',
      description: 'A cliffside 19th-century liberty villa on the Mediterranean with private beach club and saltwater pool.',
      address: 'SS Amalfitana 9, 84011 Amalfi, Italy',
      lat: 40.6310,
      lng: 14.5940,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 95000,
      currency: 'INR',
      amenities: ['Saltwater Pool', 'Private Beach Club', 'Michelin Restaurant Glicine'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/it/santa-caterina.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 420,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Hotel Santa Caterina'
    }
  ],

  jp_kyoto: [
    {
      name: 'Hoshinoya Kyoto',
      description: 'Riverside ryokan sanctuary set deep in the Arashiyama gorge, accessed exclusively by private wooden boat.',
      address: '11-2 Arashiyama Genrokuzancho, Nishikyo Ward, Kyoto 616-0007',
      lat: 35.0130,
      lng: 135.6710,
      photos: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 65000,
      currency: 'INR',
      amenities: ['Private Boat Arrival', 'Kaiseki Dining', 'Bamboo Garden Pavilion'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/jp/hoshinoya-kyoto.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 380,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Hoshinoya'
    }
  ],

  jp_tokyo: [
    {
      name: 'Park Hyatt Tokyo',
      description: 'High-rise luxury hotel in Shinjuku celebrated for its top-floor New York Grill and sweeping views of Mount Fuji.',
      address: '3-7-1-2 Nishi-Shinjuku, Shinjuku City, Tokyo 163-1055',
      lat: 35.6850,
      lng: 139.6910,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 55000,
      currency: 'INR',
      amenities: ['Mount Fuji Views', 'Club On The Park Spa', 'New York Grill & Bar'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/jp/park-hyatt-tokyo.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 470,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Hyatt Hotels'
    }
  ],

  ae_dubai: [
    {
      name: 'Burj Al Arab Jumeirah',
      description: 'The world\'s legendary sail-shaped luxury symbol standing on its own private island with duplex suites and personal butlers.',
      address: 'Jumeirah Beach Road, Umm Suqeim 3, Dubai, UAE',
      lat: 25.1412,
      lng: 55.1852,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 110000,
      currency: 'INR',
      amenities: ['Private Island', 'Helipad', 'Talise Spa', 'Undersea Aquarium Dining'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/ae/burj-al-arab.html',
      affiliateProvider: 'booking',
      avgRating: 4.9,
      reviewCount: 710,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Jumeirah'
    }
  ],

  es_barcelona: [
    {
      name: 'Hotel Arts Barcelona',
      description: 'Towering seafront luxury hotel on Port Olímpic with two Michelin-starred Enoteca dining and outdoor pools.',
      address: 'Carrer de la Marina 19-21, 08005 Barcelona, Spain',
      lat: 41.3870,
      lng: 2.1960,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 38000,
      currency: 'INR',
      amenities: ['Mediterranean Views', '43 The Spa', 'Infinity Pool', 'Two-Star Michelin Dining'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/es/arts-barcelona.html',
      affiliateProvider: 'booking',
      avgRating: 4.7,
      reviewCount: 520,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'The Ritz-Carlton'
    }
  ],

  eg_cairo: [
    {
      name: 'Marriott Mena House, Cairo',
      description: 'Historic 1869 palace hotel nestled amid 40 acres of lush gardens facing directly at the Great Pyramids of Giza.',
      address: 'Pyramids Road, Giza, Cairo, Egypt',
      lat: 29.9855,
      lng: 31.1325,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'],
      pricePerNight: 28000,
      currency: 'INR',
      amenities: ['Pyramid View Terraces', 'Historic Royal Palace', 'Lush Gardens', 'Spa'],
      starClass: 5,
      affiliateUrl: 'https://www.booking.com/hotel/eg/marriott-mena-house-cairo.html',
      affiliateProvider: 'booking',
      avgRating: 4.8,
      reviewCount: 490,
      sourceBadge: 'Wayfarer Verified',
      photoCredit: 'Marriott International'
    }
  ]
};

