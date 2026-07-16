import { useState, useEffect, useRef } from 'react'
import type { SplashCoverConfig, ThemeStyleConfig } from '#/lib/blocks/types'
import { BlockSection } from '#/components/invitation/BlockSection'

export function SplashCoverBlock({
  config,
  theme,
  guestName,
}: {
  config: SplashCoverConfig
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  const [opened, setOpened] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const cover = config.coverPhoto ?? theme.sampul.coverPhoto
  const name = config.name || ''
  const dearName = guestName?.trim() || config.greetingDefault

  // Kunci scroll body jika undangan belum dibuka
  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      // Pastikan saat undangan dibuka, posisinya scroll selalu kembali ke atas sekali saja
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return () => {
      document.body.style.overflow = 'auto' // cleanup jika komponen di-unmount
    }
  }, [opened])

  const handleOpenInvitation = () => {
    setOpened(true)
    if (audioRef.current) {
      audioRef.current.volume = 0.5 // Volume 50% sesuai instruksi
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error)
    }
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/riqqa-assets/audio.m4a" loop />

      {opened && (
        <button
          onClick={toggleAudio}
          className="music-toggle"
          aria-label="Toggle Music"
        >
          {isPlaying ? (
            // Ikon Pause/Music On
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          ) : (
            // Ikon Play/Music Off
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 3 18 18"></path>
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          )}
        </button>
      )}

      <div
        className={`fixed inset-0 z-50 transition-all duration-1000 ${opened ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
      >
        <BlockSection
          theme={theme}
          backgroundImage={cover}
          darkOverlay={true}
          shapeType="none" // Splash screen full background image, no shape overlay
          textColor="#ffffff"
          frames="none"
        >
          <div className="flex flex-col items-center gap-3 w-full">
            {name && (
              <h1
                className="font-display text-6xl sm:text-7xl leading-none mb-1 drop-shadow-lg"
              >
                {name}
              </h1>
            )}

            <div className="w-12 h-px bg-white/50 my-2" />

            <p className="font-body-inv text-[10px] tracking-[0.35em] uppercase opacity-80 mb-0.5 drop-shadow-sm">
              Dear
            </p>
            <p
              className="font-display text-4xl sm:text-5xl leading-tight mb-8 drop-shadow-lg"
            >
              {dearName}
            </p>

            <button
              type="button"
              onClick={handleOpenInvitation}
              className="font-body-inv border border-white/80 bg-white/10 backdrop-blur-sm rounded-full px-10 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              {config.openButtonLabel}
            </button>
          </div>
        </BlockSection>
      </div>
    </>
  )
}
