import { create } from 'zustand'

export type ExperienceStage =
  | 'loading'
  | 'intro'
  | 'cakeReveal'
  | 'wish'
  | 'blowing'
  | 'candlesOut'
  | 'magic'
  | 'envelope'
  | 'letter'
  | 'final'

/** A gust started at `startedAt` (ms, Date.now()). `direction` is screen-space: +1 blows left → right. */
export type WindGust = {
  startedAt: number
  direction: 1 | -1
}

type ExperienceState = {
  stage: ExperienceStage
  flameHealth: number[]
  wind: WindGust | null
  envelopeOpening: boolean
  muted: boolean
  setStage: (stage: ExperienceStage) => void
  setMuted: (muted: boolean) => void
  startGust: () => boolean
  extinguish: (index: number) => void
  beginEnvelopeOpen: () => void
  resetWish: () => void
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  stage: 'loading',
  flameHealth: [1, 1],
  wind: null,
  envelopeOpening: false,
  muted: false,
  setStage: (stage) => set({ stage }),
  setMuted: (muted) => set({ muted }),
  startGust: () => {
    const { stage, wind } = get()
    if (stage !== 'blowing' || wind) return false
    set({ wind: { startedAt: Date.now(), direction: 1 } })
    return true
  },
  extinguish: (index) => set((state) => {
    if (state.stage !== 'blowing') return state
    return { flameHealth: state.flameHealth.map((health, i) => (i === index ? 0 : health)) }
  }),
  beginEnvelopeOpen: () => set({ envelopeOpening: true }),
  resetWish: () => set({
    stage: 'wish',
    flameHealth: [1, 1],
    wind: null,
    envelopeOpening: false,
  }),
}))
