import { useEffect, useState } from 'react'
import type { CountdownEventConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { BlockSection } from '#/components/invitation/BlockSection'
import { Reveal } from '#/components/invitation/Reveal'

function useCountdown(targetIso: string) {
  const target = targetIso ? new Date(targetIso).getTime() : 0
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  if (!target) return null
  const diff = Math.max(target - now, 0)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

export function CountdownEventBlock({
  config,
  theme,
}: {
  config: CountdownEventConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  const remaining = useCountdown(config.eventDateTime)
  const items = remaining
    ? [
        { label: 'Days', value: remaining.days },
        { label: 'Hours', value: remaining.hours },
        { label: 'Minutes', value: remaining.minutes },
        { label: 'Seconds', value: remaining.seconds },
      ]
    : []

  return (
    <BlockSection
      theme={theme}
      shapeType="arch-horseshoe"
      shapeBg="#faf7f2"
      textColor="#1e293b"
      frames="both" // Frame bawah dan atas, tapi atas kecil
      smallTopFrame={true} // Atas kecil
    >
      <div className="w-full mt-4 mb-4">
        {/* countdown grid */}
        {remaining && (
          <Reveal variant="up" threshold={0.05}>
            <ul className="grid grid-cols-4 gap-2 mb-8 w-full max-w-[280px] mx-auto">
              {items.map((it) => (
                <li key={it.label} className="text-center">
                  <div
                    className="font-serif-inv font-semibold leading-none mb-2"
                    style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}
                  >
                    {String(it.value).padStart(2, '0')}
                  </div>
                  <div className="font-body-inv text-[9px] tracking-[0.2em] uppercase opacity-70">
                    {it.label}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <div className="inv-divider mb-6" />

        {config.calendarStartIso && (
          <Reveal>
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                config.calendarTitle ?? config.eventTitle,
              )}&dates=${config.calendarStartIso}/${config.calendarEndIso ?? config.calendarStartIso}&ctz=Asia/Jakarta`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-10 font-body-inv text-[10px] tracking-[0.3em] uppercase border border-slate-700 rounded-full px-6 py-2 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Save the date
            </a>
          </Reveal>
        )}

        {/* Event Info below countdown */}
        {config.eventTitle && (
          <Reveal>
            <h2
              className="font-display mb-3"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 3.5rem)' }}
            >
              {config.eventTitle}
            </h2>
          </Reveal>
        )}

        {config.eventDateText && (
          <Reveal>
            <p className="font-serif-inv italic text-base sm:text-lg mb-1 opacity-90">
              {config.eventDateText}
            </p>
          </Reveal>
        )}

        {config.eventTime && (
          <Reveal>
            <p className="font-body-inv text-sm opacity-80 mb-5">{config.eventTime}</p>
          </Reveal>
        )}

        {config.venueName && (
          <Reveal>
            <p className="font-serif-inv font-semibold text-base mb-1">{config.venueName}</p>
          </Reveal>
        )}

        {config.address && (
          <Reveal>
            <p className="font-body-inv text-xs opacity-75 mb-6 max-w-[260px] mx-auto leading-relaxed">
              {config.address}
            </p>
          </Reveal>
        )}

        {(config.mapsEmbedQuery || config.venueName || config.mapsUrl) && (
          <Reveal>
            <div className="mt-6 w-full">
              <iframe
                title="Lokasi Acara"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  config.mapsEmbedQuery || config.venueName || '0.7637294743494907, 127.32220197857026'
                )}&output=embed`}
                className="w-full h-52 rounded-xl border border-slate-200 shadow-md"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        )}

        {config.mapsUrl && (
          <Reveal variant="up" threshold={0.05}>
            <a
              href={config.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 border border-slate-700 rounded-full px-8 py-2.5 text-[11px] tracking-[0.22em] uppercase font-body-inv hover:bg-slate-800 hover:text-white transition-all duration-300"
            >
              Open Maps
            </a>
          </Reveal>
        )}
      </div>
    </BlockSection>
  )
}
