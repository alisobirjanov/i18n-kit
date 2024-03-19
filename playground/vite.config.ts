import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Unocss from 'unocss/vite'
import transformerVariantGroup from '@unocss/transformer-variant-group'

// import vitePluginI18n from '@i18n-kit/vite-plugin'
import vitePluginI18n from '../packages/unplugin/src/index'

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
      lazyLoadMessages: true,
      dts: true,
    }),
  ],
})
