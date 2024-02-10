import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Unocss from 'unocss/vite'
import transformerVariantGroup from '@unocss/transformer-variant-group'

import vitePluginI18n from '../src/index'

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
  define: {
    'process.env.TEST_Q': 1234,
    // '__DEV__': 'process.env.TEST_Q'
  },
})
