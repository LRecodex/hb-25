# Birthday cake GLB inspection

The supplied `birthday_cake_with_candles_25.glb` was inspected with `scripts/inspect-glb.mjs` before the candle system was implemented.

- File size: 2.89 MB
- Generator: `THREE.GLTFExporter r184`
- Scene bounds: min `(-0.1635, 0, -0.1635)`, max `(0.1635, 0.288, 0.1635)`
- Nodes / meshes / materials: `387 / 235 / 13`
- Textures: none
- Cameras / animation clips: none
- Built-in candle hierarchy: `number_candles_25 > candle_2` and `number_candles_25 > candle_5`
- Wick nodes: `candle_2_wick`, `candle_5_wick`
- Built-in flame nodes: `candle_2_flame`, `candle_5_flame`
- Built-in materials include `wick`, `flame`, `candle_wax`, `candle_gold_trim`, and `candle_stake`.
- Existing flame meshes are hidden at runtime because they are opaque static geometry. Programmatic flames are rendered from the detected wick anchors instead.

The manually documented fallback flame centers are source-space coordinates:

```ts
[-0.033, 0.272, -0.036]
[0.03225, 0.272, -0.036]
```

The model is presented at a configurable scale of `9.25` in `src/config/cake.ts`; position, rotation, camera distances, and fallback flame coordinates are centralized there.
