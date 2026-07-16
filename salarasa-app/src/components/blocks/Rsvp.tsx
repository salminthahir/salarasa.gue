import { useState } from 'react'
import type { RsvpConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { submitRsvp } from '#/server/invitation-fns'
import { BlockSection } from '#/components/invitation/BlockSection'
import { Reveal } from '#/components/invitation/Reveal'

export function RsvpBlock({
  config,
  theme,
  invitationId,
}: {
  config: RsvpConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  const [name, setName] = useState('')
  const [count, setCount] = useState(config.countOptions[0] ?? 1)
  const [attendance, setAttendance] = useState<'hadir' | 'absen' | 'ragu'>('hadir')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  if (!config.enabled) return null

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || submitting) return
    setSubmitting(true)
    try {
      await submitRsvp({
        data: {
          invitationId,
          guestName: name.trim(),
          jumlahTamu: Number(count),
          attendance,
        },
      })
      setDone(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <BlockSection
      theme={theme}
      shapeType="arch-pointed"
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
        <p className="font-body-inv text-xs sm:text-sm opacity-80 mb-8 leading-relaxed max-w-[260px] mx-auto">
          {config.helperText}
        </p>
      </Reveal>

      {done ? (
        <Reveal>
          <p className="font-serif-inv italic text-base">
            Terima kasih atas konfirmasinya! 🌸
          </p>
        </Reveal>
      ) : (
        <Reveal variant="up" threshold={0.05}>
          <form
            onSubmit={onSubmit}
            className="w-full max-w-[240px] mx-auto flex flex-col gap-5 text-left"
          >
            <label className="block">
              <span className="font-body-inv text-[10px] tracking-[0.3em] uppercase opacity-60 block mb-1">
                {config.nameLabel}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-slate-300 py-2 focus:outline-none text-sm font-body-inv"
              />
            </label>

            <label className="block">
              <span className="font-body-inv text-[10px] tracking-[0.3em] uppercase opacity-60 block mb-1">
                {config.countLabel}
              </span>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full bg-transparent border-b border-slate-300 py-2 focus:outline-none text-sm font-body-inv"
              >
                {config.countOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="font-body-inv text-[10px] tracking-[0.3em] uppercase opacity-60 block mb-1">
                Konfirmasi Kehadiran
              </span>
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value as 'hadir' | 'absen' | 'ragu')}
                className="w-full bg-transparent border-b border-slate-300 py-2 focus:outline-none text-sm font-body-inv"
              >
                <option value="hadir">Datang</option>
                <option value="absen">Absen</option>
                <option value="ragu">Mungkin</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 self-center border border-slate-700 rounded-full px-10 py-2.5 text-[11px] tracking-[0.22em] uppercase font-body-inv hover:bg-slate-800 hover:text-white transition-all duration-300 disabled:opacity-40"
            >
              {config.submitLabel}
            </button>
          </form>
        </Reveal>
      )}
    </BlockSection>
  )
}
