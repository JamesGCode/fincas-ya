"use client";

import { useReviews } from "@/hooks/use-reviews";
import { ReviewCard } from "./review-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ReviewsListProps {
  fincaId: string;
}

export function ReviewsList({ fincaId }: ReviewsListProps) {
  const { reviews } = useReviews(fincaId);
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No hay reseñas aún. ¡Sé el primero en compartir tu experiencia!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-8"
          >
            Mostrar más reseñas
          </Button>
        </div>
      )}
    </div>
  );
}
