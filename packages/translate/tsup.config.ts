import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  external: ['node:fs'],
  format: ['esm', 'cjs'],
  dts: true,
})
