import React from 'react';
import { Link } from 'react-router-dom';
import { wayfarerStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Sparkles, MapPin, ArrowRight, Share2, Plus } from 'lucide-react';

export function MyTripsPage() {
  const { user } = useAuth();
  const trips = wayfarerStore.getTrips();
  const destinations = wayfarerStore.getDestinations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
            Travel Portfolio
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-[#1F1637] mt-1">
            My Planned Trips
          </h1>
          <p className="text-xs text-[#6B6385] mt-1">
            Access your saved itineraries, shared links, and offline routes.
          </p>
        </div>

        <Link
          to="/plan"
          className="px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all shadow-wayfarer flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip with AI</span>
        </Link>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className="text-center py-20 bg-[#F5F3FF] rounded-3xl border border-[#EDE9FE] p-8 space-y-3">
          <Calendar className="w-10 h-10 text-[#6D28D9] mx-auto opacity-80" />
          <h3 className="font-heading font-bold text-lg text-[#1F1637]">No Trips Saved Yet</h3>
          <p className="text-xs text-[#6B6385] max-w-sm mx-auto">
            Use our AI itinerary architect to generate a customized travel plan in seconds.
          </p>
          <Link
            to="/plan"
            className="inline-block mt-3 px-5 py-2.5 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl"
          >
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const dest = destinations.find(d => d.name.toLowerCase() === trip.destination.toLowerCase() || d.id === trip.destinationId);
            const heroImage = dest?.heroImage || '/src/assets/images/destination_goa_1792651128327.jpg';

            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer hover:shadow-wayfarer-lg transition-all flex flex-col justify-between"
              >
                <div className="h-44 relative">
                  <img src={heroImage} alt={trip.destination} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#6D28D9] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{trip.days} Days</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-medium flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-violet-300" />
                    <span>{trip.origin} → {trip.destination}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-lg text-[#1F1637]">
                      {trip.destination} Adventure
                    </h3>
                    <p className="text-xs text-[#6B6385]">
                      Created {new Date(trip.createdAt).toLocaleDateString()} · Budget: ₹{trip.budget.toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-between gap-2">
                    <Link
                      to={`/trips/${trip.id}/itinerary`}
                      className="px-3.5 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Timeline</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <Link
                      to={`/trips/${trip.id}`}
                      className="px-3 py-2 bg-[#F5F3FF] text-[#6D28D9] text-xs font-semibold rounded-xl hover:bg-[#EDE9FE] transition-colors"
                    >
                      Overview
                    </Link>

                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/trip/share/${trip.shareId || trip.id}`;
                        navigator.clipboard.writeText(link);
                        alert(`Shareable itinerary link copied: ${link}`);
                      }}
                      className="p-2 border border-[#EDE9FE] rounded-xl text-[#6B6385] hover:text-[#6D28D9] hover:bg-[#F5F3FF] transition-colors"
                      title="Share trip"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
