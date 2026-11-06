import { useState } from 'react'
import { BRAND, HERO_TILES, messengerUrl } from '../data'
import { Icon } from './Icons'

const BOOK_MESSAGE =
  "Hello po! I'd like to book an order."

const HERO_PHOTO_ALT =
  'CJFoodieSarap handaan spread with party trays of beef, lumpia, lechon, rice, and vegetables'

export default function Hero() {
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <section id="home" className="relative overflow-hidden bg-cream pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-16 lg:pb-16">
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-35 [mask-image:linear-gradient(to_bottom,#000,transparent_72%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-28 -right-28 h-80 w-80 rounded-full bg-gold/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-forest/10 blur-3xl" aria-hidden="true" />

      <div className="wrap relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.03fr_.97fr] lg:gap-12">
          <div className="reveal">
            <div className="mb-4 inline-flex items-center gap-2.5">
              <img
                src={BRAND.logo}
                alt={`${BRAND.name} logo`}
                width={54}
                height={54}
                loading="eager"
                decoding="async"
                className="h-[54px] w-[54px] shrink-0 rounded-full object-cover shadow-[4px_4px_0_rgba(31,77,26,.12)]"
              />
              <span>
                <span className="block font-display text-[clamp(1.7rem,4vw,2.1rem)] leading-[.9] tracking-[.04em] text-forest">
                  {BRAND.name}
                </span>
                <span className="mt-1 block text-[.64rem] font-bold tracking-[.14em] text-muted uppercase">
                  Party catering · Taguig
                </span>
              </span>
            </div>

            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-3 py-1.5 text-[.68rem] font-bold tracking-[.07em] text-forest uppercase shadow-[0_3px_0_rgba(31,77,26,.06)]">
              <span className="h-2 w-2 rounded-full bg-orange shadow-[0_0_0_4px_rgba(245,130,32,.18)]" aria-hidden="true" />
              Serving since {BRAND.since} · Taguig &amp; Makati
            </p>

            <h1 className="mb-4 font-display text-[clamp(3.1rem,10.5vw,5.6rem)] leading-[.88] tracking-[.015em] text-forest">
              <span className="block">Budget Friendly.</span>
              <span className="hero-highlight">Quality Taste.</span>
            </h1>

            <p className="mb-5 max-w-[57ch] text-[clamp(.96rem,1.7vw,1.08rem)] text-[#4a4337]">
              Party trays, bilao sets, and packed meals na lasang handaan — cooked fresh for birthdays,
              reunions, meetings, and every little celebration.{' '}
              <strong className="text-forest">We cook. We serve. You celebrate.</strong>
            </p>

            <div className="mb-4 flex flex-wrap gap-2.5">
              <a
                className="btn btn-primary"
                href={messengerUrl(BOOK_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="messenger" /> Book Now
              </a>
              <a className="btn btn-outline" href="#menu">
                View Menu <Icon name="arrow" />
              </a>
            </div>

            <p className="mb-4 inline-flex items-center gap-2.5 rounded-[14px] border-2 border-dashed border-[#4c8b3f] bg-[#eaf6e4] px-3.5 py-2 text-[.79rem] leading-tight font-bold text-forest">
              <Icon name="truck" className="h-[22px] w-[22px] text-forest-mid" />
              <span>FREE DELIVERY in Makati &amp; Taguig</span>
            </p>

            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[.73rem] font-semibold text-muted">
              <li className="inline-flex items-center gap-1.5">
                <Icon name="cup" className="h-4 w-4 text-orange-deep" /> Free 1.5L softdrinks
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Icon name="heart" className="h-4 w-4 text-orange-deep" /> Delicious food, made fresh
              </li>
            </ul>
          </div>

          <div className="reveal relative mx-auto w-full max-w-[470px]" style={{ transitionDelay: '120ms' }}>
            <div
              className={`photo-ph relative aspect-[5/4] lg:aspect-[1/.92] ${
                photoFailed ? '' : '[&::before]:hidden'
              }`}
            >
              {photoFailed ? (
                <div
                  className="grid h-full place-content-center gap-1 p-6 text-center text-[#46543a]"
                  role="img"
                  aria-label="Placeholder for a photo of a CJFoodieSarap party tray spread"
                >
                  <span className="absolute top-3.5 left-3.5 rounded-full bg-forest px-2.5 py-1 text-[.55rem] font-extrabold tracking-[.13em] text-cream uppercase">
                    Photo placeholder
                  </span>
                  <Icon name="cloche" className="mx-auto mb-1 h-[76px] w-[76px] text-forest opacity-65" />
                  <span className="relative text-[.95rem] font-bold">Your handaan spread here</span>
                  <span className="relative text-[.68rem] tracking-[.04em] text-[#5e5a48]">
                    Swap in a real food photo · 1200 × 900px
                  </span>
                </div>
              ) : (
                <img
                  src={BRAND.heroPhoto}
                  alt={HERO_PHOTO_ALT}
                  onError={() => setPhotoFailed(true)}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>

            <div className="absolute -bottom-3 -left-1 flex max-w-[165px] -rotate-2 items-center gap-2 rounded-[14px] bg-white px-3 py-2 text-[.68rem] leading-tight font-bold text-forest shadow-[0_10px_24px_rgba(31,77,26,.2)] max-[400px]:max-w-[145px] max-[400px]:text-[.62rem]" aria-hidden="true">
              <Icon name="tray" className="h-5 w-5 text-orange-deep" />
              <span>Party trays start from ₱3,000</span>
            </div>
          </div>
        </div>

        <div className="reveal mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-3" style={{ transitionDelay: '200ms' }}>
          {HERO_TILES.map((tile) => (
            <a
              key={tile.href}
              href={tile.href}
              className="flex flex-col items-center gap-1.5 rounded-[20px] border-2 border-forest/15 bg-white px-1.5 py-3.5 text-center text-[.77rem] leading-tight font-bold text-forest no-underline shadow-[0_4px_0_rgba(31,77,26,.08)] transition hover:-translate-y-1 hover:border-orange/55 hover:shadow-[0_10px_20px_rgba(31,77,26,.12)] sm:flex-row sm:justify-start sm:gap-3 sm:px-4 sm:py-4 sm:text-left sm:text-[.9rem]"
            >
              <Icon name={tile.icon} className="h-8 w-8 shrink-0 text-orange-deep sm:h-10 sm:w-10" />
              <span>
                {tile.label}
                <span className="mt-0.5 block text-[.62rem] font-semibold tracking-[.02em] text-muted">
                  {tile.sub}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
