import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wayfarerStore } from '../../services/store';
import { wayfarerApi } from '../../services/api';
import {
  Calendar,
  Sparkles,
  Plane,
  Building,
  Clock,
  Share2,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Send,
  ArrowLeft
} from 'lucide-react';

interface ItineraryViewPageProps {
  isReadOnlyShared?: boolean;
}

export function ItineraryViewPage({ isReadOnlyShared = false }: ItineraryViewPageProps) {
  const { id, shareId } = useParams<{ id?: string; shareId?: string }>();
  const lookupKey = isReadOnlyShared ? (shareId || '') : (id || '');
  
  const trip = wayfarerStore.getTripById(lookupKey);
  const [itinerary, setItinerary] = useState(trip ? wayfarerStore.getItinerary(trip.id) : undefined);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!trip || !itinerary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#1F1637]">Itinerary Not Found</h2>
        <p className="text-xs text-[#6B6385] mt-1">This trip may have expired or was set to private.</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl">
          Return to Explore
        </Link>
      </div>
    );
  }

  const selectedTransport = itinerary.transportOptions[0];
  const selectedHotel = itinerary.hotelOptions[0];

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const fresh = await wayfarerApi.generateItinerary(trip.id);
      setItinerary(fresh);
      wayfarerStore.saveTrip(trip, fresh);
    } catch (e) {
      console.warn('Regeneration error:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleShare = () => {
    const shareLink = `${window.location.origin}/trip/share/${trip.shareId || trip.id}`;
    navigator.clipboard.writeText(shareLink);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs">
        {!isReadOnlyShared ? (
          <Link to={`/trips/${trip.id}`} className="inline-flex items-center gap-1.5 text-[#6D28D9] font-semibold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Trip Overview</span>
          </Link>
        ) : (
          <span className="bg-[#F5F3FF] text-[#6D28D9] font-medium px-2.5 py-1 rounded-md border border-[#EDE9FE]">
            Read-Only Shared Itinerary
          </span>
        )}

        <div className="flex items-center gap-2">
          {!isReadOnlyShared && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-3.5 py-2 bg-white text-[#1F1637] border border-[#EDE9FE] rounded-xl text-xs font-semibold hover:bg-[#F5F3FF] transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#6D28D9] ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Plan'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="px-3.5 py-2 bg-[#6D28D9] text-white rounded-xl text-xs font-semibold hover:bg-[#5B21B6] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Link Copied!' : 'Share Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE9FE] shadow-wayfarer">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
              {trip.days}-Day Curated Journey
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#1F1637] mt-1">
              {trip.destination} Travel Itinerary
            </h1>
            <p className="text-xs text-[#6B6385] mt-1">
              Departing from {trip.origin} · Total Budget: ₹{trip.budget.toLocaleString()}
            </p>
          </div>

          <Link
            to="/telegram"
            className="px-4 py-2.5 bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#6D28D9] text-xs font-bold rounded-xl transition-all border border-[#EDE9FE] flex items-center gap-2 w-fit"
          >
            <Send className="w-4 h-4" />
            <span>Sync with Telegram Bot</span>
          </Link>
        </div>

        {/* Selected Transport & Hotel Summary Strip at Top */}
        <div className="mt-6 pt-6 border-t border-[#EDE9FE] grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Transport summary */}
          {selectedTransport && (
            <div className="p-3.5 rounded-xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Plane className="w-4 h-4 text-[#6D28D9]" />
                <div>
                  <p className="font-semibold text-[#1F1637]">{selectedTransport.carrier}</p>
                  <p className="text-[11px] text-[#6B6385]">{selectedTransport.departureTime} departure · {selectedTransport.duration}</p>
                </div>
              </div>
              <span className="font-bold text-[#1F1637] tabular-nums">₹{selectedTransport.price.toLocaleString()}</span>
            </div>
          )}

          {/* Hotel summary */}
          {selectedHotel && (
            <div className="p-3.5 rounded-xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-[#6D28D9]" />
                <div>
                  <p className="font-semibold text-[#1F1637]">{selectedHotel.name}</p>
                  <p className="text-[11px] text-[#6B6385]">{'★'.repeat(selectedHotel.starClass)} · Verified Partner</p>
                </div>
              </div>
              <span className="font-bold text-[#1F1637] tabular-nums">₹{selectedHotel.pricePerNight.toLocaleString()}/nt</span>
            </div>
          )}
        </div>
      </div>

      {/* Day-by-Day Timeline */}
      <div className="space-y-8">
        {itinerary.dayPlan.map((day) => (
          <div key={day.day} className="bg-white rounded-3xl border border-[#EDE9FE] shadow-wayfarer overflow-hidden">
            
            {/* Day Header */}
            <div className="p-6 bg-[#F5F3FF] border-b border-[#EDE9FE] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
                  Day {day.day}
                </span>
                <h3 className="text-xl font-bold font-heading text-[#1F1637] mt-0.5">
                  {day.title}
                </h3>
              </div>
              <span className="text-xs font-medium text-[#6B6385] bg-white px-3 py-1 rounded-full border border-[#EDE9FE] w-fit">
                {day.theme}
              </span>
            </div>

            {/* Activities Timeline */}
            <div className="p-6 divide-y divide-[#EDE9FE]">
              {day.activities.map((act) => (
                <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className="w-20 shrink-0 pt-0.5">
                    <span className="font-mono text-xs font-bold text-[#6D28D9] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.timeSlot}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-sm text-[#1F1637]">{act.title}</h4>
                      {act.costEstimate > 0 && (
                        <span className="text-xs font-semibold text-[#1F1637] tabular-nums">
                          ~₹{act.costEstimate}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B6385] leading-relaxed">{act.description}</p>
                    
                    {act.placeId && (
                      <Link
                        to={`/place/${act.placeId}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6D28D9] hover:underline pt-1"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>View Sight Details &amp; Reviews</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
