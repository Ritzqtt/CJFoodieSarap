import { BILAOS, bilaoInquiryUrl, formatPeso } from '../data'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

export default function BilaoPackages() {
  return (
    <section id="bilao" className="section-forest relative overflow-hidden bg-forest py-14 text-cream sm:py-20">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />

      <div className="wrap relative">
        <div className="reveal">
          <SectionHeading eyebrow="Bilao Packages" title="Bilao Sets" light>
            Bundled bilao favorites for small handaan, office snacks, and potluck. Serves 5–15 pax
            depending on the set — and Set 4 comes with free softdrinks too.
          </SectionHeading>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {BILAOS.map((set, index) => (
            <article
              key={set.id}
              className="reveal flex flex-col overflow-hidden rounded-[26px] border border-forest/15 bg-paper text-ink shadow-[0_6px_0_rgba(31,77,26,.06)] transition duration-250 hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_16px_32px_rgba(0,0,0,.18)]"
              style={{ transitionDelay: `${(index % 2) * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-2 border-b border-forest/15 bg-[#fff9ee] px-4 pt-4 pb-3">
                <div>
                  <h3 className="font-display text-[1.5rem] leading-[.95] tracking-[.04em] text-forest">
                    Bilao Set {set.id}
                  </h3>
                  <span className="mt-1.5 inline-block rounded-full bg-leaf px-2.5 py-0.5 text-[.62rem] font-extrabold tracking-[.04em] text-forest">
                    {set.pax}
                  </span>
                </div>
                <p className="font-display text-[1.85rem] leading-[.9] tracking-[.02em] whitespace-nowrap text-orange-deep">
                  {formatPeso(set.price)}
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-2.5 px-4 pt-3.5 pb-4">
                <ul className="grid gap-1.5">
                  {set.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[.8rem] leading-snug text-[#3e382c]">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-forest-mid [stroke-width:2.4]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {set.drinks && (
                  <p className="flex items-center gap-2 rounded-[11px] border-[1.5px] border-dashed border-[#c98a12] bg-[#fff3d6] px-2.5 py-1.5 text-[.68rem] leading-tight text-[#6b4300]">
                    <Icon name="cup" className="h-[19px] w-[19px] shrink-0 text-[#a96608]" />
                    <span>
                      <strong className="font-extrabold">FREE 1.5L softdrinks</strong> included
                    </span>
                  </p>
                )}

                <a
                  className="btn btn-forest mt-auto min-h-11 w-full px-3 text-[.82rem]"
                  href={bilaoInquiryUrl(set)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="messenger" /> Inquire about this set
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="reveal mx-auto mt-8 max-w-3xl text-center text-[.8rem] text-[#dce7cf]">
          Want a different bilao combination?{' '}
          <a href="#inquire" className="font-bold text-gold underline decoration-gold/50 underline-offset-2">
            Message us
          </a>{' '}
          — we can mix and match.
        </p>
      </div>
    </section>
  )
}
