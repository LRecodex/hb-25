# Farah — 25th birthday experience

An interactive React + Vite + TypeScript + React Three Fiber birthday scene built around the supplied `birthday_cake_with_candles_25.glb`.

## Run locally

```bash
npm install
npm run dev
```

Optional audio files can be placed in `public/audio/` using the names in `src/config/audio.ts`. Missing audio is handled silently.

The personal letter lives entirely in `src/config/content.ts`. Model scale, transforms, camera distances, and fallback flame positions live in `src/config/cake.ts`.

The GLB hierarchy and measured bounds are recorded in `docs/GLB-INSPECTION.md`; the inspection helper is `scripts/inspect-glb.mjs`.
