export const AUDIO = {
  background: new URL('audio/background.mp3', document.baseURI).toString(),
  wind: new URL('audio/wind.mp3', document.baseURI).toString(),
  extinguish: new URL('audio/extinguish.mp3', document.baseURI).toString(),
  magic: new URL('audio/magic.mp3', document.baseURI).toString(),
  letter: new URL('audio/letter-open.mp3', document.baseURI).toString(),
} as const
