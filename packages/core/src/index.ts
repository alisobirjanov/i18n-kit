export interface Register {

}

type PickPropertyTypes<T, K> = T extends Record<any, any> ? T[K] : unknown
type AsyncFunction = (...arguments_: any[]) => Promise<unknown>
type AsyncReturnType<Target extends AsyncFunction> = Awaited<ReturnType<Target>>

type Messages<T = Register> = PickPropertyTypes<T, 'messages'>
type Locales = keyof Messages

type FlattenObjectKeys<T, K = keyof T> = K extends string
  ? T extends Record<string, unknown>
    ? T[K] extends Record<string, unknown>
      ? `${K}.${FlattenObjectKeys<T[K]>}`
      : `${K}`
    : never
  : never

export type MessagesFlattenKeys<T = Messages, K = keyof T> = K extends string
  ? T extends Record<string, unknown>
    ? T[K] extends AsyncFunction
      ? FlattenObjectKeys<PickPropertyTypes<AsyncReturnType<T[K]>, 'default'>>
      : FlattenObjectKeys<T[K]>
    : unknown
  : unknown

interface Options {
  locale: Locales
  messages: any
}

export interface Context {
  t: (key: MessagesFlattenKeys) => string
  locale: any
  setLocale: (_locale: Locales) => void
  messages: unknown
}

export function createContext<T extends Options>(options: T, createState: any): Context {
  const {
    locale: defaultLocale,
    messages = {},
  } = options

  const locale = createState('')

  const context: Context = {
    messages,
    locale,
    t(key) {
      return messages[locale.value] ? messages[locale.value][key] : ''
    },
    async setLocale(_locale) {
      const message = messages[_locale]
      if (!message || _locale === locale.value)
        return

      if (typeof message === 'function') {
        const res = await message()
        messages[_locale] = res.default
      }
      locale.value = _locale
    },
  }

  context.setLocale(defaultLocale)

  return context
}
