import type { DresscodeConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { BlockSection } from '#/components/invitation/BlockSection'
import { Reveal } from '#/components/invitation/Reveal'

export function DresscodeBlock({
  config,
  theme,
}: {
  config: DresscodeConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  return (
    <BlockSection
      theme={theme}
      shapeType="arch-round" // Shape arch
      shapeBg="#faf7f2"
      textColor="#1e293b"
      frames="none" // Tidak menggunakan frame karena sudah ada ornamen (dresscodeBanner) tersendiri di dalam
      compactShape={true}
      fullViewport={false}
      className="py-12"
    >
      <Reveal>
        <img
          src={theme.ornaments.dresscodeBanner}
          alt=""
          className="w-full max-w-[260px] mx-auto mb-6 opacity-90"
          loading="lazy"
        />
      </Reveal>

      <Reveal>
        <p className="font-body-inv text-[10px] tracking-[0.35em] uppercase opacity-60 mb-1">
          Dresscode
        </p>

        <h2
          className="font-display mb-2"
          style={{ fontSize: 'clamp(2.8rem, 10vw, 4rem)' }}
        >
          Dresscode
        </h2>

        <div className="inv-divider mb-4" />

        <p className="font-serif-inv italic text-base sm:text-lg opacity-90">
          {config.text}
        </p>
      </Reveal>
    </BlockSection>
  )
}
