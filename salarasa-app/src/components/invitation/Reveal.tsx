import type { ReactNode } from 'react'
import { useReveal } from '#/lib/use-reveal'
import { cn } from '#/lib/utils'

export function Reveal({
  children,
  variant = 'fade',
  className,
  threshold = 0.15,
}: {
  children: ReactNode
  variant?: 'fade' | 'up'
  className?: string
  threshold?: number
}) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold })
  return (
    <div
      ref={ref}
      className={cn(
        'reveal',
        variant === 'up' && 'reveal-up',
        visible && 'is-visible',
        className,
      )}
    >
      {children}
    </div>
  )
}
