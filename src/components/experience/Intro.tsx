import { EXPERIENCE_COPY } from '../../config/content'
import { HeartText } from '../ui/HeartText'

export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="intro-panel" aria-label="Birthday introduction">
      <p className="intro-kicker">{EXPERIENCE_COPY.introMystery}</p>
      <h1 className="intro-title"><HeartText text={EXPERIENCE_COPY.introBirthday} /></h1>
      <button className="pill-button begin-button" type="button" onClick={onBegin}>
        <span>{EXPERIENCE_COPY.begin}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
      </button>
    </section>
  )
}
