import { useMemo } from 'react'
import { BirthdayExperience } from './components/experience/BirthdayExperience'
import { WebGLFallback } from './components/experience/WebGLFallback'

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGL2RenderingContext && canvas.getContext('webgl2')) || Boolean(canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const available = useMemo(supportsWebGL, [])
  return available ? <BirthdayExperience /> : <WebGLFallback />
}
