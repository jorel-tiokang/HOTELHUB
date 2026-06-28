"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { submitReview } from "@/src/services/reviewService";
import type { ClientReservation } from "@/mocks/clientBookings";
import { useAuthStore } from "@/store/authStore";

interface ReviewModalProps {
  booking: ClientReservation;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ booking, onClose, onSuccess }: ReviewModalProps) {
  const t = useTranslations("clientDashboard"); // fallback translation context
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Veuillez attribuer une note (étoiles).");
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitReview({
        bookingRef: booking.id,
        hotelId: booking.hotelId,
        clientUserId: user.id,
        clientFullName: user.nom || "Client",
        rating,
        comment,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-charcoal rounded-3xl border border-foreground/10 shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-foreground/10 flex items-center justify-between">
          <h2 className="text-foreground font-bold text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
            Évaluer votre séjour
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="text-center">
            <p className="text-foreground/70 text-sm mb-1">{booking.hotelNom}</p>
            <p className="text-foreground font-semibold">
              Comment s'est passé votre séjour ?
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-gold text-gold"
                      : "text-foreground/20"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Optional Text Review */}
          <div className="flex flex-col gap-2">
            <label className="text-foreground/60 text-xs font-semibold uppercase tracking-wider">
              Votre avis (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={4}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground text-sm placeholder-foreground/30 focus:outline-none focus:border-gold/40 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl border border-foreground/15 text-foreground/60 hover:text-foreground text-sm font-semibold transition-all disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 py-3 rounded-xl bg-purple dark:bg-gold text-white dark:text-[#1c1714] font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Envoyer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
