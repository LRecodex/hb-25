import { useExperienceStore } from '../../store/experienceStore'

/** Curved breeze streaks, as SVG paths in a 100 × 40 box that's stretched across the cake band. */
const STREAKS = [
  { d: 'M-10 14 C 20 6, 45 22, 70 12 S 100 8, 115 14', delay: 0, width: 0.31 },
  { d: 'M-10 20 C 18 14, 40 28, 66 19 S 98 16, 115 22', delay: 90, width: 0.45 },
  { d: 'M-10 26 C 24 20, 48 32, 72 25 S 100 22, 115 27', delay: 180, width: 0.27 },
  { d: 'M-10 9 C 22 2, 50 15, 76 7 S 102 4, 115 9', delay: 260, width: 0.2 },
  { d: 'M-10 31 C 16 27, 42 37, 68 30 S 96 28, 115 32', delay: 340, width: 0.22 },
  { d: 'M10 17 C 30 12, 52 24, 72 16 C 80 13, 86 12, 90 15 C 94 18, 90 22, 86 20', delay: 220, width: 0.25 },
]

export function WindGust() {
  const wind = useExperienceStore((state) => state.wind)
  const stage = useExperienceStore((state) => state.stage)
  if (!wind || (stage !== 'blowing' && stage !== 'candlesOut')) return null
  return (
    <div key={wind.startedAt} className="wind-gust" aria-hidden="true">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none">
        {STREAKS.map((streak, index) => (
          <path key={index} d={streak.d} pathLength={100} style={{ animationDelay: `${streak.delay}ms`, strokeWidth: streak.width }} />
        ))}
      </svg>
      <div className="wind-gust__sheen" />
    </div>
  )
}
