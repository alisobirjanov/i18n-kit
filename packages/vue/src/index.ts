import { inject, ref } from 'vue'
import type { App } from 'vue'
import { createContext } from '@i18n-kit/core'
import type { Context, MessagesFlattenKeys, Options } from '@i18n-kit/core'

export * from '@i18n-kit/core'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: MessagesFlattenKeys, param?: Record<string, string>) => string
  }
}

export function createI18n(options: Options = {}) {
  const context = createContext(options, ref)

  return {
    context,
    install(app: App) {
      app.provide('context', context)
      app.config.globalProperties.$t = context.t
    },
  }
}

export function useI18n(options: Options = {}): Context {
  return inject<Context>('context') || createContext(options, ref)
}
