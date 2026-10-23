import React, { useState } from 'react';
import { Star, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { wayfarerStore } from '../../services/store';
import { uploadImage } from '../../services/cloudinary';

interface ReviewModalProps {
  targetType: 'place' | 'hotel' | 'restaurant';
  targetId: string;
  targetName: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export function ReviewModal({
  targetType,
  targetId,
  targetName,
  isOpen,
  onClose,
  onReviewSubmitted
}: ReviewModalProps) {
  const { user, loginAsDemoUser } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (photoFiles.length + files.length > 4) {
      setErrorMsg('You can upload a maximum of 4 photos.');
      return;
    }

    const newFiles = [...photoFiles, ...files].slice(0, 4);
    setPhotoFiles(newFiles);

    // Generate previews
    const previews = newFiles.map(file => URL.createObjectURL(file));
    setPhotoPreviews(previews);
    setErrorMsg(null);
  };

  const removePhoto = (idx: number) => {
    const updatedFiles = photoFiles.filter((_, i) => i !== idx);
    setPhotoFiles(updatedFiles);
    setPhotoPreviews(updatedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!user) {
      setErrorMsg('Please sign in to write a review.');
      return;
    }

    if (!title.trim() || !body.trim()) {
      setErrorMsg('Please provide both a review headline and detailed experience.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload photos (compressed client side to < 1MB)
      const uploadedUrls: string[] = [];
      for (const file of photoFiles) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      // Store review (starts as 'pending' for moderation)
      wayfarerStore.createReview({
        targetType,
        targetId,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        rating,
        title: title.trim(),
        body: body.trim(),
        photos: uploadedUrls,
        visitDate
      });

      setSuccessMsg('Thank you! Your review has been submitted for moderation and will appear once approved by an admin.');
      if (onReviewSubmitted) onReviewSubmitted();

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-wayfarer-lg border border-[#EDE9FE] p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B6385] hover:text-[#1F1637] p-1.5 rounded-full hover:bg-[#F5F3FF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#6D28D9]">Write a Review</p>
          <h2 className="text-xl font-bold text-[#1F1637] font-heading mt-1">{targetName}</h2>
          <p className="text-xs text-[#6B6385] mt-0.5">
            Share authentic tips, photos, and ratings to guide fellow travelers.
          </p>
        </div>

        {!user ? (
          <div className="p-6 bg-[#F5F3FF] rounded-xl border border-[#EDE9FE] text-center space-y-3">
            <p className="text-sm text-[#1F1637] font-medium">Please sign in to write a review</p>
            <p className="text-xs text-[#6B6385]">Wayfarer verifies authentic contributions to prevent fake reviews.</p>
            <button
              onClick={() => loginAsDemoUser(false)}
              className="px-5 py-2.5 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors shadow-sm"
            >
              Sign In to Continue
            </button>
          </div>
        ) : successMsg ? (
          <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto" />
            <h3 className="text-base font-bold text-[#1F1637]">Review Submitted!</h3>
            <p className="text-xs text-[#6B6385] leading-relaxed">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-[#DC2626] rounded-xl text-xs border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1.5">
                Overall Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= (hoverRating || rating)
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-medium text-[#6B6385]">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1">
                Review Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience (e.g. Best sunset view in town)"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#EDE9FE] focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9]"
                required
              />
            </div>

            {/* Visit Date */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1">
                Date of Visit
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#EDE9FE] focus:outline-none focus:border-[#6D28D9]"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1">
                Your Review
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What made this place memorable? Any practical advice for fellow travelers on timing, crowds, or transport?"
                rows={4}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#EDE9FE] focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9]"
                required
              />
            </div>

            {/* Photos (up to 4 with client compression) */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1637] mb-1">
                Add Photos (Max 4, auto-compressed to &lt; 1MB)
              </label>
              
              <div className="grid grid-cols-4 gap-2 mb-2">
                {photoPreviews.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#EDE9FE] group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {photoFiles.length < 4 && (
                  <label className="aspect-square border-2 border-dashed border-[#EDE9FE] hover:border-[#6D28D9] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center p-2">
                    <Upload className="w-4 h-4 text-[#6D28D9] mb-1" />
                    <span className="text-[10px] text-[#6B6385]">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                      multiple
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Moderation Notice */}
            <p className="text-[11px] text-[#6B6385] bg-[#F5F3FF] p-2.5 rounded-xl border border-[#EDE9FE]">
              Note: Every review is verified through admin moderation before going live.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#6B6385] hover:text-[#1F1637]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? 'Uploading & Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
