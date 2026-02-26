import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const targetDir = resolve(process.cwd(), '..', 'portal')

if (!existsSync(distDir)) {
  console.error('Nothing to copy. Did you run `vite build` first?')
  process.exit(1)
}

rmSync(targetDir, { recursive: true, force: true })
mkdirSync(targetDir, { recursive: true })
cpSync(distDir, targetDir, { recursive: true })

console.log(`Portal artifacts synced to ${targetDir}`)
