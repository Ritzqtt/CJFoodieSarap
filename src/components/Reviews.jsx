import { CONTACT, REVIEWS } from '../data'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

export default function Reviews() {
  return (
    <section id="reviews" className="bg-cream-2 py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="Reviews" title="Happy Kafoodies">
            Feedback from our Facebook community. The three quotes below are placeholders — replace
            them with real reviews anytime.
          </SectionHeading>
        </div>

        <div
          className="reveal mx-auto mb-8 flex max-w-[580px] flex-wrap items-center gap-x-4 gap-y-3 rounded-[22px] border-2 border-forest/15 bg-white px-5 py-4 shadow-[0_8px_0_rgba(31,77,26,.06)]"
          aria-label={`${CONTACT.rating} percent recommend on Facebook, based on ${CONTACT.reviewCount} reviews`}
        >
          <span className="font-display text-[3.2rem] leading-[.8] tracking-[.02em] text-forest" aria-hidden="true">
            {CONTACT.rating}
          </span>
          <span className="min-w-[170px] flex-1">
            <strong className="block text-[.9rem] leading-tight text-forest">
              recommend CJFoodieSarap on Facebook
            </strong>
            <span className="block text-[.72rem] font-medium text-muted">
              Based on {CONTACT.reviewCount} Facebook reviews
            </span>
          </span>
          <a
            className="ml-auto inline-flex items-center gap-1.5 text-[.7rem] font-bold text-forest no-underline hover:text-orange-deep"
            href={CONTACT.facebookReviews}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="facebook" className="h-5 w-5" /> See reviews
          </a>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <article
              key={review.tag}
              className="reveal rounded-[20px] border-2 border-dashed border-forest/30 bg-paper p-4"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <span className="mb-2 inline-block rounded-full bg-gold-soft px-2 py-0.5 text-[.52rem] font-extrabold tracking-[.11em] text-[#6b4300] uppercase">
                {review.tag}
              </span>
              <p className="mb-3 text-[.82rem] leading-relaxed text-[#4a4337] italic">{review.quote}</p>
              <p className="flex items-center gap-2">
                <span
                  className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-leaf text-[.65rem] font-extrabold text-forest"
                  aria-hidden="true"
                >
                  CN
                </span>
                <span>
                  <strong className="block text-[.76rem] leading-tight text-forest">{review.name}</strong>
                  <span className="block text-[.62rem] text-muted">{review.meta}</span>
                </span>
              </p>
            </article>
          ))}
        </div>

        <div className="reveal mt-6 text-center">
          <a
            className="btn btn-forest"
            href={CONTACT.facebookReviews}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="star" /> Read all reviews on Facebook
          </a>
        </div>
      </div>
    </section>
  )
}
