import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  score: number;
  hoverScore?: number;
  interactive?: boolean;
  onScoreChange?: (score: number) => void;
  onHoverChange?: (score: number) => void;
  className?: string;
}

export function StarRating({
  score,
  hoverScore = 0,
  interactive = false,
  onScoreChange,
  onHoverChange,
  className = "w-4 h-4",
}: StarRatingProps) {
  const displayScore = interactive && hoverScore > 0 ? hoverScore : score;

  return (
    <div
      className={`flex ${interactive ? "gap-2" : "gap-0"} text-[var(--color-gold)]`}
      onMouseLeave={() => interactive && onHoverChange?.(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = displayScore >= star;
        const isHalf = displayScore >= star - 0.5 && displayScore < star;

        const content = isHalf ? (
          <StarHalf
            className={`${className} transition-colors`}
            fill="var(--color-gold)"
            stroke="var(--color-gold)"
          />
        ) : (
          <Star
            className={`${className} transition-colors`}
            fill={isFull ? "var(--color-gold)" : "none"}
            stroke={isFull ? "var(--color-gold)" : "var(--color-zinc-700)"}
          />
        );

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-1 ring-[var(--color-gold)] rounded-sm"
              onClick={() => onScoreChange?.(displayScore)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const isLeftHalf = x < rect.width / 2;
                onHoverChange?.(isLeftHalf ? star - 0.5 : star);
              }}
            >
              {content}
            </button>
          );
        }

        return <div key={star}>{content}</div>;
      })}
    </div>
  );
}
