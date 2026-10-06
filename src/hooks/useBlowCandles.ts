import { useCallback, useEffect, useRef } from 'react'
import { GUST } from '../components/experience/wind'
import { useExperienceStore } from '../store/experienceStore'

/** Returns a handler that sends one gust across the cake and puts the candles out in turn. */
export function useBlowCandles(onGust?: () => void) {
  const startGust = useExperienceStore((state) => state.startGust)
  const extinguish = useExperienceStore((state) => state.extinguish)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  return useCallback(() => {
    if (!startGust()) return
    onGust?.()
    timers.current = GUST.extinguishAt.map((at, index) => window.setTimeout(() => extinguish(index), at))
  }, [startGust, extinguish, onGust])
}
