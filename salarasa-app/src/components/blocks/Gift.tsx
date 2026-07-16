import { useState } from 'react'
import type { GiftConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { BlockSection } from '#/components/invitation/BlockSection'
import { Reveal } from '#/components/invitation/Reveal'

export function GiftBlock({
  config,
  theme,
}: {
  config: GiftConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(config.accountNumber)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = config.accountNumber
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BlockSection
      theme={theme}
      shapeType="arch-gate"
      shapeBg="#faf7f2"
      textColor="#1e293b"
      frames="both"
    >
      <Reveal>
        <h2
          className="font-display mb-3"
          style={{ fontSize: 'clamp(2.8rem, 10vw, 4rem)' }}
        >
          {config.heading}
        </h2>
        <div className="inv-divider mb-4" />
        <p className="font-body-inv text-xs sm:text-sm opacity-80 mb-8 max-w-[240px] mx-auto leading-relaxed">
          {config.helperText}
        </p>
      </Reveal>

      {config.showToggle && (
        <div className="flex flex-col items-center gap-5 w-full">
          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-body-inv border border-slate-700 rounded-full px-8 py-2.5 text-[11px] tracking-[0.22em] uppercase hover:bg-slate-800 hover:text-white transition-all duration-300"
            >
              Click here
            </button>
          )}

          {open && (
            <Reveal>
              <div
                className="w-full max-w-[260px] mx-auto rounded-xl border border-slate-200 p-5 text-left bg-white shadow-sm"
              >
                {config.bankLogoUrl && (
                  <img
                    src={config.bankLogoUrl}
                    alt={config.bankName}
                    className="h-8 object-contain mb-3 opacity-90"
                  />
                )}

                <div className="font-body-inv text-lg font-semibold tracking-wider mb-0.5">
                  {config.accountNumber}
                </div>
                <div className="font-body-inv text-xs opacity-60 mb-5">
                  a.n. {config.accountHolder}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="font-body-inv text-[10px] tracking-widest uppercase border border-slate-300 rounded-full px-5 py-1.5 transition-colors hover:bg-slate-100"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="font-body-inv text-[10px] tracking-widest uppercase opacity-50 hover:opacity-80 transition-opacity"
                  >
                    Sembunyikan
                  </button>
                </div>
              </div>
            </Reveal>
          )}

          {config.whatsappNumber && (
            <a
              href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                config.whatsappNumber,
              )}&text=${encodeURIComponent(
                config.whatsappMessage ??
                  'Halo, Saya ingin melakukan konfirmasi kado. terima kasih',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body-inv text-[11px] tracking-[0.22em] uppercase border-b border-slate-400 pb-0.5 opacity-70 hover:opacity-100 transition-opacity mt-2"
            >
              Confirmation
            </a>
          )}
        </div>
      )}
    </BlockSection>
  )
}
