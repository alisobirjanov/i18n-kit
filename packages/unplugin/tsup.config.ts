import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/vite.ts'],
  clean: true,
  external: ['node:process', 'node:path', 'node:fs', 'vite', 'magic-string', 'fast-glob', 'picomatch'],
  format: ['esm', 'cjs'],
  dts: true,
})
