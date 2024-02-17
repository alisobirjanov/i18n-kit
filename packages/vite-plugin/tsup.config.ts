import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  external: ['node:process', 'node:path', 'vite', 'magic-string'],
  format: ['esm', 'cjs'],
  dts: true,
})
