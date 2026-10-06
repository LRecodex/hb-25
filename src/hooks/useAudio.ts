import { useCallback, useEffect, useRef } from 'react'
import { AUDIO } from '../config/audio'
import { useExperienceStore } from '../store/experienceStore'

type SoundName = keyof typeof AUDIO

export function useAudio() {
  const muted = useExperienceStore((state) => state.muted)
  const setMuted = useExperienceStore((state) => state.setMuted)
  const tracks = useRef(new Map<SoundName, HTMLAudioElement>())

  const getTrack = useCallback((name: SoundName) => {
    if (!tracks.current.has(name)) {
      const audio = new Audio(AUDIO[name])
      audio.preload = 'auto'
      if (name === 'background') audio.loop = true
      audio.addEventListener('error', () => undefined, { once: true })
      tracks.current.set(name, audio)
    }
    return tracks.current.get(name)!
  }, [])

  const play = useCallback((name: SoundName, volume = 0.5) => {
    if (muted) return
    const audio = getTrack(name)
    audio.volume = volume
    if (name !== 'background') audio.currentTime = 0
    void audio.play().catch(() => undefined)
  }, [getTrack, muted])

  const startMusic = useCallback(() => {
    if (muted) return
    const music = getTrack('background')
    music.volume = 0
    void music.play().then(() => {
      let volume = 0
      const fade = window.setInterval(() => {
        volume = Math.min(0.28, volume + 0.02)
        music.volume = volume
        if (volume >= 0.28) window.clearInterval(fade)
      }, 90)
    }).catch(() => undefined)
  }, [getTrack, muted])

  useEffect(() => {
    tracks.current.forEach((track) => { track.muted = muted })
  }, [muted])

  useEffect(() => () => {
    tracks.current.forEach((track) => track.pause())
  }, [])

  return { muted, setMuted, play, startMusic }
}
