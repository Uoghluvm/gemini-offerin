import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16 }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating * 2) / 2; // Round to nearest 0.5

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <div key={starValue} className="relative">
             {/* Background star (empty) */}
            <Star size={size} className="text-gray-300" fill="currentColor" />
            {/* Filled portion of the star */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{
                width:
                  starValue <= filledStars
                    ? '100%'
                    : starValue - 0.5 === filledStars
                    ? '50%'
                    : '0%',
              }}
            >
              <Star size={size} className="text-yellow-400" fill="currentColor" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
