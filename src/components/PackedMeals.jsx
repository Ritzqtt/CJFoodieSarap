import { PACKED_MEALS, formatPeso, messengerUrl } from '../data'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

const MEAL_MESSAGE =
  "Hello po! I'd like to order food packed meals."

export default function PackedMeals() {
  return (
    <section id="packed-meals" className="bg-cream-2 py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="Food Packed Meals" title="Packed with Love">
            Great for meetings, seminars, and giveaways. Complete meals, packed and ready to hand out
            — walang hassle, sarap pa rin.
          </SectionHeading>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PACKED_MEALS.map((group, index) => (
            <article
              key={group.group}
              className="reveal overflow-hidden rounded-[22px] border border-forest/15 bg-paper shadow-[0_6px_0_rgba(31,77,26,.06)]"
              style={{ transitionDelay: `${(index % 2) * 70}ms` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-[linear-gradient(135deg,#1F4D1A,#2C6524)] px-4 py-3">
                <h3 className="font-display text-[1.4rem] leading-none tracking-[.04em] text-white">
                  {group.title}
                </h3>
                <span className="text-[.58rem] font-extrabold tracking-[.13em] text-gold uppercase">
                  Group {group.group} · {group.items.length} options
                </span>
              </div>

              <div>
                {group.items.map((meal) => (
                  <div
                    key={meal.code}
                    className="flex items-center gap-2.5 border-t border-forest/10 px-4 py-2.5 transition first:border-t-0 hover:bg-[#fcf7ec]"
                  >
                    <span className="grid h-[29px] w-10 shrink-0 place-items-center rounded-lg bg-leaf text-[.7rem] font-extrabold tracking-[.04em] text-forest">
                      {meal.code}
                    </span>
                    <span className="flex-1 text-[.8rem] leading-snug text-[#3e382c]">{meal.desc}</span>
                    <span className="shrink-0 font-display text-[1.2rem] leading-none tracking-[.03em] text-forest">
                      {formatPeso(meal.price)}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-3 text-center">
          <p className="text-[.82rem] text-muted">Need a bulk order or a custom packed meal?</p>
          <a
            className="btn btn-primary"
            href={messengerUrl(MEAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="box" /> Inquire about packed meals
          </a>
        </div>
      </div>
    </section>
  )
}
