import { useEffect } from 'react'
import { type ExperienceStage, useExperienceStore } from '../store/experienceStore'

const AUTO_TRANSITIONS: Partial<Record<ExperienceStage, { after: number; to: ExperienceStage }>> = {
  cakeReveal: { after: 7000, to: 'wish' },
  wish: { after: 2300, to: 'blowing' },
  candlesOut: { after: 1800, to: 'magic' },
  magic: { after: 5000, to: 'envelope' },
}

export function useExperienceSequence() {
  const stage = useExperienceStore((state) => state.stage)
  const flameHealth = useExperienceStore((state) => state.flameHealth)
  const envelopeOpening = useExperienceStore((state) => state.envelopeOpening)
  const setStage = useExperienceStore((state) => state.setStage)

  useEffect(() => {
    const transition = AUTO_TRANSITIONS[stage]
    if (!transition) return
    const timer = window.setTimeout(() => setStage(transition.to), transition.after)
    return () => window.clearTimeout(timer)
  }, [stage, setStage])

  // Keyed on a boolean so later state updates after the last candle goes out don't cancel the transition.
  const allOut = flameHealth.every((health) => health <= 0)
  useEffect(() => {
    if (stage !== 'blowing' || !allOut) return
    const timer = window.setTimeout(() => setStage('candlesOut'), 520)
    return () => window.clearTimeout(timer)
  }, [allOut, stage, setStage])

  useEffect(() => {
    if (!envelopeOpening || stage !== 'envelope') return
    const timer = window.setTimeout(() => setStage('letter'), 1650)
    return () => window.clearTimeout(timer)
  }, [envelopeOpening, stage, setStage])
}
