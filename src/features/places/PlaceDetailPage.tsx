import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wayfarerStore } from '../../services/store';
import { wayfarerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RatingDisplay } from '../../components/common/RatingDisplay';
import { ReviewModal } from '../reviews/ReviewModal';
import { WayfarerMap, MapItem } from '../map/WayfarerMap';
import { MapPin, ThumbsUp, Flag, Sparkles, Navigation, Loader2 } from 'lucide-react';
import { Place, Destination } from '../../types';

export function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [place, setPlace] = useState<Place | null>(() => (id ? wayfarerStore.getPlaceById(id) || null : null));
  const [destination, setDestination] = useState<Destination | null>(() => {
    if (place) return wayfarerStore.getDestinationById(place.destinationId) || null;
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!place);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState<string[]>([]);
  const [reportedReviews, setReportedReviews] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadPlace() {
      // If already loaded in state and destination exists, no need to re-fetch
      if (place && destination) return;

      setIsLoading(true);
      try {
        const stored = wayfarerStore.getPlaceById(id!);
        if (stored) {
          if (isMounted) {
            setPlace(stored);
            const d = wayfarerStore.getDestinationById(stored.destinationId);
            if (d) setDestination(d);
          }
        }

        // Fetch from API
        const data = await wayfarerApi.getPlaceById(id!);
        if (isMounted && data && data.place) {
          setPlace(data.place);
          wayfarerStore.savePlace(data.place);
          if (data.destination) {
            setDestination(data.destination);
          }
        }
      } catch (e) {
        console.warn('Failed to load place:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPlace();
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin mx-auto" />
        <h3 className="font-heading font-bold text-lg text-[#1F1637]">
          Loading Attraction Details...
        </h3>
        <p className="text-xs text-[#6B6385]">Retrieving historical records and visitor reviews.</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#1F1637]">Sight Not Found</h2>
        <p className="text-xs text-[#6B6385] mt-1">We couldn't locate this attraction in our verified records.</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors">Return to home</Link>
      </div>
    );
  }

  const reviews = wayfarerStore.getApprovedReviews(place.id);
  const nearbyPlaces = wayfarerStore.getPlaces(place.destinationId).filter(p => p.id !== place.id).slice(0, 3);

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulVoted.includes(reviewId)) return;
    wayfarerStore.voteHelpfulReview(reviewId);
    setHelpfulVoted([...helpfulVoted, reviewId]);
  };

  const handleReportClick = (reviewId: string) => {
    if (reportedReviews.includes(reviewId)) return;
    const reason = prompt('Please describe why you are reporting this review:');
    if (reason && user) {
      wayfarerStore.reportReview(reviewId, user.uid, reason);
      setReportedReviews([...reportedReviews, reviewId]);
      alert('Review reported for admin moderation.');
    }
  };

  const mapItem: MapItem[] = [
    {
      id: place.id,
      type: 'place',
      name: place.name,
      categoryOrCuisine: place.category,
      lat: place.lat,
      lng: place.lng,
      photo: place.photos[0],
      linkUrl: `/place/${place.id}`
    },
    ...nearbyPlaces.map(p => ({
      id: p.id,
      type: 'place' as const,
      name: p.name,
      categoryOrCuisine: p.category,
      lat: p.lat,
      lng: p.lng,
      photo: p.photos[0],
      linkUrl: `/place/${p.id}`
    }))
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#6B6385]">
        <Link to="/" className="hover:text-[#6D28D9]">Home</Link>
        <span>/</span>
        {destination && (
          <>
            <Link to={`/destination/${destination.slug}`} className="hover:text-[#6D28D9]">
              {destination.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#1F1637] font-semibold truncate">{place.name}</span>
      </div>

      {/* Main Title & Rating */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
            {place.category} Sight
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#1F1637] mt-1">
            {place.name}
          </h1>
          <p className="text-xs text-[#6B6385] mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span>{destination?.name}, {destination?.country}</span>
          </p>
        </div>

        <div className="bg-[#F5F3FF] p-3 rounded-2xl border border-[#EDE9FE] w-fit">
          <RatingDisplay
            avgRating={place.avgRating}
            reviewCount={place.reviewCount}
            externalRating={place.externalRating}
            externalRatingSource={place.externalRatingSource}
            onWriteReviewClick={() => setIsReviewModalOpen(true)}
            size="md"
          />
        </div>
      </div>

      {/* Hero Visual */}
      <div className="h-[340px] sm:h-[460px] rounded-3xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer relative">
        <img
          src={place.photos[0]}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold text-[#1F1637] border border-[#EDE9FE]">
          Estimated Cost: {place.estimatedCost === 0 ? 'Free to visit' : `₹${place.estimatedCost.toLocaleString()}`}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Description & Reviews */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-3">
            <h3 className="font-heading font-bold text-lg text-[#1F1637]">Overview &amp; Practical Advice</h3>
            <p className="text-sm text-[#6B6385] leading-relaxed">{place.description}</p>
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1F1637]">Community Reviews</h3>
                <p className="text-xs text-[#6B6385]">{reviews.length} approved traveler tips</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors shadow-sm"
              >
                Write a Review
              </button>
            </div>

            <RatingDisplay
              avgRating={place.avgRating}
              reviewCount={place.reviewCount}
              showDistribution={place.reviewCount >= 5}
            />

            <div className="divide-y divide-[#EDE9FE]">
              {reviews.map(rev => (
                <div key={rev.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#1F1637]">{rev.userName}</p>
                    <span className="text-xs text-[#F59E0B]">{'★'.repeat(rev.rating)}</span>
                  </div>
                  <h5 className="font-semibold text-xs text-[#1F1637]">{rev.title}</h5>
                  <p className="text-xs text-[#6B6385] leading-relaxed">{rev.body}</p>
                  <div className="flex items-center gap-4 pt-1 text-[11px] text-[#6B6385]">
                    <button onClick={() => handleHelpfulClick(rev.id)} className="flex items-center gap-1 hover:text-[#1F1637]">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                    <button onClick={() => handleReportClick(rev.id)} className="flex items-center gap-1 hover:text-red-500">
                      <Flag className="w-3 h-3" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Mini Map & Planner CTA */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-4">
            <h4 className="font-heading font-bold text-base text-[#1F1637]">Location &amp; Map</h4>
            <div className="h-48 rounded-xl overflow-hidden border border-[#EDE9FE]">
              <WayfarerMap
                center={[place.lat, place.lng]}
                zoom={14}
                items={mapItem}
                selectedItemId={place.id}
                showRadiusFilter={false}
                className="h-full"
              />
            </div>

            <div className="pt-2">
              <Link
                to={`/plan?destination=${encodeURIComponent(destination?.name || '')}`}
                className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add to AI Trip Itinerary</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        targetType="place"
        targetId={place.id}
        targetName={place.name}
      />
    </div>
  );
}
