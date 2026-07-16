import type { ThemeStyleConfig } from '#/lib/blocks/types'
import { useReveal } from '#/lib/use-reveal'
import { cn } from '#/lib/utils'

/**
 * Shared wrapper for Riqqa Kalief Invitation replica.
 * Layer 1: Texture background (download-16.jpeg by default)
 * Layer 2: Shape Overlay (polos) + Frame Atas & Bawah
 * Layer 3: Content (Text)
 */
export function BlockSection({
  theme,
  children,
  className = '',
  fullViewport = true,
  backgroundImage = '/riqqa-assets/download-16.jpeg', // Default texture
  darkOverlay = false,
  shapeType = 'arch-round', // 'arch-round' | 'arch-pointed' | 'arch-horseshoe' | 'arch-gate' | 'none'
  shapeBg = '#faf7f2', // Polos bg color for shape overlay
  textColor = '#1e293b', // Contrast text color
  frames = 'both', // 'both' | 'top' | 'bottom' | 'none'
  smallTopFrame = false,
  compactShape = false,
}: {
  theme: ThemeStyleConfig
  children: React.ReactNode
  className?: string
  fullViewport?: boolean
  backgroundImage?: string
  darkOverlay?: boolean
  shapeType?: 'arch-round' | 'arch-pointed' | 'arch-horseshoe' | 'arch-gate' | 'none'
  shapeBg?: string
  textColor?: string
  frames?: 'both' | 'top' | 'bottom' | 'none'
  smallTopFrame?: boolean
  compactShape?: boolean
}) {
  // Animasi reveal untuk base shape container
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section
      className={`relative flex flex-col items-center justify-center w-full overflow-hidden px-4 py-16 bg-cover bg-center ${fullViewport ? 'min-h-[100dvh]' : ''} ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional Dark Overlay for Background Image */}
      {darkOverlay && (
        <div className="absolute inset-0 z-0" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} />
      )}

      {/* Layer 2: Shape Overlay (Polos) */}
      <div 
        ref={ref}
        className={cn(
          "relative z-10 w-full flex flex-col items-center reveal reveal-up",
          visible && "is-visible",
          compactShape ? 'max-w-[320px]' : 'max-w-[400px]'
        )}
      >
        {shapeType !== 'none' ? (
          <div
            className={`relative w-full shadow-xl flex flex-col items-center justify-center px-6 ${compactShape ? 'pt-16 pb-20' : 'pt-24 pb-28'} ${shapeType}`}
            style={{
              backgroundColor: shapeBg,
              color: textColor,
            }}
          >
            {/* Frame Atas */}
            {(frames === 'both' || frames === 'top') && (
              <img
                src="/riqqa-assets/c20cc952-82a0-410e-aa73-134673b36115.png"
                alt="Frame Atas"
                className={`w-full ${smallTopFrame ? 'max-w-[160px] -top-3' : 'max-w-[280px] -top-6'} absolute left-1/2 -translate-x-1/2 drop-shadow-md z-20 pointer-events-none select-none transition-all`}
              />
            )}

            {/* Layer 3: Content inside Shape */}
            <div className="relative z-10 w-full text-center flex flex-col items-center gap-2">
              {children}
            </div>

            {/* Frame Bawah */}
            {(frames === 'both' || frames === 'bottom') && (
              <img
                src="/riqqa-assets/2d1e1862-7dbd-492c-95c8-930ba1660258.png"
                alt="Frame Bawah"
                className="w-full max-w-[280px] absolute -bottom-6 left-1/2 -translate-x-1/2 drop-shadow-md z-20 pointer-events-none select-none"
              />
            )}
          </div>
        ) : (
          <div className="relative z-10 w-full text-center flex flex-col items-center gap-2" style={{ color: textColor }}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
