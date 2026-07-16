import { useEffect, useState } from 'react'
import type { GuestbookConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { submitGreeting, listGreetings } from '#/server/invitation-fns'
import { BlockSection } from '#/components/invitation/BlockSection'
import { Reveal } from '#/components/invitation/Reveal'

export function GuestbookBlock({
  config,
  theme,
  invitationId,
}: {
  config: GuestbookConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [attendance, setAttendance] = useState<'hadir' | 'absen' | 'ragu'>('hadir')
  const [submitting, setSubmitting] = useState(false)
  const [greetings, setGreetings] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState({ hadir: 0, absen: 0, ragu: 0 })

  if (!config.enabled) return null

  const fetchGreetings = async (p: number) => {
    try {
      const res = await listGreetings({
        data: { invitationId, page: p, perPage: config.perPage },
      })
      if (p === 1) {
        setGreetings(res.rows)
      } else {
        setGreetings((prev) => [...prev, ...res.rows])
      }
      setTotal(res.total)
      if (p === 1) {
        const c = { hadir: 0, absen: 0, ragu: 0 }
        for (const g of res.rows) {
          if (g.attendance === 'hadir') c.hadir++
          else if (g.attendance === 'absen') c.absen++
          else if (g.attendance === 'ragu') c.ragu++
        }
        setCounts(c)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchGreetings(1) }, [invitationId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || submitting) return
    setSubmitting(true)
    try {
      await submitGreeting({
        data: { invitationId, name: name.trim(), message: message.trim(), attendance },
      })
      setName('')
      setMessage('')
      setPage(1)
      await fetchGreetings(1)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

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
          className="font-display mb-2"
          style={{ fontSize: 'clamp(2.8rem, 10vw, 4rem)' }}
        >
          {config.heading}
        </h2>
        <div className="inv-divider mb-3" />
        <p className="font-body-inv text-xs opacity-75 mb-6 leading-relaxed max-w-[240px] mx-auto">
          {config.subheading}
        </p>

        {/* attendance counters */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="text-center">
            <div className="font-serif-inv text-2xl font-semibold">{counts.hadir}</div>
            <div className="font-body-inv text-[10px] tracking-widest uppercase opacity-70">Hadir</div>
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div className="text-center">
            <div className="font-serif-inv text-2xl font-semibold">{counts.absen}</div>
            <div className="font-body-inv text-[10px] tracking-widest uppercase opacity-70">Tidak hadir</div>
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div className="text-center">
            <div className="font-serif-inv text-2xl font-semibold">{counts.ragu}</div>
            <div className="font-body-inv text-[10px] tracking-widest uppercase opacity-70">Masih Ragu</div>
          </div>
        </div>
      </Reveal>

      <Reveal variant="up" threshold={0.05}>
        <div
          className="w-full max-w-[260px] mx-auto rounded-2xl p-5 mb-6 border border-slate-200 bg-white shadow-sm"
        >
          <form onSubmit={onSubmit} className="flex flex-col gap-4 text-left mb-6">
            <input
              type="text"
              placeholder={config.nameLabel}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none placeholder:text-slate-400 text-sm font-body-inv"
            />
            <textarea
              placeholder={config.messageLabel}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              className="w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none placeholder:text-slate-400 text-sm font-body-inv resize-none"
            />
            <select
              value={attendance}
              onChange={(e) => setAttendance(e.target.value as 'hadir' | 'absen' | 'ragu')}
              className="w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none text-sm font-body-inv text-slate-800"
            >
              <option value="hadir">{config.attendanceOptions[0] ?? 'Datang'}</option>
              <option value="absen">{config.attendanceOptions[1] ?? 'Absen'}</option>
              <option value="ragu">{config.attendanceOptions[2] ?? 'Mungkin'}</option>
            </select>

            <button
              type="submit"
              disabled={submitting}
              className="self-center mt-2 border border-slate-700 rounded-full px-8 py-2 text-[11px] tracking-[0.22em] uppercase font-body-inv hover:bg-slate-800 hover:text-white transition-all duration-300 disabled:opacity-40"
            >
              {config.submitLabel}
            </button>
          </form>

          <div className="text-left">
            <p className="font-body-inv text-[10px] tracking-widest uppercase opacity-60 mb-4">
              {total} Comments
            </p>
            <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
              {greetings.map((g) => (
                <div key={g.id} className="pb-4 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="font-display text-2xl leading-none">
                      {g.name}
                    </strong>
                    {g.attendance === 'hadir' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-body-inv">
                        Hadir
                      </span>
                    )}
                    {g.attendance === 'absen' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 font-body-inv">
                        Absen
                      </span>
                    )}
                    {g.attendance === 'ragu' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 font-body-inv">
                        Ragu
                      </span>
                    )}
                  </div>
                  <p className="font-body-inv text-xs opacity-85 leading-relaxed">
                    {g.message}
                  </p>
                </div>
              ))}
              {greetings.length < total && (
                <button
                  type="button"
                  onClick={() => {
                    const next = page + 1
                    setPage(next)
                    fetchGreetings(next)
                  }}
                  className="font-body-inv text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 py-2 text-center w-full block"
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </BlockSection>
  )
}
