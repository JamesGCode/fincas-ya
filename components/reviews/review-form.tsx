"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useReviews } from "@/hooks/use-reviews";

interface ReviewFormProps {
  fincaId: string;
  onReviewAdded: () => void;
  onCancel: () => void;
}

export function ReviewForm({ fincaId, onReviewAdded }: ReviewFormProps) {
  const { addReview } = useReviews(fincaId);
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    addReview({
      fincaId,
      userName,
      userLocation,
      rating,
      comment,
    });

    onReviewAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            ¿Cómo calificarías tu experiencia?
          </h3>
          <p className="text-sm text-muted-foreground">
            Selecciona el número de estrellas
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-hidden transition-transform active:scale-95"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Cuéntanos un poco más</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-bold text-foreground/80"
            >
              Nombre
            </label>
            <Input
              id="name"
              placeholder="Tu nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="p-4 h-auto rounded-xl border-neutral-300 focus:border-black focus:ring-black"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-bold text-foreground/80"
            >
              Ubicación (Opcional)
            </label>
            <Input
              id="location"
              placeholder="Ej: Bogotá, Colombia"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="p-4 h-auto rounded-xl border-neutral-300 focus:border-black focus:ring-black"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-sm font-bold text-foreground/80"
            >
              Comentario
            </label>
            <Textarea
              id="comment"
              placeholder="Comparte tu experiencia con otros viajeros..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="min-h-[140px] p-4 rounded-xl border-neutral-300 focus:border-black focus:ring-black resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto font-semibold px-8 bg-black text-white hover:bg-black/90 rounded-lg"
          disabled={rating === 0 || !userName || !comment}
        >
          Enviar reseña
        </Button>
      </div>
    </form>
  );
}
