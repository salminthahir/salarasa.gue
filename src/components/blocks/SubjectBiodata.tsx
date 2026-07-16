import type { SubjectBiodataConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { BlockSection } from '#/components/invitation/BlockSection'
import { Reveal } from '#/components/invitation/Reveal'

export function SubjectBiodataBlock({
  config,
  theme,
}: {
  config: SubjectBiodataConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  return (
    <BlockSection
      theme={theme}
      shapeType="arch-pointed" // Gunakan shape kubah lancip
      shapeBg="#faf7f2"
      textColor="#1e293b"
      frames="bottom" // Gunakan ornamen bawah saja
      compactShape={true} // Ukuran container lebih kecil dan padat
      fullViewport={false} // Supaya section tidak memaksa tinggi 100vh yang membuat terlihat terlalu longgar
      className="py-12"
    >
      <Reveal>
        <h2
          className="font-display mb-3 mt-4 w-full whitespace-nowrap"
          style={{ fontSize: 'clamp(1.8rem, 6.5vw, 2.5rem)' }} // Ukuran font dikecilkan agar 1 baris
        >
          {config.fullName || 'Your Name'}
        </h2>

        <div className="inv-divider mb-4" />

        <p
          className="font-serif-inv italic text-sm opacity-80 mb-6 leading-relaxed whitespace-pre-line"
        >
          {config.parentsLine}
        </p>
      </Reveal>

      {config.instagramHandle && (
        <Reveal variant="up" threshold={0.05}>
          <a
            href={`https://www.instagram.com/${config.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-slate-700 rounded-full px-6 py-2 text-[11px] tracking-[0.18em] uppercase font-body-inv hover:bg-slate-800 hover:text-white transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            @{config.instagramHandle}
          </a>
        </Reveal>
      )}
    </BlockSection>
  )
}
