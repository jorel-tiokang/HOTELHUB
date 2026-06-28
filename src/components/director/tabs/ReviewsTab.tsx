"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import type { BackendReviewDTO } from "@/services/api.types";
import type { Chambre } from "@/types/chambre";

interface ReviewsTabProps {
  t: (key: string) => string;
  reviews: BackendReviewDTO[];
  chambres: Chambre[];
  onReply: (reviewId: string, text: string) => Promise<void>;
}

export default function ReviewsTab({ t, reviews, chambres, onReply }: ReviewsTabProps) {
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewPeriod, setReviewPeriod] = useState("all");
  const [reponses, setReponses] = useState<Record<string, string>>({});

  const filteredReviews =
    reviewFilter === "all"
      ? reviews
      : reviews.filter((r) =>
          reviewFilter === "replied" ? r.director_reply !== undefined : r.director_reply === undefined
        );

  const handleSendReply = async (reviewId: string) => {
    const text = reponses[reviewId];
    if (!text || text.trim() === "") return;
    await onReply(reviewId, text);
    setReponses((prev) => ({ ...prev, [reviewId]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2 bg-charcoal rounded-xl p-1.5">
          {[
            { id: "all", label: t("reviews.filters.all") },
            { id: "pending", label: t("reviews.filters.pending") },
            { id: "replied", label: t("reviews.filters.replied") },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setReviewFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                reviewFilter === filter.id ? "bg-purple text-white" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <select
          value={reviewPeriod}
          onChange={(e) => setReviewPeriod(e.target.value)}
          className="bg-charcoal text-foreground/70 px-4 py-2 rounded-xl border border-foreground/10 text-sm focus:outline-none focus:border-purple"
        >
          <option value="all">{t("reviews.periods.all")}</option>
          <option value="week">{t("reviews.periods.week")}</option>
          <option value="month">{t("reviews.periods.month")}</option>
        </select>
        <select className="bg-charcoal text-foreground/70 px-4 py-2 rounded-xl border border-foreground/10 text-sm focus:outline-none focus:border-purple">
          <option value="">{t("reviews.rooms.all")}</option>
          {chambres.map((c) => (
            <option key={c.id} value={c.id}>
              {t("reviews.rooms.roomNumber")} {c.numero}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <p className="text-foreground/40 text-center py-12">Aucun avis trouvé.</p>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-charcoal rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                    {review.client_full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">{review.client_full_name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-gold fill-gold" : "text-foreground/20"}`} />
                        ))}
                      </div>
                      <span className="text-foreground/40 text-sm">
                        {new Date(review.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {review.comment && (
                <p className="text-foreground/80 mb-4">&quot;{review.comment}&quot;</p>
              )}

              {review.director_reply ? (
                <div className="ml-4 pl-4 border-l-2 border-purple bg-purple/5 rounded-r-xl p-4">
                  <p className="text-foreground/50 text-xs uppercase tracking-wider mb-2 font-semibold">
                    {t("reviews.yourReply")}
                  </p>
                  <p className="text-foreground/70">{review.director_reply}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder={t("reviews.replyPlaceholder")}
                    value={reponses[review.id] ?? ""}
                    onChange={(e) => setReponses({ ...reponses, [review.id]: e.target.value })}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder-foreground/30 text-sm focus:outline-none focus:border-purple transition-colors resize-none"
                  />
                  <button
                    onClick={() => handleSendReply(review.id)}
                    className="flex items-center gap-2 bg-purple hover:bg-purple/90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {t("reviews.sendReply")}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
