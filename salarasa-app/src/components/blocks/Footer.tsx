import type { FooterConfig, ThemeStyleConfig } from '#/lib/blocks/types'

export function FooterBlock({
  config,
}: {
  config: FooterConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  return (
    <section className="w-full bg-[#1e293b] text-white py-12 px-6 flex flex-col items-center justify-center text-center font-body-inv">
      <p className="text-[10px] tracking-[0.3em] uppercase opacity-70 mb-4">
        {config.makerText}
      </p>
      <h3 className="font-display text-2xl tracking-widest mb-6">
        {config.makerName}
      </h3>
      <div className="flex gap-4">
        {config.whatsappNumber && (
          <a
            href={`https://wa.me/${config.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors"
          >
            WA
          </a>
        )}
        {config.instagramHandle && (
          <a
            href={`https://instagram.com/${config.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors"
          >
            IG
          </a>
        )}
      </div>
    </section>
  )
}
