import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wayfarerStore } from '../../services/store';
import { wayfarerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RatingDisplay } from '../../components/common/RatingDisplay';
import { ReviewModal } from '../reviews/ReviewModal';
import { WayfarerMap, MapItem } from '../map/WayfarerMap';
import { MapPin, Utensils, ExternalLink, ThumbsUp, Flag, Loader2 } from 'lucide-react';
import { Restaurant, Destination } from '../../types';

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(() => (id ? wayfarerStore.getRestaurantById(id) || null : null));
  const [destination, setDestination] = useState<Destination | null>(() => {
    if (restaurant) return wayfarerStore.getDestinationById(restaurant.destinationId) || null;
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!restaurant);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState<string[]>([]);
  const [reportedReviews, setReportedReviews] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadRestaurant() {
      if (restaurant && destination) return;
      setIsLoading(true);

      try {
        const stored = wayfarerStore.getRestaurantById(id!);
        if (stored && isMounted) {
          setRestaurant(stored);
          const d = wayfarerStore.getDestinationById(stored.destinationId);
          if (d) setDestination(d);
        }

        const data = await wayfarerApi.getRestaurantById(id!);
        if (isMounted && data && data.restaurant) {
          setRestaurant(data.restaurant);
          wayfarerStore.saveRestaurant(data.restaurant);
          if (data.destination) {
            setDestination(data.destination);
          }
        }
      } catch (e) {
        console.warn('Failed to load restaurant:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRestaurant();
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin mx-auto" />
        <h3 className="font-heading font-bold text-lg text-[#1F1637]">
          Loading Restaurant Details...
        </h3>
        <p className="text-xs text-[#6B6385]">Checking regional menus and community diner ratings.</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#1F1637]">Restaurant Not Found</h2>
        <p className="text-xs text-[#6B6385] mt-1">We couldn't locate this dining venue in our verified records.</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors">Return to home</Link>
      </div>
    );
  }

  const reviews = wayfarerStore.getApprovedReviews(restaurant.id);

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulVoted.includes(reviewId)) return;
    wayfarerStore.voteHelpfulReview(reviewId);
    setHelpfulVoted([...helpfulVoted, reviewId]);
  };

  const mapItem: MapItem[] = [
    {
      id: restaurant.id,
      type: 'restaurant',
      name: restaurant.name,
      categoryOrCuisine: restaurant.cuisines.join(', '),
      lat: restaurant.lat,
      lng: restaurant.lng,
      photo: restaurant.photos[0],
      price: '₹'.repeat(restaurant.priceLevel),
      linkUrl: `/restaurant/${restaurant.id}`
    }
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
        <span className="text-[#1F1637] font-semibold truncate">{restaurant.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
            {restaurant.cuisines.join(' · ')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#1F1637] mt-1">
            {restaurant.name}
          </h1>
          <p className="text-xs text-[#6B6385] mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span>{destination?.name}, {destination?.country}</span>
          </p>
        </div>

        <div className="bg-[#F5F3FF] p-3 rounded-2xl border border-[#EDE9FE] w-fit">
          <RatingDisplay
            avgRating={restaurant.avgRating}
            reviewCount={restaurant.reviewCount}
            onWriteReviewClick={() => setIsReviewModalOpen(true)}
            size="md"
          />
        </div>
      </div>

      <div className="h-[340px] sm:h-[420px] rounded-3xl overflow-hidden border border-[#EDE9FE] shadow-wayfarer">
        <img src={restaurant.photos[0]} alt={restaurant.name} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#1F1637]">Dining Overview</h3>
            <p className="text-sm text-[#6B6385] leading-relaxed">
              Specializing in {restaurant.cuisines.join(', ')} prepared with locally sourced coastal ingredients. Rated {restaurant.avgRating}★ by travelers.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#1F1637]">
              <span>Price Level: <strong className="text-[#6D28D9]">{'₹'.repeat(restaurant.priceLevel)}</strong></span>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1F1637]">Guest Reviews</h3>
                <p className="text-xs text-[#6B6385]">{reviews.length} authentic food reviews</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors shadow-sm"
              >
                Write a Review
              </button>
            </div>

            <RatingDisplay
              avgRating={restaurant.avgRating}
              reviewCount={restaurant.reviewCount}
              showDistribution={restaurant.reviewCount >= 5}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-4">
            <h4 className="font-heading font-bold text-base text-[#1F1637]">Reservations</h4>
            {restaurant.reservationUrl ? (
              <a
                href={restaurant.reservationUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Reserve a Table</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-xs text-[#6B6385]">Walk-ins welcomed. Tables assigned on arrival.</p>
            )}

            <div className="pt-2">
              <p className="text-xs font-semibold text-[#1F1637] mb-2">Location</p>
              <div className="h-44 rounded-xl overflow-hidden border border-[#EDE9FE]">
                <WayfarerMap
                  center={[restaurant.lat, restaurant.lng]}
                  zoom={14}
                  items={mapItem}
                  selectedItemId={restaurant.id}
                  showRadiusFilter={false}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        targetType="restaurant"
        targetId={restaurant.id}
        targetName={restaurant.name}
      />
    </div>
  );
}
