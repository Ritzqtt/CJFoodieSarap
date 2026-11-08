import { BRAND, CONTACT, NAV_LINKS, SOCIALS } from '../data'
import { Icon } from './Icons'

const MAPS_URL =
  'https://maps.app.goo.gl/X7co2riLjvmZzmCJ8'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-deep pt-11 pb-6 text-[#dce7cf]">
      <div className="footer-dot-bg pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />

      <div className="wrap relative">
        <div className="flex flex-col items-center gap-7 text-center lg:grid lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:items-start lg:gap-8 lg:text-left">
          <div>
            <a href="#home" className="inline-flex items-center gap-2.5 no-underline" aria-label="CJFoodieSarap — back to top">
              <img
                src={BRAND.logo}
                alt={`${BRAND.name} logo`}
                width={44}
                height={44}
                loading="eager"
                decoding="async"
                className="h-11 w-11 rounded-full object-cover shadow-[0_3px_0_rgba(0,0,0,.25)]"
              />
              <span>
                <span className="block font-display text-[1.45rem] leading-[.85] tracking-[.04em] text-white">
                  {BRAND.name}
                </span>
                <span className="mt-1 block text-[.56rem] font-bold tracking-[.17em] text-[#afc4a0] uppercase">
                  Taguig · Since {BRAND.since}
                </span>
              </span>
            </a>
            <p className="mt-4 mb-1 font-display text-[1.6rem] leading-none tracking-[.03em] text-gold">
              Good Food Brings People Together.
            </p>
            <p className="mx-auto max-w-[34ch] text-center text-[.78rem] leading-relaxed text-[#b9cba9] lg:mx-0 lg:text-left">
              Delicious food, made fresh. Budget-friendly party trays, bilao sets, and packed meals
              for every celebration.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="Social media">
              {SOCIALS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={`${BRAND.name} on ${social.label}${social.handle ? `, ${social.handle}` : ''}`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 bg-cream/5 text-cream transition hover:-translate-y-0.5 hover:bg-gold hover:text-forest-deep"
                >
                  <Icon name={social.id} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <h3 className="mb-2.5 text-[.62rem] font-extrabold tracking-[.16em] text-gold uppercase">
              Quick Links
            </h3>
            <nav className="grid gap-1" aria-label="Footer navigation">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-[.78rem] text-[#dce7cf] no-underline hover:text-gold hover:underline">
                  {link.label}
                </a>
              ))}
              <a href="#inquire" className="text-[.78rem] text-[#dce7cf] no-underline hover:text-gold hover:underline">
                Send an Inquiry
              </a>
            </nav>
          </div>

          <div className="hidden lg:block">
            <h3 className="mb-2.5 text-[.62rem] font-extrabold tracking-[.16em] text-gold uppercase">
              Popular
            </h3>
            <nav className="grid gap-1" aria-label="Popular items">
              <a href="#packages" className="text-[.78rem] text-[#dce7cf] no-underline hover:text-gold hover:underline">
                Package 1 · ₱3,000
              </a>
              <a href="#packages" className="text-[.78rem] text-[#dce7cf] no-underline hover:text-gold hover:underline">
                Package 4 · ₱4,500
              </a>
              <a href="#bilao" className="text-[.78rem] text-[#dce7cf] no-underline hover:text-gold hover:underline">
                Bilao Set 2 · ₱2,000
              </a>
              <a href="#menu" className="text-[.78rem] text-[#dce7cf] no-underline hover:text-gold hover:underline">
                Pork &amp; Chicken Trays
              </a>
              <a href="#menu" className="text-[.78rem] text-[#dce7cf] no-underline hover:text-gold hover:underline">
                Pasta &amp; Pansit Trays
              </a>
              <a href="#packed-meals" className="text-[.78rem] text-[#dce7cf] no-underline hover:text-gold hover:underline">
                Packed Meals from ₱50
              </a>
            </nav>
          </div>

          <div>
            <h3 className="mb-2.5 text-center text-[.62rem] font-extrabold tracking-[.16em] text-gold uppercase lg:text-left">
              Get in Touch
            </h3>
            <div className="grid gap-1.5">
            <span className="flex items-start gap-2 text-[.78rem] text-[#dce7cf]">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="hover:text-gold md:pointer-events-none md:no-underline"
              >
                {CONTACT.phoneDisplay}
              </a>
            </span>
              <a
                href={`mailto:${CONTACT.email}`}
                onClick={(event) => {
                  event.preventDefault()

                  const isMobile = /Android|iPhone|iPad|iPod/i.test(
                    navigator.userAgent
                  )

                  if (isMobile) {
                    window.location.href = `mailto:${CONTACT.email}`
                  } else {
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}`

                    const accountChooserUrl =
                      `https://accounts.google.com/AccountChooser?service=mail&continue=${encodeURIComponent(gmailUrl)}`

                    window.open(
                      accountChooserUrl,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                }}
                className="flex items-start gap-2 text-[.78rem] break-all text-[#dce7cf] no-underline hover:text-gold"
              >
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {CONTACT.email}
              </a>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-[.78rem] text-[#dce7cf] no-underline hover:text-gold">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {CONTACT.address}
              </a>
              <span className="flex items-start gap-2 text-[.78rem] text-[#dce7cf]">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Hours: {CONTACT.hours}
              </span>
              <span className="flex items-start gap-2 text-[.78rem] text-[#dce7cf]">
                <Icon name="truck" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> FREE delivery in Makati &amp; Taguig
              </span>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-cream/15 pt-4 text-[.68rem] text-[#a9be9a]">
          <p>
            © 2026 <strong className="text-cream">{BRAND.name}</strong>. All rights reserved.
          </p>
          <p>Budget Friendly. Quality Taste. · Let&apos;s go, Kafoodies!</p>
        </div>
      </div>
    </footer>
  )
}
