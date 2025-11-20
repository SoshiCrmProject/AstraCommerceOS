import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";

type TestimonialsSectionProps = {
  testimonials: MarketingDictionary["testimonials"];
};

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section
      className="section-shell bg-section"
      id="case-studies"
      aria-labelledby="testimonials-title"
    >
      <div className="container-shell space-y-8">
        <div className="max-w-3xl space-y-3">
          <h2
            id="testimonials-title"
            className="text-3xl font-semibold text-primary sm:text-4xl"
          >
            {testimonials.title}
          </h2>
          <p className="text-lg text-secondary">{testimonials.subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.items.map((item) => (
            <article
              key={item.name}
              className="flex flex-col gap-4 rounded-card border border-default bg-surface p-5 shadow-soft"
            >
              <div className="flex items-center gap-2">
                {Array.from({ length: item.rating }).map((_, idx) => (
                  <svg
                    key={`${item.name}-star-${idx}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-accent-warning"
                    aria-hidden
                  >
                    <path d="M12 3.5 14.8 9l5.7.5-4.3 3.8 1.3 5.6L12 15.8l-5.5 3.1 1.3-5.6-4.3-3.8 5.7-.5z" />
                  </svg>
                ))}
              </div>
              <p className="text-base leading-7 text-primary">“{item.quote}”</p>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-primary-soft text-sm font-semibold text-accent-primary">
                  {item.name
                    .split(" ")
                    .map((piece) => piece[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex flex-col leading-tight">
                  <p className="font-semibold text-primary">{item.name}</p>
                  <p className="text-sm text-secondary">
                    {item.role} · {item.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
