import { useEffect, useState } from 'react'
import { BRAND, CONTACT, NAV_LINKS, messengerUrl } from '../data'

const BOOK_MESSAGE =
  "Hi! I'd like to book a handaan order. Can you help me choose a package?"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-forest/15 bg-cream/95 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-[0_8px_24px_rgba(31,77,26,0.12)]' : ''
      }`}
    >
      <div className="wrap flex min-h-[70px] items-center justify-between gap-3">
        <a href="#home" className="flex min-w-0 items-center gap-2.5 no-underline" aria-label="CJFoodieSarap — back to top">
          <img
            src={BRAND.logo}
            alt={`${BRAND.name} logo`}
            width={44}
            height={44}
            loading="eager"
            decoding="async"
            className="h-11 w-11 shrink-0 rounded-full object-cover shadow-[0_3px_0_rgba(18,51,15,.25)]"
          />
          <span>
            <span className="block font-display text-[clamp(1.28rem,3vw,1.55rem)] leading-[.85] tracking-[.035em] whitespace-nowrap text-forest">
              {BRAND.name}
            </span>
            <span className="mt-1 hidden text-[.56rem] font-bold tracking-[.17em] whitespace-nowrap text-muted uppercase min-[400px]:block">
              Taguig · Since {BRAND.since}
            </span>
          </span>
        </a>

        <nav className="hidden lg:block" aria-label="Main navigation">
          <ul className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-block rounded-full px-2.5 py-2 text-[.84rem] font-semibold whitespace-nowrap text-forest no-underline transition hover:bg-forest/10"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <a
            className="btn btn-primary hidden min-h-[42px] px-3.5 py-2 text-[.8rem] lg:inline-flex"
            href={messengerUrl(BOOK_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Now
          </a>
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] border-2 border-forest/15 bg-white text-forest lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="grid w-5 gap-1" aria-hidden="true">
              <span
                className={`block h-0.5 rounded bg-current transition-transform ${
                  open ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span className={`block h-0.5 rounded bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span
                className={`block h-0.5 rounded bg-current transition-transform ${
                  open ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="absolute inset-x-0 top-full z-50 border-b border-forest/15 bg-cream px-4 pt-3 pb-4 shadow-[0_18px_30px_rgba(31,77,26,0.16)] lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="grid gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 font-semibold text-forest no-underline hover:bg-forest/10"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <a
              className="btn btn-forest btn-sm"
              href={messengerUrl(BOOK_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Now
            </a>
            <a className="btn btn-outline btn-sm" href={`tel:${CONTACT.phoneTel}`}>
              Call Us
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
