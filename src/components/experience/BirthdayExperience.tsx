import { useCallback, useEffect, useRef } from 'react'
import { EXPERIENCE_COPY } from '../../config/content'
import { useAudio } from '../../hooks/useAudio'
import { useBlowCandles } from '../../hooks/useBlowCandles'
import { useExperienceSequence } from '../../hooks/useExperienceSequence'
import { useExperienceStore } from '../../store/experienceStore'
import { HeartText } from '../ui/HeartText'
import { LoadingScreen } from '../ui/LoadingScreen'
import { MusicButton } from '../ui/MusicButton'
import { BirthdayLetter } from './BirthdayLetter'
import { BirthdayScene } from './BirthdayScene'
import { FinalScene } from './FinalScene'
import { Intro } from './Intro'
import { WindGust } from './WindGust'

export function BirthdayExperience() {
  const stage = useExperienceStore((state) => state.stage)
  const setStage = useExperienceStore((state) => state.setStage)
  const beginEnvelopeOpen = useExperienceStore((state) => state.beginEnvelopeOpen)
  const opening = useExperienceStore((state) => state.envelopeOpening)
  const resetWish = useExperienceStore((state) => state.resetWish)
  const { muted, setMuted, play, startMusic } = useAudio()
  const modelReady = useRef(false)
  const loadingReady = useRef(false)
  useExperienceSequence()

  const revealWhenReady = useCallback(() => {
    loadingReady.current = true
    if (modelReady.current) setStage('intro')
  }, [setStage])
  const modelDidLoad = useCallback(() => {
    modelReady.current = true
    if (loadingReady.current) setStage('intro')
  }, [setStage])
  const wind = useExperienceStore((state) => state.wind)
  const blow = useBlowCandles(useCallback(() => play('wind', 0.5), [play]))

  useEffect(() => {
    if (stage === 'candlesOut') play('extinguish', 0.45)
    if (stage === 'magic') play('magic', 0.5)
    if (stage === 'letter') play('letter', 0.42)
  }, [stage, play])

  const begin = () => {
    startMusic()
    setStage('cakeReveal')
  }

  const openEnvelope = () => {
    if (opening) return
    beginEnvelopeOpen()
  }

  return (
    <main className={`experience stage-${stage}`}>
      <div className="backdrop" aria-hidden="true"><i /><i /></div>
      <BirthdayScene onReady={modelDidLoad} />
      <div className="vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      {stage === 'loading' && <LoadingScreen onReady={revealWhenReady} />}
      {stage === 'intro' && <Intro onBegin={begin} />}

      {stage === 'cakeReveal' && (
        <>
          <div className="scene-caption">
            <span className="eyebrow">A little light, just for you</span>
            <strong className="display">Happy Birthday, <em>Farah</em></strong>
          </div>
          <p className="orbit-hint"><OrbitIcon />{EXPERIENCE_COPY.orbitHint}</p>
        </>
      )}
      {stage === 'wish' && (
        <div className="scene-caption">
          <span className="eyebrow">Close your eyes</span>
          <strong className="display"><HeartText text={EXPERIENCE_COPY.wish} /></strong>
        </div>
      )}
      {stage === 'blowing' && (
        <div className={`blow-controls ${wind ? 'is-blowing' : ''}`}>
          <button type="button" className="pill-button blow-button" onClick={blow} disabled={Boolean(wind)}>
            <WindIcon />
            <span>{EXPERIENCE_COPY.blowButton}</span>
          </button>
          <p className="orbit-hint orbit-hint--inline"><OrbitIcon />{EXPERIENCE_COPY.orbitHint}</p>
        </div>
      )}
      {stage === 'candlesOut' && <div className="quiet-moment"><span>your wish is on its way…</span></div>}
      {stage === 'magic' && (
        <div className="scene-caption scene-caption--soft">
          <strong className="display display--sm">Some wishes find their way back to you</strong>
        </div>
      )}
      {stage === 'envelope' && (
        <button className={`envelope-prompt ${opening ? 'is-opening' : ''}`} type="button" onClick={openEnvelope}>
          <strong className="display"><HeartText text={EXPERIENCE_COPY.envelope} /></strong>
          <span className="pill-button">{EXPERIENCE_COPY.open}</span>
        </button>
      )}
      {stage === 'letter' && <BirthdayLetter onFinish={() => setStage('final')} />}
      {stage === 'final' && <FinalScene onReplay={resetWish} />}

      <WindGust />
      {stage !== 'loading' && <MusicButton muted={muted} onToggle={() => setMuted(!muted)} />}
      {stage !== 'loading' && <div className="safe-corner" aria-hidden="true">F <span>·</span> 25</div>}
    </main>
  )
}

function WindIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8h10.5a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h15.5a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h7" />
    </svg>
  )
}

function OrbitIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="9" ry="4" />
      <path d="M17.5 6.5 21 8l-1.2 3.4" />
    </svg>
  )
}
