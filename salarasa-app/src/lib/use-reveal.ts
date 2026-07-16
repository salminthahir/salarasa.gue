import { useEffect, useRef, useState } from 'react'

/**
 * IntersectionObserver hook for scroll-reveal animations.
 * Replaces Elementor's fadeIn / fadeInUp using CSS transitions (.reveal / .is-visible).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: {
  threshold?: number
  rootMargin?: string
  once?: boolean
}) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (opts?.once !== false) obs.unobserve(entry.target)
          } else if (opts?.once === false) {
            setVisible(false)
          }
        }
      },
      {
        threshold: opts?.threshold ?? 0.15,
        rootMargin: opts?.rootMargin ?? '0px',
      },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [opts?.threshold, opts?.rootMargin, opts?.once])

  return { ref, visible }
}
