import { birthdayLetter } from '../../config/content'
import { HeartText } from '../ui/HeartText'

export function BirthdayLetter({ onFinish }: { onFinish: () => void }) {
  return (
    <section className="letter-stage" aria-label={`Birthday letter for ${birthdayLetter.recipient}`}>
      <article className="letter-paper">
        <div className="wax-seal" aria-hidden="true">{birthdayLetter.recipient.charAt(0)}</div>
        <p className="letter-to">For {birthdayLetter.recipient}</p>
        <h1><HeartText text={birthdayLetter.title} /></h1>
        <div className="letter-rule" aria-hidden="true"><span>✦</span></div>
        <div className="letter-copy">
          {birthdayLetter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <div className="letter-closing">
          <strong><HeartText text={birthdayLetter.closing} /></strong>
          <span>{birthdayLetter.signature}</span>
        </div>
        <button type="button" className="pill-button pill-button--ink letter-continue" onClick={onFinish}>One more little wish</button>
      </article>
    </section>
  )
}
