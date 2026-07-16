import type { HeroConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { BlockSection } from '#/components/invitation/BlockSection'
import { Reveal } from '#/components/invitation/Reveal'

export function HeroBlock({
  config,
  theme,
}: {
  config: HeroConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  return (
    <BlockSection
      theme={theme}
      shapeType="arch-round" // Gunakan shape kubah bundar
      shapeBg="#faf7f2"
      textColor="#1e293b"
      frames="both"
    >
      <Reveal>
        <h2
          className="font-display mb-3"
          style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)' }}
        >
          {config.title}
        </h2>

        {config.subtitle && (
          <p
            className="font-serif-inv italic text-base sm:text-lg opacity-80 mb-6 leading-relaxed max-w-[260px] mx-auto"
          >
            {config.subtitle}
          </p>
        )}
      </Reveal>

      <div className="inv-divider mb-6" />

      <Reveal variant="up" threshold={0.05}>
        <img
          src={config.image ?? theme.ornaments.heroFloral}
          alt=""
          className="w-full max-w-[240px] mx-auto opacity-95"
          loading="lazy"
        />
      </Reveal>
    </BlockSection>
  )
}
