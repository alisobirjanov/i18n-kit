import { inject, ref } from 'vue'
import type { App } from 'vue'

type Messages<T> = T extends Record<string, unknown> ? T['messages'] : unknown

type Locale<T> = T extends Record<string, unknown> ? T['locale'] : unknown

type CurrentMessage<T, K = Locale<T>> = T extends Record<string, unknown> ? K extends string ? T[K] : unknown : unknown

interface Options<T> {
  locale: keyof Messages<T>
  messages: Messages<T>
}

interface Context<T extends Options<T>> {
  t: (key: FlattenObjectKeys<CurrentMessage<Messages<T>, Locale<T>>>) => string
  locale: any
  setLocale: (_locale: any) => void
}

function createContext<M extends Options<M>>(options: M): Context<M> {
  const {
    locale: defaultLocale = '',
    messages = {},
  } = options

  const locale = ref(defaultLocale)

  const context: Context<M> = {
    locale,
    t(key) {
      return messages[locale.value] ? messages[locale.value][key] : ''
    },
    setLocale(_locale) {
      locale.value = _locale
    },
  }

  return context
}

export function createI18n(options: any = {}) {
  const context = createContext(options)

  return {
    install(app: App) {
      app.provide('context', context)
      app.config.globalProperties.$t = context.t
    },
  }
}

export function useI18n(options: any = {}) {
  return inject('context') || createContext(options)
}

const foo = {
  test: 'true',
  a: {
    b: {
      c: 'test',
      g: {
        e: 'e',
        f: {
          k: 'k',
        },
      },
    },
    d: 'd',
  },
}

const { t, setLocale } = createContext({
  messages: {
    ru: {
      foo,
    },
    uz: {
      foo,
    },
  },
  locale: 'uz',
})

t('foo.a.b.g.e')
setLocale('ru')

type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
  > = Key extends string ? T extends Record<string, unknown>
    ? T[Key] extends Record<string, unknown>
      ? `${Key}.${FlattenObjectKeys<T[Key]>}`
      : `${Key}`
    : never : never
