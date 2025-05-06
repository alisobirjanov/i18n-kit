import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  external: ['vue'],
  format: ['esm', 'cjs'],
  dts: true
})
