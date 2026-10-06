/** Swaps the ❤️ emoji for a typographic heart so headings stay in one visual voice. */
export function HeartText({ text }: { text: string }) {
  const parts = text.split(/\s*❤️\s*/)
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && <span className="heart" aria-label="love">{'♥︎'}</span>}
        </span>
      ))}
    </>
  )
}
