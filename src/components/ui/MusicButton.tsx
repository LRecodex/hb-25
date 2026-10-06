export function MusicButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="music-button" onClick={onToggle} aria-label={muted ? 'Unmute music' : 'Mute music'} aria-pressed={muted}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
        {muted ? (
          <path d="M16 9.5l5 5m0-5l-5 5" />
        ) : (
          <>
            <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
            <path d="M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />
          </>
        )}
      </svg>
    </button>
  )
}
