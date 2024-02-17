import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Unocss from 'unocss/vite'
import transformerVariantGroup from '@unocss/transformer-variant-group'

import vitePluginI18n from 'vite-plugin-i18n'

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
