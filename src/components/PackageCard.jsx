import { formatPeso, packageInquiryUrl } from '../data'
import { Icon } from './Icons'

export default function PackageCard({ pkg, delay = 0 }) {
  return (
    <article
      className="reveal flex flex-col overflow-hidden rounded-[26px] border border-forest/15 bg-paper shadow-[0_6px_0_rgba(31,77,26,.06)] transition duration-250 hover:-translate-y-1 hover:border-orange/55 hover:shadow-[0_16px_32px_rgba(31,77,26,.15)]"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative flex items-start justify-between gap-2 overflow-hidden bg-[linear-gradient(135deg,#1F4D1A,#2C6524)] px-4 pt-3.5 pb-3">
        <div
          className="pointer-events-none absolute -top-10 -right-4 h-28 w-28 rounded-full bg-gold/25 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="mb-0.5 text-[.55rem] font-extrabold tracking-[.16em] text-gold uppercase">
            Party tray set
          </p>
          <h3 className="font-display text-[1.5rem] leading-[.95] tracking-[.04em] text-white min-[1180px]:text-[1.5rem]">
            Package {pkg.id}
          </h3>
        </div>
        <p className="relative font-display text-[1.8rem] leading-[.9] tracking-[.02em] whitespace-nowrap text-gold">
          {formatPeso(pkg.price)}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 pt-3.5 pb-4">
        <ul className="grid gap-1.5">
          {pkg.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[.76rem] leading-snug text-[#3e382c]">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-forest-mid [stroke-width:2.4]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-auto flex items-center gap-2 rounded-[11px] border-[1.5px] border-dashed border-[#c98a12] bg-[#fff3d6] px-2.5 py-1.5 text-[.65rem] leading-tight text-[#6b4300] min-[1180px]:text-[.66rem]">
          <Icon name="cup" className="h-[19px] w-[19px] shrink-0 text-[#a96608]" />
          <span>
            <strong className="font-extrabold">FREE 1.5L softdrinks</strong> included
          </span>
        </p>

        <a
          className="btn btn-primary mt-1 min-h-11 w-full px-2 text-[.8rem]"
          href={packageInquiryUrl(pkg)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="messenger" /> Book this package
        </a>
      </div>
    </article>
  )
}
