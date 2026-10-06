import { useProgress } from '@react-three/drei'
import { useEffect } from 'react'
import { birthdayLetter, EXPERIENCE_COPY } from '../../config/content'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function LoadingScreen({ onReady }: { onReady: () => void }) {
  const { progress } = useProgress()
  useEffect(() => {
    if (progress >= 100) onReady()
  }, [progress, onReady])
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f4b6c2" />
              <stop offset="100%" stopColor="#f1d7a6" />
            </linearGradient>
          </defs>
          <circle className="ring-track" cx="60" cy="60" r={RADIUS} />
          <circle
            className="ring-fill"
            cx="60"
            cy="60"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - Math.max(3, progress) / 100)}
          />
        </svg>
        <span className="loading-monogram">{birthdayLetter.recipient.charAt(0)}</span>
      </div>
      <p>{EXPERIENCE_COPY.loading}</p>
      <small>{Math.round(progress)}%</small>
    </div>
  )
}
