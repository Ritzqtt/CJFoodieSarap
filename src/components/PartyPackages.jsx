import { PACKAGES } from '../data'
import PackageCard from './PackageCard'
import SectionHeading from './SectionHeading'

export default function PartyPackages() {
  return (
    <section id="packages" className="bg-cream-2 py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="Party Trays" title="Handaan Packages">
            Eight ready-to-party sets packed with Filipino favorites. Every package comes with{' '}
            <strong className="text-forest">FREE 1.5L softdrinks</strong> — just pick your budget and
            we&apos;ll handle the rest.
          </SectionHeading>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3.5">
          {PACKAGES.map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} delay={(index % 4) * 55} />
          ))}
        </div>

        <p className="reveal mx-auto mt-8 max-w-3xl text-center text-[.8rem] text-muted">
          Planning something bigger or want to mix dishes?{' '}
          <a href="#inquire" className="font-bold text-forest underline decoration-gold decoration-2 underline-offset-2">
            Send us an inquiry
          </a>{' '}
          and we&apos;ll build a spread around your budget.
        </p>
      </div>
    </section>
  )
}
