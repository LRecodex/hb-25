import { EXPERIENCE_COPY } from '../../config/content'
import { HeartText } from '../ui/HeartText'

export function FinalScene({ onReplay }: { onReplay: () => void }) {
  return (
    <section className="final-scene">
      <div className="final-halo" aria-hidden="true" />
      <div className="floating-sparks" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
      <p className="eyebrow">Twenty-five looks beautiful on you</p>
      <h1 className="final-title"><HeartText text={EXPERIENCE_COPY.finalTitle} /></h1>
      <p className="final-subtitle">{EXPERIENCE_COPY.finalSubtitle}</p>
      <button type="button" className="pill-button" onClick={onReplay}>{EXPERIENCE_COPY.replay}</button>
    </section>
  )
}
