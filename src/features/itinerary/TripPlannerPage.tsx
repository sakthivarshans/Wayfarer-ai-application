import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Sparkles, Calendar, DollarSign, Plane, Train, Bus, Globe, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { wayfarerApi } from '../../services/api';
import { wayfarerStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { TransportPreference } from '../../types';

// Zod Schema for Trip Plan validation
const TripPlanFormSchema = z.object({
  origin: z.string().min(2, 'Origin city is required (at least 2 characters).'),
  destination: z.string().min(2, 'Destination city is required.'),
  budget: z.number().min(5000, 'Minimum realistic budget is ₹5,000.'),
  days: z.number().min(1, 'Trip duration must be at least 1 day.').max(30, 'Maximum duration is 30 days.'),
  transportPreference: z.enum(['flight', 'train', 'bus', 'any'] as const)
});

export function TripPlannerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [origin, setOrigin] = useState('Mumbai');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Goa');
  const [budget, setBudget] = useState(65000);
  const [days, setDays] = useState(3);
  const [transportPreference, setTransportPreference] = useState<TransportPreference>('flight');

  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const popularOrigins = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad'];
  const popularDestinations = ['Goa', 'Amalfi Coast', 'Kyoto'];

  const handleGenerateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const result = TripPlanFormSchema.safeParse({
      origin,
      destination,
      budget: Number(budget),
      days: Number(days),
      transportPreference
    });

    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    try {
      setIsGenerating(true);

      // Create trip and generate itinerary
      const newTrip = await wayfarerApi.createTrip({
        origin,
        destination,
        budget: Number(budget),
        days: Number(days),
        transportPreference
      });

      const itinerary = await wayfarerApi.generateItinerary(newTrip.id);

      // Persist in store
      wayfarerStore.saveTrip(newTrip, itinerary);

      navigate(`/trips/${newTrip.id}`);
    } catch (err: any) {
      setValidationErrors({ form: err.message || 'Failed to generate itinerary. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3FF] border border-[#EDE9FE] text-xs font-semibold text-[#6D28D9]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Itinerary Architect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1F1637]">
          Plan Your Next Adventure with AI
        </h1>
        <p className="text-sm text-[#6B6385] leading-relaxed">
          Tell us your origin, destination, days, and budget. Wayfarer analyzes transport fares, vetted stays, and local reviews to build a personalized timeline.
        </p>
      </div>

      {/* Main Plan Form */}
      <div className="bg-white rounded-3xl border border-[#EDE9FE] shadow-wayfarer-lg p-6 sm:p-10">
        
        {validationErrors.form && (
          <div className="mb-6 p-4 bg-red-50 text-[#DC2626] rounded-2xl text-xs border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationErrors.form}</span>
          </div>
        )}

        <form onSubmit={handleGenerateTrip} className="space-y-6">
          
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1.5">
                Starting From (Origin)
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Mumbai, Delhi, London"
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-white focus:outline-none focus:border-[#6D28D9] ${
                  validationErrors.origin ? 'border-red-400' : 'border-[#EDE9FE]'
                }`}
                required
              />
              {validationErrors.origin && (
                <p className="text-[11px] text-[#DC2626] mt-1">{validationErrors.origin}</p>
              )}
              {/* Quick pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {popularOrigins.slice(0, 4).map(city => (
                  <button
                    type="button"
                    key={city}
                    onClick={() => setOrigin(city)}
                    className="text-[10px] text-[#6B6385] hover:text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded-md border border-[#EDE9FE]"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1.5">
                Where to? (Destination)
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Goa, Kyoto, Amalfi Coast"
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-white focus:outline-none focus:border-[#6D28D9] ${
                  validationErrors.destination ? 'border-red-400' : 'border-[#EDE9FE]'
                }`}
                required
              />
              {validationErrors.destination && (
                <p className="text-[11px] text-[#DC2626] mt-1">{validationErrors.destination}</p>
              )}
              {/* Quick pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {popularDestinations.map(dest => (
                  <button
                    type="button"
                    key={dest}
                    onClick={() => setDestination(dest)}
                    className="text-[10px] text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded-md border border-[#EDE9FE] font-medium"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Days & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1.5">
                Trip Duration (Days)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-[#EDE9FE] bg-white focus:outline-none focus:border-[#6D28D9] tabular-nums"
                  required
                />
              </div>
              {validationErrors.days && (
                <p className="text-[11px] text-[#DC2626] mt-1">{validationErrors.days}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1.5">
                Estimated Total Budget (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-xs text-[#6B6385] font-semibold">₹</span>
                <input
                  type="number"
                  step="1000"
                  min="5000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 text-sm rounded-xl border border-[#EDE9FE] bg-white focus:outline-none focus:border-[#6D28D9] tabular-nums"
                  required
                />
              </div>
              {validationErrors.budget && (
                <p className="text-[11px] text-[#DC2626] mt-1">{validationErrors.budget}</p>
              )}
            </div>
          </div>

          {/* Transport Preference */}
          <div>
            <label className="block text-xs font-semibold text-[#1F1637] mb-2">
              Preferred Mode of Transport
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'flight', label: 'Flight', icon: Plane, desc: 'Fastest transit' },
                { id: 'train', label: 'Train', icon: Train, desc: 'Scenic rail' },
                { id: 'bus', label: 'Bus', icon: Bus, desc: 'Budget-friendly' },
                { id: 'any', label: 'Any Mode', icon: Globe, desc: 'Compare all' }
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = transportPreference === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setTransportPreference(opt.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#6D28D9] bg-[#F5F3FF] shadow-sm'
                        : 'border-[#EDE9FE] bg-white hover:border-[#6D28D9]/40'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#6D28D9]' : 'text-[#6B6385]'}`} />
                    <p className={`font-semibold text-xs mt-2 ${isSelected ? 'text-[#6D28D9]' : 'text-[#1F1637]'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-[#6B6385]">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-sm rounded-2xl transition-all shadow-wayfarer-lg flex items-center justify-center gap-2.5 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Flights, Stays &amp; Verified Sights...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Complete Itinerary</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-[#6B6385] mt-2">
              Free instant generation · Powered by Wayfarer travel model &amp; Geoapify
            </p>
          </div>

        </form>
      </div>

    </div>
  );
}
