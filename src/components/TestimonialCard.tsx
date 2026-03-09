import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  location?: string;
  date?: string;
  rating: number;
  quote: string;
  product?: string;
}

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
      <blockquote className="text-foreground leading-relaxed mb-4">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div>
        <p className="font-semibold text-foreground text-sm">
          {testimonial.name}
          {testimonial.location && <span className="text-muted-foreground font-normal"> {testimonial.location}</span>}
          {testimonial.date && <span className="text-muted-foreground font-normal"> {testimonial.date}</span>}
        </p>
        {testimonial.product && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {testimonial.product}
          </p>
        )}
      </div>
    </div>
  );
}
