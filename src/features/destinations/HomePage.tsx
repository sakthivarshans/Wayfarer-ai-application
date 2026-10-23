import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, MapPin, Heart, ArrowRight, Compass, ShieldCheck, Navigation, Globe } from 'lucide-react';
import { wayfarerStore } from '../../services/store';
import { wayfarerApi } from '../../services/api';
import { Destination, Place } from '../../types';
import { RatingDisplay } from '../../components/common/RatingDisplay';
import { DestinationAutocomplete } from './DestinationAutocomplete';

export function HomePage() {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [worldwideDestinations, setWorldwideDestinations] = useState<any[]>([]);
  const [regionFilter, setRegionFilter] = useState<'All' | 'India' | 'International'>('All');

  useEffect(() => {
    wayfarerApi.getWorldwideCatalog().then(catalog => {
      if (catalog && catalog.length > 0) {
        setWorldwideDestinations(catalog);
      }
    });
  }, []);

  // The 3 seeded destinations stay as the "Featured Destinations" row
  const featuredDestinations = wayfarerStore.getDestinations();
  const allPlaces = wayfarerStore.getPlaces();
  const allHotels = wayfarerStore.getHotels();

  const categoryChips = [
    'All',
    'Essentials',
    'Family friendly',
    'Hidden gems',
    'Museums',
    'Outdoors',
    'Arts and theatre',
    'Nightlife'
  ];

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredPlaces = allPlaces.filter(p => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section with Worldwide Autocomplete Search */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-[#F5F3FF] via-white to-white border-b border-[#EDE9FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EDE9FE] shadow-sm text-xs font-semibold text-[#6D28D9]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Worldwide Travel Discovery · Powered by OpenStreetMap &amp; Groq</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#1F1637] leading-[1.1] tracking-tight text-balance">
                Explore any city, town, or sight across the globe.
              </h1>

              <p className="text-base text-[#6B6385] max-w-xl leading-relaxed">
                Search thousands of global destinations with live OpenStreetMap POIs, door-to-door transit schedules, authentic reviews, and on-trip Telegram guidance.
              </p>

              {/* Worldwide Autocomplete Search Bar */}
              <div className="max-w-xl">
                <DestinationAutocomplete
                  placeholder="Search any destination (e.g. Mumbai, Tokyo, Jaipur, Amalfi, Paris...)"
                />
              </div>

              {/* Quick Trust Badges & Near Me Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#6B6385]">
                <Link
                  to="/nearme"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F3FF] text-[#6D28D9] border border-[#EDE9FE] font-semibold hover:bg-[#EDE9FE] transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Find Sights Near Me</span>
                </Link>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6D28D9]" />
                  <span>Honest OpenStreetMap Source Badges</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-wayfarer-lg border border-[#EDE9FE] group">
                <img
                  src="/src/assets/images/hero_wayfarer_travel_1792651127301.jpg"
                  alt="Coastal Wayfarer Promontory"
                  referrerPolicy="no-referrer"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase font-semibold tracking-wider text-violet-200">
                    Featured Destination
                  </span>
                  <h3 className="text-2xl font-bold font-heading mt-1">
                    Amalfi Coast, Italy
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">
                    Sun-drenched Mediterranean cliffs, lemon groves, and sapphire coves.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to="/destination/it/it_amalfi"
                      className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-violet-200"
                    >
                      <span>Explore Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[10px] text-white/70">From OpenStreetMap · Wayfarer Photography</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Destinations Section (The 3 Seeded Destinations) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Handpicked</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F1637] mt-1">
              Featured Destinations
            </h2>
          </div>
          <span className="text-xs text-[#6B6385]">Browse-first, verified listings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDestinations.map((dest) => {
            const countryCode = dest.country === 'Italy' ? 'it' : dest.country === 'Japan' ? 'jp' : 'in';
            const geoId = dest.country === 'Italy' ? 'it_amalfi' : dest.country === 'Japan' ? 'jp_kyoto' : 'in_goa';

            return (
              <Link
                key={dest.id}
                to={`/destination/${countryCode}/${geoId}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer hover:shadow-wayfarer-lg transition-all duration-300"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => toggleSave(dest.id, e)}
                    aria-label="Save destination"
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      savedIds.includes(dest.id)
                        ? 'bg-[#6D28D9] text-white'
                        : 'bg-white/80 text-[#1F1637] hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${savedIds.includes(dest.id) ? 'fill-current' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-medium flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#8B5CF6]" />
                    <span>{dest.country}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-heading text-[#1F1637] group-hover:text-[#6D28D9] transition-colors">
                      {dest.name}
                    </h3>
                    <span className="text-[10px] text-[#6B6385] bg-[#F5F3FF] px-2 py-0.5 rounded border border-[#EDE9FE]">
                      {dest.sourceBadge || 'From OpenStreetMap'}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B6385] line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#6B6385]">
                      <span>{wayfarerStore.getPlaces(dest.id).length} sights</span>
                      <span>·</span>
                      <span>{wayfarerStore.getHotels(dest.id).length} stays</span>
                    </div>
                    <span className="text-[#6D28D9] font-bold inline-flex items-center gap-1">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Worldwide Destinations Section */}
      {worldwideDestinations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D28D9] uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F1637]">
                Explore Worldwide Destinations
              </h2>
              <p className="text-xs text-[#6B6385] mt-1">
                Curated UNESCO landmarks, authentic cultural monuments, and renowned dining spots.
              </p>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center gap-2 bg-[#F5F3FF] p-1 rounded-xl border border-[#EDE9FE]">
              {(['All', 'India', 'International'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    regionFilter === r
                      ? 'bg-white text-[#6D28D9] shadow-sm'
                      : 'text-[#6B6385] hover:text-[#1F1637]'
                  }`}
                >
                  {r === 'All' ? 'All Worldwide' : r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {worldwideDestinations
              .filter(d => {
                if (regionFilter === 'India') return d.country === 'India';
                if (regionFilter === 'International') return d.country !== 'India';
                return true;
              })
              .map((dest) => (
                <Link
                  key={dest.geoId}
                  to={`/destination/${dest.countryCode.toLowerCase()}/${dest.geoId}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer hover:shadow-wayfarer-lg hover:border-[#8B5CF6]/40 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-medium flex items-center gap-1.5">
                      <span>{dest.flag}</span>
                      <span>{dest.country}</span>
                    </div>

                    <button
                      onClick={(e) => toggleSave(dest.geoId, e)}
                      aria-label="Save destination"
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all ${
                        savedIds.includes(dest.geoId)
                          ? 'bg-[#6D28D9] text-white'
                          : 'bg-white/80 text-[#1F1637] hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${savedIds.includes(dest.geoId) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-bold text-base text-[#1F1637] group-hover:text-[#6D28D9] transition-colors">
                        {dest.name}
                      </h3>
                      <span className="text-[10px] text-[#6B6385] bg-[#F5F3FF] px-2 py-0.5 rounded border border-[#EDE9FE] shrink-0">
                        {dest.sourceBadge || 'OpenStreetMap'}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B6385] line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1">
                      {dest.tags.slice(0, 2).map((t: string) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F5F3FF] text-[#6D28D9] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between text-xs text-[#6B6385]">
                      <span>{dest.sightsCount} top sights</span>
                      <span className="text-[#6D28D9] font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Popular Sights Preview with Honest Source Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Experience</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F1637] mt-1">
              Top Attractions &amp; Highlights
            </h2>
          </div>

          {/* Interactive Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categoryChips.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#6D28D9] text-white shadow-sm'
                    : 'bg-[#F5F3FF] text-[#6B6385] hover:text-[#1F1637] border border-[#EDE9FE]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPlaces.slice(0, 8).map((place) => {
            const dest = featuredDestinations.find(d => d.id === place.destinationId);
            return (
              <Link
                key={place.id}
                to={`/place/${place.id}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer hover:shadow-wayfarer-lg transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={place.photos[0] || '/src/assets/images/destination_amalfi_1792651128378.jpg'}
                    alt={place.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => toggleSave(place.id, e)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 text-[#1F1637] hover:bg-white transition-all"
                  >
                    <Heart className={`w-3.5 h-3.5 ${savedIds.includes(place.id) ? 'fill-[#6D28D9] text-[#6D28D9]' : ''}`} />
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-[#6D28D9]">
                    {place.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-[#1F1637] line-clamp-1 group-hover:text-[#6D28D9] transition-colors">
                      {place.name}
                    </h4>
                  </div>
                  
                  <p className="text-[11px] text-[#6B6385] line-clamp-2">
                    {place.description}
                  </p>

                  <div className="pt-2 border-t border-[#EDE9FE]">
                    <RatingDisplay
                      avgRating={place.avgRating}
                      reviewCount={place.reviewCount}
                      externalRating={place.externalRating}
                      externalRatingSource={place.externalRatingSource}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6B6385] pt-1">
                    <span className="font-medium text-[#6D28D9] bg-[#F5F3FF] px-1.5 py-0.5 rounded text-[10px]">
                      {place.sourceBadge || 'From OpenStreetMap'}
                    </span>
                    <span className="font-semibold text-[#1F1637]">
                      {place.estimatedCost === 0 ? 'Free entry' : `₹${place.estimatedCost.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Boutique Stays Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-[#F5F3FF] rounded-3xl border border-[#EDE9FE] shadow-wayfarer">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Handpicked Stays</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F1637] mt-1">
                Featured Accommodations
              </h2>
            </div>
            <p className="text-xs text-[#6B6385]">Redirect booking only — no card required on Wayfarer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allHotels.slice(0, 3).map((hotel) => (
              <Link
                key={hotel.id}
                to={`/hotel/${hotel.id}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-sm hover:shadow-wayfarer transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.photos[0]}
                    alt={hotel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#6D28D9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {'★'.repeat(hotel.starClass)} Star
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-heading font-bold text-sm text-[#1F1637] group-hover:text-[#6D28D9] transition-colors">
                    {hotel.name}
                  </h4>
                  <p className="text-xs text-[#6B6385] line-clamp-1">{hotel.address}</p>

                  <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#6B6385]">from</span>
                      <p className="text-base font-bold text-[#1F1637] tabular-nums">
                        ₹{hotel.pricePerNight.toLocaleString()}
                        <span className="text-[10px] font-normal text-[#6B6385]"> / night</span>
                      </p>
                    </div>
                    <span className="px-3 py-1.5 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl group-hover:bg-[#5B21B6] transition-colors">
                      View Stay
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
