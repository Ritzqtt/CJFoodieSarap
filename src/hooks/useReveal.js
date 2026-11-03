import { useEffect } from 'react'

/**
 * Adds `.is-visible` to every `.reveal` element as it scrolls into view.
 * Put `reveal` on a section, card, or wrapper to animate it in.
 */
export default function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal:not(.is-visible)'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!('IntersectionObserver' in window) || reducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])
}
