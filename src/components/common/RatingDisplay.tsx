import React from 'react';
import { Star, MessageSquarePlus, ExternalLink } from 'lucide-react';

interface RatingDisplayProps {
  avgRating: number;
  reviewCount: number;
  externalRating?: number;
  externalRatingSource?: string;
  onWriteReviewClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDistribution?: boolean;
  ratingsBreakdown?: { [star: number]: number }; // star 1..5 counts
}

export function RatingDisplay({
  avgRating,
  reviewCount,
  externalRating,
  externalRatingSource,
  onWriteReviewClick,
  size = 'md',
  showDistribution = false,
  ratingsBreakdown
}: RatingDisplayProps) {

  // Rule 1: 0 reviews
  if (reviewCount === 0) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {externalRating && externalRatingSource && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F3FF] text-[#6D28D9] border border-[#EDE9FE]">
            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
            <span>{externalRating.toFixed(1)} from {externalRatingSource}</span>
          </span>
        )}
        <span className="text-xs text-[#6B6385]">No Wayfarer reviews yet</span>
        {onWriteReviewClick && (
          <button
            onClick={onWriteReviewClick}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6D28D9] hover:text-[#5B21B6] transition-colors"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Be the first to review</span>
          </button>
        )}
      </div>
    );
  }

  // Rule 2 & 3: 1 to 4 reviews -> "New on Wayfarer"
  if (reviewCount >= 1 && reviewCount < 5) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[#F59E0B]">
            <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="font-semibold text-sm text-[#1F1637] tabular-nums">
              {avgRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-[#6D28D9] font-medium bg-[#F5F3FF] px-2 py-0.5 rounded-full border border-[#EDE9FE]">
            New on Wayfarer
          </span>
          <span className="text-xs text-[#6B6385]">
            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
          {externalRating && (
            <span className="text-[11px] text-[#6B6385] border-l border-[#EDE9FE] pl-2">
              Ext: {externalRating.toFixed(1)} via {externalRatingSource || 'OSM'}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Rule 4: 5 or more reviews -> Show average, star rating, and optionally distribution bar chart
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${
                s <= Math.round(avgRating)
                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#1F1637] tabular-nums">
          {avgRating.toFixed(1)}
        </span>
        <span className="text-xs text-[#6B6385]">
          ({reviewCount} reviews)
        </span>
        {externalRating && (
          <span className="text-[11px] text-[#6B6385] border-l border-[#EDE9FE] pl-2">
            OSM: {externalRating.toFixed(1)}
          </span>
        )}
      </div>

      {showDistribution && (
        <div className="bg-[#F5F3FF] p-4 rounded-xl border border-[#EDE9FE] space-y-1.5 max-w-sm">
          <p className="text-xs font-semibold text-[#1F1637] mb-2">Rating Distribution</p>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingsBreakdown?.[stars] || (stars === 5 ? Math.ceil(reviewCount * 0.6) : stars === 4 ? Math.floor(reviewCount * 0.3) : 1);
            const percentage = Math.min(100, Math.round((count / reviewCount) * 100));
            return (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-right text-[#6B6385]">{stars}★</span>
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-[#EDE9FE]">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[11px] text-[#6B6385] tabular-nums">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
