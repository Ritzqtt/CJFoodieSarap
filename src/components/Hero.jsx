import { useEffect, useRef, useState } from 'react'
import { BRAND, HERO_TILES, heroPhotos, messengerUrl } from '../data'
import { BOOK_MESSAGE } from '../lib/messages'
import { Icon } from './Icons'

const PHOTO_TRANSITION_MS = 600
const PHOTO_EXIT_MS = 325
const PHOTO_SLOT_STAGGER_MS = 25
const PHOTO_ANIMATION_MS = PHOTO_TRANSITION_MS + 7 * PHOTO_SLOT_STAGGER_MS
const PHOTO_INTRO_STAGGER_MS = 40
const STACK_SCALE = 1
const PHOTO_ZOOM = 1.06

const PHOTO_STACK_SLOTS = [
  {
    x: '0%',
    y: '0%',
    rotation: '0deg',
    scale: STACK_SCALE,
    opacity: 1,
    shade: 0,
    intro: 'translate(0, -8%) rotate(0deg) scale(.96)',
  },
  {
    x: '-0.6%',
    y: '0.6%',
    rotation: '-4.2deg',
    scale: 0.96,
    opacity: 0.97,
    shade: 0.04,
    intro: 'translate(-8%, 7%) rotate(-24deg) scale(.72)',
  },
  {
    x: '0.6%',
    y: '-0.6%',
    rotation: '3.6deg',
    scale: 0.94,
    opacity: 0.94,
    shade: 0.07,
    intro: 'translate(8%, -7%) rotate(23deg) scale(.72)',
  },
  {
    x: '-0.6%',
    y: '0.6%',
    rotation: '-7.2deg',
    scale: 0.9,
    opacity: 0.91,
    shade: 0.1,
    intro: 'translate(-8%, 7%) rotate(-30deg) scale(.69)',
  },
  {
    x: '0.6%',
    y: '-0.6%',
    rotation: '7.8deg',
    scale: 0.89,
    opacity: 0.88,
    shade: 0.13,
    intro: 'translate(8%, -7%) rotate(32deg) scale(.69)',
  },
  {
    x: '-0.6%',
    y: '0.6%',
    rotation: '-3deg',
    scale: 0.91,
    opacity: 0.85,
    shade: 0.16,
    intro: 'translate(-7%, 8%) rotate(-22deg) scale(.73)',
  },
  {
    x: '0.6%',
    y: '0.6%',
    rotation: '6deg',
    scale: 0.88,
    opacity: 0.82,
    shade: 0.18,
    intro: 'translate(8%, 7%) rotate(29deg) scale(.7)',
  },
  {
    x: '-0.6%',
    y: '-0.6%',
    rotation: '-6.6deg',
    scale: 0.87,
    opacity: 0.8,
    shade: 0.2,
    intro: 'translate(-8%, -7%) rotate(-31deg) scale(.68)',
  },
]

export default function Hero() {
  const [stackState, setStackState] = useState(() => ({
    order: heroPhotos,
    exitingId: null,
    exitPhase: 'idle',
    exitX: '45%',
    exitRotation: '12deg',
  }))
  const [isDragging, setIsDragging] = useState(false)
  const [isReturning, setIsReturning] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [introState, setIntroState] = useState('pending')
  const isAnimatingRef = useRef(false)
  const queuedClickRef = useRef(false)
  const pointerStartRef = useRef(null)
  const suppressClickRef = useRef(false)
  const suppressClickTimerRef = useRef(null)
  const dragReturnTimerRef = useRef(null)
  const animationTimersRef = useRef([])
  const topCardRef = useRef(null)
  const stackRef = useRef(null)
  const restoreFocusRef = useRef(false)
  const stackStateRef = useRef(stackState)
  const photoOrder = stackState.order
  const currentPhoto = photoOrder[0]
  const currentPosition = heroPhotos.indexOf(currentPhoto) + 1

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return undefined

    let introTimer
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      observer.disconnect()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIntroState('done')
        return
      }

      setIntroState('running')
      introTimer = window.setTimeout(() => setIntroState('done'), 760)
    }, { threshold: 0.2 })

    observer.observe(stack)

    return () => {
      observer.disconnect()
      window.clearTimeout(introTimer)
    }
  }, [])

  useEffect(() => {
    heroPhotos.forEach((photo) => {
      const image = new Image()
      image.src = photo.src
      image.decode().catch((error) => {
        console.error(`Could not preload hero photo: ${photo.src}`, error)
      })
    })

    return () => {
      animationTimersRef.current.forEach((timer) => window.clearTimeout(timer))
      window.clearTimeout(suppressClickTimerRef.current)
      window.clearTimeout(dragReturnTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (restoreFocusRef.current) {
      topCardRef.current?.focus({ preventScroll: true })
      restoreFocusRef.current = false
    }
  }, [photoOrder])

  const showNextPhoto = (exitX = '45%', exitRotation = '12deg', leavingCard = null) => {
    if (isAnimatingRef.current) {
      leavingCard?.style.removeProperty('--drag-x')
      leavingCard?.style.removeProperty('--drag-rotation')
      queuedClickRef.current = true
      return
    }

    isAnimatingRef.current = true
    setIntroState('done')
    restoreFocusRef.current = document.activeElement === topCardRef.current
    setHasInteracted(true)
    const currentStack = stackStateRef.current
    const outgoingPhoto = currentStack.order[0]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nextStack = {
      ...currentStack,
      order: [...currentStack.order.slice(1), outgoingPhoto],
      exitingId: outgoingPhoto.src,
      exitPhase: 'fly',
      exitX: reducedMotion ? '0%' : exitX,
      exitRotation: reducedMotion ? '0deg' : exitRotation,
    }

    stackStateRef.current = nextStack
    setStackState(nextStack)
    const scheduleAnimation = (callback, delay) => {
      let timer
      timer = window.setTimeout(() => {
        animationTimersRef.current = animationTimersRef.current.filter((item) => item !== timer)
        callback()
      }, delay)
      animationTimersRef.current.push(timer)
    }

    if (reducedMotion) {
      scheduleAnimation(() => {
        leavingCard?.style.removeProperty('--drag-x')
        leavingCard?.style.removeProperty('--drag-rotation')
        const finishedStack = {
          ...stackStateRef.current,
          exitingId: null,
          exitPhase: 'idle',
        }
        stackStateRef.current = finishedStack
        setStackState(finishedStack)
        isAnimatingRef.current = false
        if (queuedClickRef.current) {
          queuedClickRef.current = false
          showNextPhoto()
        }
      }, 200)
      return
    }

    scheduleAnimation(() => {
      const settledStack = { ...stackStateRef.current, exitPhase: 'settle' }
      stackStateRef.current = settledStack
      setStackState(settledStack)
    }, PHOTO_EXIT_MS)
    scheduleAnimation(() => {
      leavingCard?.style.removeProperty('--drag-x')
      leavingCard?.style.removeProperty('--drag-rotation')
      const finishedStack = {
        ...stackStateRef.current,
        exitingId: null,
        exitPhase: 'idle',
      }
      stackStateRef.current = finishedStack
      setStackState(finishedStack)
      isAnimatingRef.current = false
      if (queuedClickRef.current) {
        queuedClickRef.current = false
        showNextPhoto()
      }
    }, PHOTO_ANIMATION_MS)
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
    setIsReturning(false)
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const start = pointerStartRef.current
    if (!start || !isDragging) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      topCardRef.current?.style.setProperty('--drag-x', `${deltaX}px`)
      topCardRef.current?.style.setProperty('--drag-rotation', `${deltaX * 0.035}deg`)
    }
  }

  const handlePointerUp = (event) => {
    const start = pointerStartRef.current
    pointerStartRef.current = null

    if (!start) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const isHorizontalDrag = Math.abs(deltaX) > Math.abs(deltaY)
    const dragged = isHorizontalDrag && Math.abs(deltaX) >= 8
    const shouldAdvance = isHorizontalDrag && Math.abs(deltaX) >= 40

    if (dragged) {
      suppressClickRef.current = true
      window.clearTimeout(suppressClickTimerRef.current)
      suppressClickTimerRef.current = window.setTimeout(() => {
        suppressClickRef.current = false
      }, 500)
    }

    if (shouldAdvance) {
      showNextPhoto(
        deltaX < 0 ? '-45%' : '45%',
        deltaX < 0 ? '-12deg' : '12deg',
        event.currentTarget,
      )
    } else {
      topCardRef.current?.style.setProperty('--drag-x', '0px')
      topCardRef.current?.style.setProperty('--drag-rotation', '0deg')
      if (dragged) {
        setIsReturning(true)
        window.clearTimeout(dragReturnTimerRef.current)
        dragReturnTimerRef.current = window.setTimeout(() => setIsReturning(false), 260)
      }
    }

    setIsDragging(false)
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

          <div className="reveal relative mx-auto w-full max-w-[470px]" style={{ transitionDelay: '120ms' }}>
            <div
              ref={stackRef}
              className={`photo-ph hero-photo-stack [&::before]:hidden aspect-[5/4] lg:aspect-[1/.92] ${
                hasInteracted ? 'has-interacted' : ''
              } intro-${introState}`}
            >
              <div className="hero-photo-pile">
                {photoOrder.map((photo, layer) => {
                  const isTop = layer === 0
                  const slotIndex = Math.min(layer, PHOTO_STACK_SLOTS.length - 1)
                  const slot = PHOTO_STACK_SLOTS[slotIndex]
                  const isExiting = photo.src === stackState.exitingId
                  const cardClassName = `hero-photo-card ${
                    isTop ? 'cursor-pointer' : 'pointer-events-none'
                  } ${isExiting ? 'is-exiting' : ''} ${
                    isTop && isDragging ? 'is-dragging' : ''
                  } ${isTop && isReturning ? 'is-returning' : ''}`
                  const cardStyle = {
                    '--slot-x': slot.x,
                    '--slot-y': slot.y,
                    '--slot-rotation': slot.rotation,
                    '--slot-scale': slot.scale * STACK_SCALE,
                    '--slot-opacity': slot.opacity,
                    '--slot-shade': slot.shade,
                    '--intro-transform': slot.intro,
                    '--intro-delay': `${slotIndex * PHOTO_INTRO_STAGGER_MS}ms`,
                    '--slot-delay': `${isExiting ? 0 : layer * PHOTO_SLOT_STAGGER_MS}ms`,
                    '--slot-index': slotIndex,
                    '--photo-zoom': PHOTO_ZOOM,
                    '--card-radius': isTop ? '38px' : '4px',
                    '--photo-radius': isTop ? '33px' : '2px',
                    '--exit-x': stackState.exitX,
                    '--exit-rotation': stackState.exitRotation,
                  }

                  const image = (
                    <>
                      <img
                        src={photo.src}
                        alt=""
                        aria-hidden="true"
                        loading="eager"
                        decoding="async"
                        className="hero-photo-card-image"
                      />
                      <span className="hero-photo-card-shade" />
                    </>
                  )

                  return (
                    <button
                      key={photo.src}
                      ref={isTop ? topCardRef : null}
                      type="button"
                      aria-label={isTop ? `Show next photo, ${currentPosition} of ${heroPhotos.length}: ${photo.alt}` : undefined}
                      aria-hidden={!isTop}
                      tabIndex={isTop ? 0 : -1}
                      disabled={!isTop}
                      data-slot={slotIndex}
                      data-hidden={layer > 7}
                      data-exit-phase={isExiting ? stackState.exitPhase : undefined}
                      style={cardStyle}
                      className={cardClassName}
                      onClick={isTop ? handleClick : undefined}
                      onPointerDown={isTop ? handlePointerDown : undefined}
                      onPointerMove={isTop ? handlePointerMove : undefined}
                      onPointerUp={isTop ? handlePointerUp : undefined}
                      onPointerCancel={isTop ? () => {
                        pointerStartRef.current = null
                        topCardRef.current?.style.setProperty('--drag-x', '0px')
                        topCardRef.current?.style.setProperty('--drag-rotation', '0deg')
                        setIsDragging(false)
                      } : undefined}
                    >
                      {image}
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
