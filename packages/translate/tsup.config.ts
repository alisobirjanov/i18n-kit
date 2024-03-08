import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  clean: true,
  external: ['node:fs', 'node:process', 'node:path'],
  format: ['esm', 'cjs'],
  dts: true,
})
