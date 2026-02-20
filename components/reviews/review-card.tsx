import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Review } from "@/hooks/use-reviews";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border/40 hover:border-border/80 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          {/* Random avatar mostly for visual demo if no image provided */}
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`}
            alt={review.userName}
          />
          <AvatarFallback>
            {review.userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h4 className="font-semibold text-base text-foreground">
            {review.userName}
          </h4>
          <span className="text-sm text-muted-foreground">
            {review.userLocation || review.monthsOnPlatform}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"}`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {review.date}
        </span>
      </div>

      <p className="text-[#222222] leading-relaxed line-clamp-4">
        {review.comment}
      </p>

      {/* "Show more" logic could be added here if comments are very long */}
      {review.comment.length > 150 && (
        <button className="text-sm font-semibold underline text-foreground self-start hover:text-primary transition-colors">
          Mostrar más
        </button>
      )}
    </div>
  );
}
