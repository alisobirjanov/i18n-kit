import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Unocss from 'unocss/vite'
import transformerVariantGroup from '@unocss/transformer-variant-group'

import vitePluginI18n from '@i18n-kit/vite-plugin'

export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      transformers: [
        transformerVariantGroup(),
      ],
    }),
    vitePluginI18n({
      locales: './locales',
    }),
  ],
})
