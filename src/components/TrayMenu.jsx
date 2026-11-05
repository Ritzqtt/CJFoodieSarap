import { useEffect, useRef, useState } from 'react'
import {
  MENU_CATEGORIES,
  PRICE_GROUPS,
  TRAY_SIZES,
  formatPeso,
  messengerUrl,
} from '../data'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

const ASK_MESSAGE =
  "Hello po! I'd like help building a tray order for my handaan. Here's what I have in mind:"

export default function TrayMenu() {
  const [activeId, setActiveId] = useState(MENU_CATEGORIES[0].id)
  const [sizeIndex, setSizeIndex] = useState(1)
  const [tabsScroll, setTabsScroll] = useState({ left: false, right: false })
  const tabRefs = useRef([])
  const tabsScrollerRef = useRef(null)

  useEffect(() => {
    const scroller = tabsScrollerRef.current
    if (!scroller) return undefined

    const updateEdges = () => {
      setTabsScroll({
        left: scroller.scrollLeft > 4,
        right: scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4,
      })
    }

    updateEdges()
    scroller.addEventListener('scroll', updateEdges, { passive: true })
    const observer = new ResizeObserver(updateEdges)
    observer.observe(scroller)
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild)

    return () => {
      scroller.removeEventListener('scroll', updateEdges)
      observer.disconnect()
    }
  }, [])

  const category = MENU_CATEGORIES.find((item) => item.id === activeId) ?? MENU_CATEGORIES[0]
  const prices = PRICE_GROUPS[category.priceGroup]
  const size = TRAY_SIZES[sizeIndex]

  const selectCategory = (id) => setActiveId(id)

  const handleTabKeyDown = (event, index) => {
    let nextIndex
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % MENU_CATEGORIES.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + MENU_CATEGORIES.length) % MENU_CATEGORIES.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = MENU_CATEGORIES.length - 1
    } else {
      return
    }

    event.preventDefault()
    setActiveId(MENU_CATEGORIES[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <section id="menu" className="bg-cream py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="À La Carte" title="Tray Menu">
            Build your own spread. Choose a category and a tray size — the prices below update
            instantly. All prices are per tray.
          </SectionHeading>
        </div>

        <div className="reveal mb-5 grid gap-3">
          <div className="relative min-w-0">
            <div ref={tabsScrollerRef} className="no-scrollbar overflow-x-auto pb-1.5">
              <div
                className="flex w-max min-w-full gap-1 rounded-full border border-forest/15 bg-white p-1.5 shadow-[0_4px_14px_rgba(31,77,26,.08)]"
                role="tablist"
                aria-label="Menu categories"
              >
                {MENU_CATEGORIES.map((item, index) => {
                  const selected = item.id === activeId
                  return (
                    <button
                      key={item.id}
                      ref={(element) => {
                        tabRefs.current[index] = element
                      }}
                      id={`menu-tab-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="menu-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => selectCategory(item.id)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                      className={`min-h-[42px] rounded-full px-3 py-2 text-[.8rem] font-semibold whitespace-nowrap transition ${
                        selected
                          ? 'bg-forest text-white shadow-[0_3px_8px_rgba(18,51,15,.2)]'
                          : 'text-forest hover:bg-forest/10'
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-cream to-transparent transition-opacity duration-200 ${
                tabsScroll.left ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-cream to-transparent transition-opacity duration-200 ${
                tabsScroll.right ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5 rounded-[17px] border border-forest/15 bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(31,77,26,.08)] justify-self-start min-[860px]:justify-self-end"
            role="group"
            aria-label="Choose tray size"
          >
            <span className="mr-0.5 text-[.63rem] font-extrabold tracking-[.11em] text-muted uppercase">
              Tray size
            </span>
            {TRAY_SIZES.map((option, index) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={index === sizeIndex}
                onClick={() => setSizeIndex(index)}
                className={`min-h-9 rounded-full border-[1.5px] px-2.5 py-1.5 text-[.72rem] font-semibold whitespace-nowrap transition ${
                  index === sizeIndex
                    ? 'border-gold bg-gold text-forest-deep shadow-[0_2px_0_#c98a12]'
                    : 'border-forest/15 bg-cream text-forest hover:-translate-y-px hover:border-forest-mid'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="reveal rounded-[26px] border border-forest/15 bg-paper p-4 shadow-[0_8px_28px_rgba(31,77,26,.07)] sm:p-5"
          id="menu-panel"
          role="tabpanel"
          aria-labelledby={`menu-tab-${category.id}`}
          tabIndex={0}
        >
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b-2 border-dashed border-forest/20 pb-3">
            <h3 className="font-display text-[1.8rem] leading-none tracking-[.04em] text-forest">
              {category.name}
            </h3>
            <p className="text-[.72rem] font-semibold text-muted">
              {category.items.length} dishes · {size.label} · prices per tray
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 min-[900px]:grid-cols-3">
            {category.items.map((dish) => (
              <article
                key={dish}
                className="flex items-start justify-between gap-2.5 rounded-[14px] border border-forest/15 bg-white px-3.5 py-2.5 transition hover:-translate-y-px hover:border-orange/55 hover:shadow-[0_5px_14px_rgba(31,77,26,.08)]"
              >
                <div>
                  <h4 className="text-[.86rem] leading-snug font-semibold text-ink">{dish}</h4>
                  {category.notes?.[dish] && (
                    <p className="mt-0.5 text-[.65rem] leading-tight font-semibold text-orange-deep">
                      {category.notes[dish]}
                    </p>
                  )}
                </div>
                <p className="shrink-0 pt-0.5 text-right font-display text-[1.3rem] leading-none tracking-[.03em] text-forest">
                  {formatPeso(prices[sizeIndex])}
                  <small className="mt-1 block font-body text-[.5rem] font-bold tracking-[.05em] text-muted uppercase">
                    per tray
                  </small>
                </p>
              </article>
            ))}
          </div>

          {category.extras?.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-forest/15 pt-3.5">
              <p className="mr-0.5 text-[.63rem] font-extrabold tracking-[.11em] text-muted uppercase">
                Also available
              </p>
              {category.extras.map((extra) => (
                <span
                  key={extra.name}
                  className="rounded-full border-[1.5px] border-[#efcb7a] bg-[#fff3d6] px-2.5 py-1 text-[.72rem] font-semibold text-[#6b4300]"
                >
                  {extra.name} <strong className="font-extrabold text-forest">{formatPeso(extra.price)}</strong>{' '}
                  {extra.unit}
                </span>
              ))}
            </div>
          )}

          <p className="mt-3.5 text-[.7rem] leading-relaxed text-muted">
            Prices are per tray. Serving sizes are estimates — message us and we will help you
            choose the right number of trays. Pork BBQ is also available at ₱30 per stick.
          </p>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {category.name} tray prices for {size.label}. {category.items.length} dishes.
        </p>

        <div className="reveal mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border-2 border-dashed border-forest/30 bg-[#f2f8ea] px-4 py-4">
          <p className="text-[.84rem] text-[#3e4a33]">
            <strong className="text-forest">Can&apos;t decide?</strong> Tell us your budget, pax, and
            favorite dishes — we&apos;ll suggest a lineup.
          </p>
          <a
            className="btn btn-forest btn-sm"
            href={messengerUrl(ASK_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="messenger" /> Ask for a suggestion
          </a>
        </div>
      </div>
    </section>
  )
}
