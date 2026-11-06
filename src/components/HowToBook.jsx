import { STEPS } from '../data'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

export default function HowToBook() {
  return (
    <section id="how-to-book" className="bg-cream py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="How to Book" title="Four Easy Steps">
            From &quot;what&apos;s for handaan?&quot; to &quot;kain na!&quot; — here&apos;s how we
            get your order ready.
          </SectionHeading>
        </div>

        <ol className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="reveal relative"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div
                tabIndex={0}
                className="group relative h-full overflow-hidden rounded-[22px] border border-forest/15 bg-paper px-4 py-4 shadow-[0_5px_0_rgba(31,77,26,.05)] transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:border-orange focus-within:border-orange hover:shadow-[0_18px_34px_rgba(31,77,26,.18)] focus-within:shadow-[0_18px_34px_rgba(31,77,26,.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-safe:hover:-translate-y-1.5 motion-safe:focus-within:-translate-y-1.5"
              >
                <span
                  className="pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full bg-gold/15"
                  aria-hidden="true"
                />
                <span className="relative mb-2.5 grid h-11 w-11 place-items-center rounded-full bg-forest font-display text-[1.5rem] leading-none tracking-[.03em] text-gold shadow-[3px_3px_0_#f9b233] transition-colors duration-[250ms] ease-out group-hover:bg-orange-deep group-focus-within:bg-orange-deep">
                  {index + 1}
                </span>
                <h3 className="relative mb-1 text-[.95rem] leading-snug font-bold text-forest">{step.title}</h3>
                <p className="relative text-[.79rem] leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="reveal mx-auto mt-6 flex max-w-[820px] items-start gap-3 rounded-2xl border border-[#b9d9ae] border-l-[6px] border-l-orange bg-[#eaf6e4] px-4 py-4">
          <Icon name="truck" className="mt-0.5 h-7 w-7 shrink-0 text-forest-mid" />
          <p className="text-[.82rem] leading-relaxed text-[#2f4a25]">
            <strong className="text-forest">FREE DELIVERY in Makati &amp; Taguig.</strong> Outside
            these areas? Message us and we&apos;ll check if we can deliver to you — a delivery fee may
            apply.
          </p>
        </div>
      </div>
    </section>
  )
}
