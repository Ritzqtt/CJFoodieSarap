import { CONTACT, SOCIALS } from '../data'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Post+Proper+Southside+Taguig+1648'

export default function Contact() {
  return (
    <section id="contact" className="bg-cream py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="Contact & Location" title="Tara, Usap Tayo">
            Message us anytime — we&apos;re happy to help you plan. We&apos;re based in Taguig and
            deliver free around Makati and Taguig.
          </SectionHeading>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div className="reveal rounded-[26px] border border-forest/15 bg-paper p-4 shadow-[0_6px_0_rgba(31,77,26,.05)] sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display text-[1.5rem] tracking-[.04em] text-forest">
              <Icon name="phone" className="h-[22px] w-[22px] text-orange-deep" /> Reach Us
            </h3>

            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="group flex items-start gap-2.5 border-t border-dashed border-forest/15 py-2.5 first:border-t-0 first:pt-0"
            >
              <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[11px] bg-leaf text-forest" aria-hidden="true">
                <Icon name="phone" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[.58rem] font-extrabold tracking-[.11em] text-muted uppercase">
                  Phone · Viber · WhatsApp
                </span>
                <span className="block text-[.88rem] leading-snug font-bold text-forest group-hover:text-orange-deep">
                  {CONTACT.phoneDisplay}
                </span>
                <span className="block text-[.64rem] font-medium text-muted">Tap to call</span>
              </span>
            </a>

            <a
              href={`mailto:${CONTACT.email}`}
              className="group flex items-start gap-2.5 border-t border-dashed border-forest/15 py-2.5"
            >
              <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[11px] bg-leaf text-forest" aria-hidden="true">
                <Icon name="mail" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[.58rem] font-extrabold tracking-[.11em] text-muted uppercase">
                  Email
                </span>
                <span className="block text-[.88rem] leading-snug font-bold break-all text-forest group-hover:text-orange-deep">
                  {CONTACT.email}
                </span>
                <span className="block text-[.64rem] font-medium text-muted">
                  Send your inquiry or requirements
                </span>
              </span>
            </a>

            <div className="flex items-start gap-2.5 border-t border-dashed border-forest/15 py-2.5">
              <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[11px] bg-leaf text-forest" aria-hidden="true">
                <Icon name="pin" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[.58rem] font-extrabold tracking-[.11em] text-muted uppercase">
                  Location
                </span>
                <span className="block text-[.88rem] leading-snug font-bold text-forest">{CONTACT.address}</span>
                <span className="block text-[.64rem] font-medium text-muted">{CONTACT.addressNote}</span>
              </span>
            </div>

            <div className="flex items-start gap-2.5 border-t border-dashed border-forest/15 py-2.5">
              <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[11px] bg-leaf text-forest" aria-hidden="true">
                <Icon name="clock" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[.58rem] font-extrabold tracking-[.11em] text-muted uppercase">
                  Hours
                </span>
                <span className="block text-[.88rem] leading-snug font-bold text-forest">{CONTACT.hours}</span>
                <span className="block text-[.64rem] font-medium text-muted">
                  Facebook lists us as &quot;Always open&quot; — please message ahead to confirm.
                </span>
              </span>
            </div>

            <p className="mt-2 inline-flex items-center gap-2 rounded-full border-[1.5px] border-dashed border-[#c98a12] bg-[#fff3d6] px-3 py-1.5 text-[.67rem] font-bold text-[#6b4300]">
              <Icon name="truck" className="h-4 w-4" /> Free delivery in Makati &amp; Taguig
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2" aria-label="Social media links">
              {SOCIALS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex min-h-[42px] items-center gap-2 rounded-[11px] border border-forest/15 bg-white px-2.5 py-1.5 text-[.7rem] font-semibold text-forest no-underline transition hover:-translate-y-px hover:border-orange/55 hover:bg-[#fff8ea]"
                >
                  <Icon name={social.id} className="h-[18px] w-[18px]" />
                  <span>
                    {social.label}
                    <small className="block text-[.56rem] leading-tight font-medium text-muted">
                      {social.handle}
                    </small>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="reveal lg:sticky lg:top-24" style={{ transitionDelay: '80ms' }}>
            {/* MAP EMBED: replace this block with your Google Maps iframe when ready. */}
            <div
              className="map-grid relative grid min-h-[300px] place-content-center gap-1 overflow-hidden rounded-[26px] border-2 border-dashed border-forest/30 px-4 py-6 text-center text-[#46543a]"
              aria-label="Map placeholder for CJFoodieSarap in Post Proper Southside, Taguig"
            >
              <span className="absolute top-2.5 left-2.5 rounded-full bg-forest/90 px-2 py-0.5 text-[.5rem] font-extrabold tracking-[.1em] text-cream uppercase">
                Map placeholder
              </span>
              <span className="mx-auto mb-1 grid h-[54px] w-[54px] place-items-center rounded-full bg-forest text-gold shadow-[0_0_0_8px_rgba(31,77,26,.13),0_10px_20px_rgba(31,77,26,.22)]" aria-hidden="true">
                <Icon name="pin" className="h-7 w-7" />
              </span>
              <strong className="text-[.9rem]">Google Map embed goes here</strong>
              <span className="text-[.72rem] text-[#5e5a48]">{CONTACT.address}</span>
              <a
                className="btn btn-outline btn-sm mx-auto mt-2"
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="pin" /> Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
