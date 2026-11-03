import { CONTACT, GALLERY } from '../data'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

export default function Gallery() {
  return (
    <section id="gallery" className="bg-cream py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="Gallery" title="Sarap in Photos">
            A peek at the handaan we&apos;ve served. These tiles are ready for real food photos — swap
            them in anytime.
          </SectionHeading>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GALLERY.map((photo, index) => {
            const isFeatured = index === 0
            const isWide = index === 5
            return (
              <div
                key={photo.label}
                role="img"
                aria-label={`Photo placeholder: ${photo.label}`}
                className={`gallery-ph reveal grid aspect-square place-content-center gap-1.5 px-3 py-4 text-center text-[#46543a] ${
                  isFeatured ? 'col-span-2 aspect-[2/1] sm:col-span-2 sm:row-span-2 sm:aspect-auto' : ''
                } ${isWide ? 'sm:col-span-2 sm:aspect-[2/1]' : ''}`}
                style={{ transitionDelay: `${(index % 4) * 50}ms` }}
              >
                <span className="absolute top-2 right-2 rounded-full bg-forest/90 px-2 py-0.5 text-[.48rem] font-extrabold tracking-[.1em] text-cream uppercase">
                  Photo
                </span>
                <Icon
                  name={photo.icon}
                  className={`mx-auto text-forest opacity-60 ${isFeatured ? 'h-12 w-12' : 'h-8 w-8'}`}
                />
                <strong className="relative text-[.78rem] leading-tight">{photo.label}</strong>
                <small className="relative text-[.6rem] tracking-[.06em] text-[#6a6450] uppercase">
                  {photo.note}
                </small>
              </div>
            )
          })}
        </div>

        <div className="reveal mt-6 text-center">
          <a
            className="btn btn-outline"
            href={CONTACT.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="facebook" /> See more on Facebook
          </a>
        </div>
      </div>
    </section>
  )
}
