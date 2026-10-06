import { useState } from 'react'
import { birthdayLetter } from '../../config/content'
import { HeartText } from '../ui/HeartText'
import { BirthdayLetter } from './BirthdayLetter'

export function WebGLFallback() {
  const [open, setOpen] = useState(false)
  if (open) return <BirthdayLetter onFinish={() => setOpen(false)} />
  return (
    <main className="webgl-fallback">
      <span className="eyebrow">For {birthdayLetter.recipient}</span>
      <h1 className="final-title"><HeartText text="Happy 25th Birthday, Farah ❤️" /></h1>
      <p className="final-subtitle">A little magic is still waiting for you.</p>
      <button type="button" className="pill-button" onClick={() => setOpen(true)}>Open your letter</button>
    </main>
  )
}
