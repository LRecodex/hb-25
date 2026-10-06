import fs from 'node:fs'
import path from 'node:path'

const input = process.argv[2]
if (!input) throw new Error('Usage: node scripts/inspect-glb.mjs <model.glb>')
const buffer = fs.readFileSync(input)
if (buffer.readUInt32LE(0) !== 0x46546c67) throw new Error('Not a binary glTF file')
const jsonLength = buffer.readUInt32LE(12)
const json = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8'))
const materials = json.materials ?? []
const meshes = json.meshes ?? []
const nodes = json.nodes ?? []

console.log(`File: ${path.resolve(input)} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`)
console.log(`Generator: ${json.asset?.generator ?? 'unknown'}`)
console.log(`Scenes: ${json.scenes?.length ?? 0}; Nodes: ${nodes.length}; Meshes: ${meshes.length}; Materials: ${materials.length}`)
console.log(`Cameras: ${json.cameras?.length ?? 0}; Animations: ${json.animations?.length ?? 0}; Textures: ${json.textures?.length ?? 0}`)
console.log(`Extensions used: ${(json.extensionsUsed ?? []).join(', ') || 'none'}`)
console.log('\nMaterials:')
materials.forEach((m, index) => console.log(`  [${index}] ${m.name || '(unnamed)'}`))

const roots = new Set(json.scenes?.flatMap((scene) => scene.nodes ?? []) ?? [])
const visit = (index, depth = 0) => {
  const node = nodes[index]
  const mesh = node.mesh == null ? undefined : meshes[node.mesh]
  const materialNames = mesh?.primitives
    ?.map((primitive) => materials[primitive.material]?.name ?? `material:${primitive.material}`)
    .join(', ')
  const transform = [
    node.matrix ? `m=${node.matrix.map((n) => Number(n.toFixed(5))).join(',')}` : '',
    node.translation ? `t=${node.translation.map((n) => Number(n.toFixed(5))).join(',')}` : '',
    node.rotation ? `r=${node.rotation.map((n) => Number(n.toFixed(5))).join(',')}` : '',
    node.scale ? `s=${node.scale.map((n) => Number(n.toFixed(5))).join(',')}` : '',
  ].filter(Boolean).join(' ')
  console.log(`${'  '.repeat(depth)}- [${index}] ${node.name || '(unnamed)'}${mesh ? ` | mesh:${node.mesh} ${mesh.name || ''}` : ''}${materialNames ? ` | ${materialNames}` : ''}${transform ? ` | ${transform}` : ''}`)
  node.children?.forEach((child) => visit(child, depth + 1))
}

console.log('\nHierarchy:')
roots.forEach((index) => visit(index))

console.log('\nInteraction anchors (local mesh bounds):')
nodes.forEach((node, index) => {
  if (!/(wick|flame|candle_[25]$)/i.test(node.name ?? '') || node.mesh == null) return
  const mesh = meshes[node.mesh]
  const positions = mesh.primitives
    .map((primitive) => json.accessors?.[primitive.attributes?.POSITION])
    .filter(Boolean)
  const min = [0, 1, 2].map((axis) => Math.min(...positions.map((accessor) => accessor.min?.[axis] ?? Infinity)))
  const max = [0, 1, 2].map((axis) => Math.max(...positions.map((accessor) => accessor.max?.[axis] ?? -Infinity)))
  const center = min.map((value, axis) => (value + max[axis]) / 2)
  console.log(`  [${index}] ${node.name}: min=${min.map((n) => n.toFixed(5))} max=${max.map((n) => n.toFixed(5))} center=${center.map((n) => n.toFixed(5))}`)
})
