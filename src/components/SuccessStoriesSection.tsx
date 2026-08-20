import { Star } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/visaData';

export function SuccessStoriesSection() {
  return (
    <section id="success" className="bg-[#fffdd0] px-6 py-20 md:px-12 md:py-28 border-t border-[#2d2d2d]/10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[#b8860b]">
              Client Review
            </span>
            <h2 className="font-serif text-4xl font-light leading-tight text-[#2d2d2d] sm:text-5xl md:text-6xl">
              REAL CLIENT EXPERIENCES
            </h2>
          </div>
          <p className="max-w-xl font-sans text-base font-light leading-relaxed text-[#4a3c31]/80 md:justify-self-end md:text-lg">
            Trusted by clients throughout their visa journey.
          </p>
        </div>

        <div className="divide-y divide-[#2d2d2d]/12 border-y border-[#2d2d2d]/12">
          {CUSTOMER_REVIEWS.map((review, index) => (
            <article
              key={review.id}
              className="grid gap-5 py-8 md:grid-cols-[14rem_1fr] md:gap-10 md:py-10"
            >
              <div className="flex items-start justify-between gap-4 md:block">
                <div>
                  <p className="font-serif text-lg font-semibold text-[#2d2d2d]">{review.name}</p>
                  <div className="mt-2 flex gap-1 text-[#b8860b]" aria-label={`${review.rating} star review`}>
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-[#2d2d2d]/35 md:mt-8 md:block">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="relative">
                <span className="absolute -left-1 -top-7 hidden font-serif text-7xl leading-none text-[#b8860b]/15 md:block">
                  &ldquo;
                </span>
                <p className="relative font-serif text-xl font-light leading-relaxed text-[#2d2d2d] md:text-2xl">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
