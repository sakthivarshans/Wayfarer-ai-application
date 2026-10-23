import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wayfarerStore } from '../../services/store';
import { wayfarerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RatingDisplay } from '../../components/common/RatingDisplay';
import { ReviewModal } from '../reviews/ReviewModal';
import { WayfarerMap, MapItem } from '../map/WayfarerMap';
import {
  MapPin,
  ExternalLink,
  ShieldCheck,
  ThumbsUp,
  Flag,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Share2,
  Loader2
} from 'lucide-react';
import { Hotel, Destination } from '../../types';

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [hotel, setHotel] = useState<Hotel | null>(() => (id ? wayfarerStore.getHotelById(id) || null : null));
  const [destination, setDestination] = useState<Destination | null>(() => {
    if (hotel) return wayfarerStore.getDestinationById(hotel.destinationId) || null;
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!hotel);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [reportedReviews, setReportedReviews] = useState<string[]>([]);
  const [helpfulVoted, setHelpfulVoted] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadHotel() {
      if (hotel && destination) return;
      setIsLoading(true);

      try {
        const stored = wayfarerStore.getHotelById(id!);
        if (stored && isMounted) {
          setHotel(stored);
          const d = wayfarerStore.getDestinationById(stored.destinationId);
          if (d) setDestination(d);
        }

        const data = await wayfarerApi.getHotelById(id!);
        if (isMounted && data && data.hotel) {
          setHotel(data.hotel);
          wayfarerStore.saveHotel(data.hotel);
          if (data.destination) {
            setDestination(data.destination);
          }
        }
      } catch (e) {
        console.warn('Failed to load hotel:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadHotel();
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin mx-auto" />
        <h3 className="font-heading font-bold text-lg text-[#1F1637]">
          Loading Hotel Details...
        </h3>
        <p className="text-xs text-[#6B6385]">Checking live availability and verified amenities.</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#1F1637]">Hotel Not Found</h2>
        <p className="text-xs text-[#6B6385] mt-1">We couldn't locate this accommodation in our verified listings.</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors">
          Return to home
        </Link>
      </div>
    );
  }

  const reviews = wayfarerStore.getApprovedReviews(hotel.id);
  const nearbyPlaces = wayfarerStore.getPlaces(hotel.destinationId).slice(0, 3);

  // Affiliate Click Handler: write affiliateClicks doc first, then open partner link
  const handleAffiliateBooking = () => {
    wayfarerStore.recordAffiliateClick(hotel.id, user?.uid);
    window.open(hotel.affiliateUrl, '_blank', 'noopener,sponsored');
  };

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
      alert('Thank you. The report has been flagged for admin moderation.');
    } else if (!user) {
      alert('Please sign in to report reviews.');
    }
  };

  const mapItem: MapItem[] = [
    {
      id: hotel.id,
      type: 'hotel',
      name: hotel.name,
      categoryOrCuisine: `${hotel.starClass}★ Hotel`,
      lat: hotel.lat,
      lng: hotel.lng,
      photo: hotel.photos[0],
      price: `₹${hotel.pricePerNight.toLocaleString()}`,
      linkUrl: `/hotel/${hotel.id}`
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
      
      {/* Breadcrumb Navigation */}
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
        <span className="text-[#1F1637] font-semibold truncate">{hotel.name}</span>
      </div>

      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6D28D9] tracking-wider uppercase">
              {'★'.repeat(hotel.starClass)} Star Accommodation
            </span>
            <span className="text-xs text-[#6B6385]">·</span>
            <span className="text-xs text-[#6B6385]">Verified Partner: {hotel.affiliateProvider}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#1F1637] mt-1">
            {hotel.name}
          </h1>
          <p className="flex items-center gap-1.5 text-xs text-[#6B6385] mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span>{hotel.address}</span>
          </p>
        </div>

        {/* Rating Summary */}
        <div className="bg-[#F5F3FF] p-3 rounded-2xl border border-[#EDE9FE] w-fit">
          <RatingDisplay
            avgRating={hotel.avgRating}
            reviewCount={hotel.reviewCount}
            onWriteReviewClick={() => setIsReviewModalOpen(true)}
            size="md"
          />
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 rounded-2xl overflow-hidden border border-[#EDE9FE] h-[340px] sm:h-[440px] shadow-wayfarer">
          <img
            src={hotel.photos[selectedPhotoIndex] || hotel.photos[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-4 flex md:flex-col gap-3 overflow-x-auto no-scrollbar">
          {hotel.photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              className={`relative rounded-xl overflow-hidden border-2 h-24 md:h-full flex-1 min-w-[100px] transition-all ${
                selectedPhotoIndex === idx ? 'border-[#6D28D9] ring-2 ring-[#6D28D9]/20' : 'border-[#EDE9FE] opacity-80 hover:opacity-100'
              }`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Details & Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Description, Amenities, Nearby & Reviews */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* About Hotel */}
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-3">
            <h3 className="font-heading font-bold text-lg text-[#1F1637]">About This Stay</h3>
            <p className="text-sm text-[#6B6385] leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-3">
            <h3 className="font-heading font-bold text-lg text-[#1F1637]">Amenities &amp; Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-2 text-xs text-[#1F1637]">
                  <CheckCircle className="w-4 h-4 text-[#6D28D9] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Highlights */}
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#1F1637]">Nearby Attractions</h3>
            <div className="space-y-3">
              {nearbyPlaces.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F3FF] border border-[#EDE9FE]">
                  <div className="flex items-center gap-3">
                    <img src={p.photos[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-xs text-[#1F1637]">{p.name}</p>
                      <p className="text-[11px] text-[#6B6385]">{p.category}</p>
                    </div>
                  </div>
                  <Link to={`/place/${p.id}`} className="text-xs font-semibold text-[#6D28D9] hover:underline">
                    View Sight →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1F1637]">Guest Reviews</h3>
                <p className="text-xs text-[#6B6385]">{reviews.length} verified traveler experiences</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors shadow-sm"
              >
                Write a Review
              </button>
            </div>

            {/* Rating distribution if 5+ reviews */}
            <RatingDisplay
              avgRating={hotel.avgRating}
              reviewCount={hotel.reviewCount}
              showDistribution={hotel.reviewCount >= 5}
            />

            {/* Review Cards */}
            <div className="divide-y divide-[#EDE9FE]">
              {reviews.map(rev => (
                <div key={rev.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.userPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#1F1637]">{rev.userName}</p>
                        <p className="text-[10px] text-[#6B6385]">Stayed {rev.visitDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-[#F59E0B]">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>

                  <h5 className="font-semibold text-xs text-[#1F1637]">{rev.title}</h5>
                  <p className="text-xs text-[#6B6385] leading-relaxed">{rev.body}</p>

                  {/* Actions: Helpful vote & Report */}
                  <div className="flex items-center gap-4 pt-2 text-[11px] text-[#6B6385]">
                    <button
                      onClick={() => handleHelpfulClick(rev.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        helpfulVoted.includes(rev.id) ? 'text-[#6D28D9] font-semibold' : 'hover:text-[#1F1637]'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                    <button
                      onClick={() => handleReportClick(rev.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        reportedReviews.includes(rev.id) ? 'text-red-500 font-semibold' : 'hover:text-red-500'
                      }`}
                    >
                      <Flag className="w-3 h-3" />
                      <span>{reportedReviews.includes(rev.id) ? 'Reported' : 'Report'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Booking & Partner Box */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE9FE] shadow-wayfarer-lg space-y-4">
            
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#6B6385]">Price per night</span>
                <p className="text-2xl font-extrabold font-heading text-[#1F1637] tabular-nums">
                  ₹{hotel.pricePerNight.toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#16A34A] bg-green-50 px-2 py-1 rounded-md">
                Best Rate Guaranteed
              </span>
            </div>

            {/* Violet Primary "Check availability" button */}
            <button
              onClick={handleAffiliateBooking}
              className="w-full py-3.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all shadow-wayfarer flex items-center justify-center gap-2"
            >
              <span>Check availability</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Mandatory Affiliate Disclosure */}
            <div className="p-3 bg-[#F5F3FF] rounded-xl border border-[#EDE9FE] text-[11px] text-[#6B6385] leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#6D28D9] inline mr-1" />
              <span>Wayfarer may earn a commission when you book through this link. You will be redirected to {hotel.affiliateProvider.toUpperCase()}.</span>
            </div>

            {/* Mini Map */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-[#1F1637] mb-2">Location &amp; Surroundings</p>
              <div className="h-44 rounded-xl overflow-hidden border border-[#EDE9FE]">
                <WayfarerMap
                  center={[hotel.lat, hotel.lng]}
                  zoom={14}
                  items={mapItem}
                  selectedItemId={hotel.id}
                  showRadiusFilter={false}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        targetType="hotel"
        targetId={hotel.id}
        targetName={hotel.name}
      />
    </div>
  );
}
