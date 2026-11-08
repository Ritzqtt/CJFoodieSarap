import { useEffect, useRef, useState } from 'react'
import { BRAND, HERO_TILES, heroPhotos, messengerUrl } from '../data'
import { BOOK_MESSAGE } from '../lib/messages'
import { Icon } from './Icons'

/* Stack behaviour */
const DESKTOP_QUERY = '(min-width: 1024px)'
const PHOTO_SLOT_STAGGER_MS = 25
const PHOTO_FLY_MS = 380
const PHOTO_RETURN_MS = 350
const PHOTO_REDUCED_FADE_MS = 150
const PHOTO_DRAG_SPRING_MS = 220
const SWIPE_THRESHOLD_PX = 40
const DRAG_SUPPRESS_MS = 500
const MAX_VISIBLE_SLOT = 6
const PHOTO_ZOOM = 1.06

/*
 * Fixed, deterministic pile. Every value is [rotate deg, translateX %,
 * translateY %, scale] plus the static darkening overlay used on the
 * cards in the back. Cards deeper than slot 6 reuse slot 6 and are
 * hidden with `visibility` (never opacity).
 */
const PHOTO_STACK_SLOTS = [
  { rotate: 0, x: 0, y: 0, scale: 1, shade: 0 },
  { rotate: -8, x: -2.5, y: 2, scale: 0.99, shade: 0.08 },
  { rotate: 7, x: 3, y: -2, scale: 0.98, shade: 0.11 },
  { rotate: -14, x: -4, y: 3, scale: 0.97, shade: 0.14 },
  { rotate: 13, x: 4.5, y: -3, scale: 0.96, shade: 0.16 },
  { rotate: -5, x: -1.5, y: 4, scale: 0.95, shade: 0.18 },
  { rotate: 10, x: 3, y: 3.5, scale: 0.94, shade: 0.2 },
]

const slotTransform = (slot) =>
  `translate3d(${slot.x}%, ${slot.y}%, 0) rotate(${slot.rotate}deg) scale(${slot.scale})`

export default function Hero() {
  // `order` always holds every photo index exactly once. Index 0 is the
  // top card; the rest of the array is the pile behind it.
  const [order, setOrder] = useState(() => heroPhotos.map((_, index) => index))
  const [leaving, setLeaving] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [dragging, setDragging] = useState(false)

  const orderRef = useRef(order)
  const isAnimatingRef = useRef(false)
  const queuedClickRef = useRef(false)
  const queuedDirectionRef = useRef(null)
  const isDesktopRef = useRef(false)
  const directionRef = useRef(1) // +1 = right, -1 = left (mobile alternation)
  const cardRefs = useRef(new Map())
  const activeAnimationsRef = useRef([])
  const springAnimationRef = useRef(null)
  const pointerStartRef = useRef(null)
  const suppressClickRef = useRef(false)
  const suppressClickTimerRef = useRef(null)
  const restoreFocusRef = useRef(false)

  const topIndex = order[0]
  const currentPosition = topIndex + 1

  const getCard = (index) => cardRefs.current.get(index)
  const getTopCard = () => getCard(orderRef.current[0])

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const onChange = (event) => {
      isDesktopRef.current = event.matches
    }

    isDesktopRef.current = query.matches
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    }

    query.addListener(onChange)
    return () => query.removeListener(onChange)
  }, [])

  useEffect(() => {
    heroPhotos.forEach((photo) => {
      const image = new Image()
      image.src = photo.src
      if (typeof image.decode === 'function') {
        image.decode().catch(() => {})
      }
    })
  }, [])

  useEffect(() => {
    if (!restoreFocusRef.current) return
    restoreFocusRef.current = false
    getCard(order[0])?.focus({ preventScroll: true })
  }, [order])

  useEffect(
    () => () => {
      activeAnimationsRef.current.forEach((animation) => animation.cancel())
      activeAnimationsRef.current = []
      springAnimationRef.current?.cancel()
      window.clearTimeout(suppressClickTimerRef.current)
    },
    [],
  )

  const cancelActiveAnimations = () => {
    activeAnimationsRef.current.forEach((animation) => {
      try {
        animation.cancel()
      } catch {
        // The animation may already be finished/removed.
      }
    })
    activeAnimationsRef.current = []
  }

  const finishAdvance = (outgoingIndex) => {
    const card = getCard(outgoingIndex)
    if (card) card.style.zIndex = ''
    setLeaving(null)
    isAnimatingRef.current = false

    if (queuedClickRef.current) {
      queuedClickRef.current = false
      const queuedDirection = queuedDirectionRef.current
      queuedDirectionRef.current = null
      showNextPhoto(queuedDirection)
    }
  }

  const springBack = () => {
    const card = getTopCard()
    if (!card) return

    const from = window.getComputedStyle(card).transform
    card.style.removeProperty('--drag-x')
    card.style.removeProperty('--drag-rotation')

    if (from === 'none' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const spring = card.animate(
      [{ transform: from }, { transform: slotTransform(PHOTO_STACK_SLOTS[0]) }],
      { duration: PHOTO_DRAG_SPRING_MS, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
    springAnimationRef.current = spring
    spring.finished.then(
      () => {
        spring.cancel()
        if (springAnimationRef.current === spring) springAnimationRef.current = null
      },
      () => {},
    )
  }

  const showNextPhoto = (swipeDirection = null) => {
    if (isAnimatingRef.current) {
      queuedClickRef.current = true
      if (swipeDirection !== null) queuedDirectionRef.current = swipeDirection
      // A swipe that lands mid-animation must not leave the new top card
      // stuck at its dragged offset.
      const currentTop = getTopCard()
      currentTop?.style.removeProperty('--drag-x')
      currentTop?.style.removeProperty('--drag-rotation')
      return
    }

    const currentOrder = orderRef.current
    const outgoingIndex = currentOrder[0]
    const nextOrder = [...currentOrder.slice(1), outgoingIndex]
    const card = getCard(outgoingIndex)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = isDesktopRef.current

    springAnimationRef.current?.cancel()
    springAnimationRef.current = null

    // At >= 1024px every change goes right. Below that, alternate and
    // let a swipe decide the direction of that particular change.
    const direction = swipeDirection ?? (desktop ? 1 : directionRef.current)
    if (!desktop) directionRef.current = -direction

    isAnimatingRef.current = true
    restoreFocusRef.current = document.activeElement === card
    setHasInteracted(true)

    if (!card) {
      orderRef.current = nextOrder
      setOrder(nextOrder)
      isAnimatingRef.current = false
      return
    }

    const phase = reducedMotion ? 'fade' : 'fly'
    setLeaving({ index: outgoingIndex, phase })

    if (reducedMotion) {
      // Crossfade only: no rotation, no fly-out, pile stays put until the
      // fade is done.
      const fade = card.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: PHOTO_REDUCED_FADE_MS, easing: 'ease-out', fill: 'forwards' },
      )
      activeAnimationsRef.current = [fade]

      fade.finished.then(
        () => {
          card.style.opacity = '0'
          cancelActiveAnimations()
          orderRef.current = nextOrder
          setOrder(nextOrder)
          finishAdvance(outgoingIndex)
          window.requestAnimationFrame(() => {
            card.style.opacity = ''
          })
        },
        () => {},
      )
      return
    }

    // Capture where the card currently is (including any drag offset)
    // before the new order changes its CSS slot.
    const fromTransform = window.getComputedStyle(card).transform || slotTransform(PHOTO_STACK_SLOTS[0])
    card.style.removeProperty('--drag-x')
    card.style.removeProperty('--drag-rotation')

    orderRef.current = nextOrder
    setOrder(nextOrder)

    // 118% of the card's own width puts the whole rotated card past the
    // frame edge, so the z-index hand-off never cuts through the pile.
    const flyOutDistance = direction * 118
    const flyOutTransform = `translate3d(${flyOutDistance}%, -4%, 0) rotate(${direction * 14}deg) scale(1)`
    const deepSlot = PHOTO_STACK_SLOTS[PHOTO_STACK_SLOTS.length - 1]

    const fly = card.animate(
      [{ transform: fromTransform }, { transform: flyOutTransform }],
      { duration: PHOTO_FLY_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
    )
    activeAnimationsRef.current = [fly]

    fly.finished.then(
      () => {
        if (!activeAnimationsRef.current.includes(fly)) return

        // The card is fully outside the frame at this point, so it can
        // safely drop underneath the pile and slide back in from the
        // side it left.
        card.style.zIndex = '1'
        setLeaving({ index: outgoingIndex, phase: 'return' })

        const back = card.animate(
          [
            { transform: flyOutTransform },
            { transform: slotTransform(deepSlot) },
          ],
          { duration: PHOTO_RETURN_MS, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
        )
        activeAnimationsRef.current.push(back)

        back.finished.then(
          () => {
            if (!activeAnimationsRef.current.includes(back)) return
            cancelActiveAnimations()
            finishAdvance(outgoingIndex)
          },
          () => {},
        )
      },
      () => {},
    )
  }

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      window.clearTimeout(suppressClickTimerRef.current)
      return
    }

    showNextPhoto()
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse') return

    pointerStartRef.current = { x: event.clientX, y: event.clientY }
    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const start = pointerStartRef.current
    if (!start || !dragging) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return

    const card = getTopCard()
    if (!card) return
    card.style.setProperty('--drag-x', `${deltaX}px`)
    card.style.setProperty('--drag-rotation', `${deltaX * 0.035}deg`)
  }

  const handlePointerUp = (event) => {
    const start = pointerStartRef.current
    pointerStartRef.current = null
    setDragging(false)

    if (!start) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const isHorizontalDrag = Math.abs(deltaX) > Math.abs(deltaY)
    const dragged = isHorizontalDrag && Math.abs(deltaX) >= 8
    const shouldAdvance = isHorizontalDrag && Math.abs(deltaX) >= SWIPE_THRESHOLD_PX

    if (dragged) {
      suppressClickRef.current = true
      window.clearTimeout(suppressClickTimerRef.current)
      suppressClickTimerRef.current = window.setTimeout(() => {
        suppressClickRef.current = false
      }, DRAG_SUPPRESS_MS)
    }

    if (shouldAdvance) {
      showNextPhoto(deltaX < 0 ? -1 : 1)
      return
    }

    springBack()
  }

  const handlePointerCancel = () => {
    pointerStartRef.current = null
    setDragging(false)
    springBack()
  }

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

          <div className="relative mx-auto w-full max-w-[470px]">
            <div
              className={`hero-photo-stack aspect-[5/4] lg:aspect-[1/.92] ${
                hasInteracted ? 'has-interacted' : ''
              }`}
            >
              <div className="hero-photo-pile">
                {heroPhotos.map((photo, index) => {
                  const layer = order.indexOf(index)
                  const slotIndex = Math.min(layer, MAX_VISIBLE_SLOT)
                  const slot = PHOTO_STACK_SLOTS[slotIndex]
                  const isTop = layer === 0
                  const isLeaving = leaving?.index === index
                  const isHidden = layer > MAX_VISIBLE_SLOT && !isLeaving
                  const phase = isLeaving ? leaving.phase : undefined

                  return (
                    <button
                      key={photo.src}
                      ref={(element) => {
                        if (element) cardRefs.current.set(index, element)
                        else cardRefs.current.delete(index)
                      }}
                      type="button"
                      aria-label={
                        isTop
                          ? `Show next photo, ${currentPosition} of ${heroPhotos.length}: ${photo.alt}`
                          : undefined
                      }
                      aria-hidden={isTop ? undefined : 'true'}
                      tabIndex={isTop ? 0 : -1}
                      disabled={!isTop}
                      data-slot={slotIndex}
                      data-hidden={isHidden ? 'true' : undefined}
                      data-phase={phase}
                      className={`hero-photo-card ${isTop ? 'cursor-pointer' : 'pointer-events-none'} ${
                        isLeaving ? 'is-leaving' : ''
                      } ${isTop && dragging ? 'is-dragging' : ''}`}
                      style={{
                        '--slot-x': `${slot.x}%`,
                        '--slot-y': `${slot.y}%`,
                        '--slot-rotate': `${slot.rotate}deg`,
                        '--slot-scale': slot.scale,
                        '--slot-shade': slot.shade,
                        '--slot-index': slotIndex,
                        '--slot-delay': `${isLeaving ? 0 : layer * PHOTO_SLOT_STAGGER_MS}ms`,
                        '--photo-zoom': PHOTO_ZOOM,
                      }}
                      onClick={isTop ? handleClick : undefined}
                      onPointerDown={isTop ? handlePointerDown : undefined}
                      onPointerMove={isTop ? handlePointerMove : undefined}
                      onPointerUp={isTop ? handlePointerUp : undefined}
                      onPointerCancel={isTop ? handlePointerCancel : undefined}
                    >
                      <img
                        src={photo.src}
                        alt=""
                        aria-hidden="true"
                        loading="eager"
                        decoding="async"
                        draggable="false"
                        className="hero-photo-card-image"
                      />
                      <span className="hero-photo-card-shade" aria-hidden="true" />
                    </button>
                  )
                })}
              </div>

              <span className="sr-only" aria-live="polite" aria-atomic="true">
                Photo {currentPosition} of {heroPhotos.length}
              </span>
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
