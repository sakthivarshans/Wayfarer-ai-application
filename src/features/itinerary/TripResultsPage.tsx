import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wayfarerStore } from '../../services/store';
import { RatingDisplay } from '../../components/common/RatingDisplay';
import {
  Calendar,
  Sparkles,
  Plane,
  Train,
  Bus,
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock,
  Share2,
  DollarSign
} from 'lucide-react';

export function TripResultsPage() {
  const { id } = useParams<{ id: string }>();
  const trip = wayfarerStore.getTripById(id || '');
  const itinerary = wayfarerStore.getItinerary(id || '');

  const [activeTab, setActiveTab] = useState<'places' | 'transport' | 'hotels' | 'restaurants'>('places');

  if (!trip || !itinerary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#1F1637]">Trip Not Found</h2>
        <Link to="/plan" className="inline-block mt-4 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl">
          Plan a New Trip
        </Link>
      </div>
    );
  }

  // Sort transport by price
  const sortedTransport = [...itinerary.transportOptions].sort((a, b) => a.price - b.price);

  // Calculate estimated total
  const selectedTransport = sortedTransport[0];
  const selectedHotel = itinerary.hotelOptions[0];
  const hotelTotal = selectedHotel ? selectedHotel.pricePerNight * trip.days : 0;
  const estimatedTotal = (selectedTransport ? selectedTransport.price : 0) + hotelTotal + (trip.days * 2000);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Trip Summary Banner */}
      <div className="bg-gradient-to-r from-[#F5F3FF] via-white to-[#F5F3FF] p-6 sm:p-8 rounded-3xl border border-[#EDE9FE] shadow-wayfarer">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6D28D9] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI Trip Plan #{trip.id.replace('trip_', '')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#1F1637]">
              {trip.origin} → {trip.destination}
            </h1>
            <p className="text-xs text-[#6B6385] mt-1">
              {trip.days} Days · Budget: ₹{trip.budget.toLocaleString()} · Preference: {trip.transportPreference.toUpperCase()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/trips/${trip.id}/itinerary`}
              className="px-5 py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all shadow-wayfarer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>View Day-by-Day Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/trip/share/${trip.shareId || trip.id}`;
                navigator.clipboard.writeText(shareUrl);
                alert(`Shared itinerary link copied: ${shareUrl}`);
              }}
              className="px-4 py-3 bg-white text-[#1F1637] border border-[#EDE9FE] hover:bg-[#F5F3FF] text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-[#6D28D9]" />
              <span>Share Trip</span>
            </button>
          </div>
        </div>

        {/* Budget vs Est. Cost Bar */}
        <div className="mt-6 pt-6 border-t border-[#EDE9FE] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#6B6385]">Target Budget</span>
            <p className="text-base font-bold text-[#1F1637] tabular-nums">₹{trip.budget.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[#6B6385]">Est. Trip Cost</span>
            <p className="text-base font-bold text-[#6D28D9] tabular-nums">₹{estimatedTotal.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[#6B6385]">Duration</span>
            <p className="text-base font-bold text-[#1F1637]">{trip.days} Days / {trip.days - 1} Nights</p>
          </div>
          <div>
            <span className="text-[#6B6385]">Savings / Buffer</span>
            <p className={`text-base font-bold tabular-nums ${trip.budget >= estimatedTotal ? 'text-[#16A34A]' : 'text-amber-600'}`}>
              ₹{(trip.budget - estimatedTotal).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#EDE9FE] pb-1 text-xs font-bold">
        {[
          { id: 'places', label: `Places & Activities (${itinerary.places.length})` },
          { id: 'transport', label: `Transport Options (${sortedTransport.length})` },
          { id: 'hotels', label: `Recommended Hotels (${itinerary.hotelOptions.length})` },
          { id: 'restaurants', label: `Dining Spots (${wayfarerStore.getRestaurants(itinerary.destinationId).length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#6D28D9] text-white shadow-sm'
                : 'text-[#6B6385] hover:text-[#1F1637] hover:bg-[#F5F3FF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: PLACES */}
      {activeTab === 'places' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {itinerary.places.map(p => (
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
              <div className="p-4 space-y-2">
                <h4 className="font-heading font-bold text-sm text-[#1F1637] group-hover:text-[#6D28D9]">{p.name}</h4>
                <p className="text-xs text-[#6B6385] line-clamp-2">{p.description}</p>
                <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between text-xs">
                  <RatingDisplay avgRating={p.avgRating} reviewCount={p.reviewCount} size="sm" />
                  <span className="font-semibold text-[#1F1637]">
                    {p.estimatedCost === 0 ? 'Free' : `₹${p.estimatedCost}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* TAB CONTENT: TRANSPORT */}
      {activeTab === 'transport' && (
        <div className="space-y-4">
          <p className="text-xs text-[#6B6385]">
            Ranked by price. Redirects directly to official booking carrier portals.
          </p>

          <div className="space-y-3">
            {sortedTransport.map(t => {
              const ModeIcon = t.mode === 'flight' ? Plane : t.mode === 'train' ? Train : Bus;
              return (
                <div
                  key={t.id}
                  className="p-5 bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#6D28D9] shrink-0">
                      <ModeIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F1637]">{t.carrier}</span>
                        <span className="text-[10px] uppercase font-semibold text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded">
                          {t.mode}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6B6385] mt-1">
                        <span>{t.departureTime} → {t.arrivalTime}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#EDE9FE]">
                    <div className="text-right">
                      <span className="text-[10px] text-[#6B6385]">Fare per passenger</span>
                      <p className="text-lg font-bold text-[#1F1637] tabular-nums">
                        ₹{t.price.toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={t.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <span>Book</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HOTELS */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itinerary.hotelOptions.map(h => (
            <div key={h.id} className="bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer flex flex-col justify-between">
              <div className="h-48 relative">
                <img src={h.photos[0]} alt={h.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#6D28D9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {'★'.repeat(h.starClass)} Star
                </span>
              </div>
              <div className="p-5 space-y-3">
                <h4 className="font-heading font-bold text-base text-[#1F1637]">{h.name}</h4>
                <p className="text-xs text-[#6B6385] line-clamp-2">{h.description}</p>
                <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#6B6385]">per night</span>
                    <p className="text-base font-bold text-[#1F1637] tabular-nums">₹{h.pricePerNight.toLocaleString()}</p>
                  </div>
                  <Link
                    to={`/hotel/${h.id}`}
                    className="px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors"
                  >
                    View Hotel &amp; Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: RESTAURANTS */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wayfarerStore.getRestaurants(itinerary.destinationId).map(r => (
            <Link
              key={r.id}
              to={`/restaurant/${r.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer hover:border-[#6D28D9] transition-all p-4 space-y-2 block"
            >
              <img src={r.photos[0]} alt={r.name} className="w-full h-36 object-cover rounded-xl" />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-[#6D28D9]">{r.cuisines.join(', ')}</span>
                <span className="text-xs font-bold text-[#1F1637]">{'₹'.repeat(r.priceLevel)}</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#1F1637]">{r.name}</h4>
              <RatingDisplay avgRating={r.avgRating} reviewCount={r.reviewCount} size="sm" />
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
