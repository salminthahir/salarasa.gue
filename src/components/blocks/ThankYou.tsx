import type { ThankYouConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { BlockSection } from '#/components/invitation/BlockSection'
import { Reveal } from '#/components/invitation/Reveal'

export function ThankYouBlock({
  config,
  theme,
}: {
  config: ThankYouConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  return (
    <BlockSection
      theme={theme}
      shapeType="arch-round"
      shapeBg="#faf7f2"
      textColor="#1e293b"
      frames="both"
    >
      <Reveal>
        <h2
          className="font-display mb-4"
          style={{
            fontSize: 'clamp(3.5rem, 14vw, 5.5rem)',
            lineHeight: 1.15,
          }}
        >
          {config.heading}
        </h2>

        <img
          src={theme.ornaments.heroFloral}
          alt=""
          className="w-full max-w-[220px] mx-auto mb-4 opacity-90"
          loading="lazy"
        />

        <div className="inv-divider mb-4" />

        <p
          className="font-display"
          style={{
            fontSize: 'clamp(2.2rem, 9vw, 3.5rem)',
          }}
        >
          {config.name}
        </p>
      </Reveal>
    </BlockSection>
  )
}
