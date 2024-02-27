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
  t: (key: MessagesFlattenKeys, param?: any) => string
  locale: any
  setLocale: (newLang: Locales) => void
  messages: unknown
}

export function createContext(options: Options, createState: any): Context {
  const {
    locale: defaultLocale,
    messages = {},
  } = options

  const locale = createState('')

  const context: Context = {
    messages,
    locale,
    t(key, param) {
      const message = messages[locale.value] ? messages[locale.value][key] : ''
      if (!param)
        return message
      return interpolateTranslation(message, param)
    },
    async setLocale(newLocale) {
      const message = messages[newLocale]
      if (!message || newLocale === locale.value)
        return

      if (typeof message === 'function') {
        const res = await message()
        messages[newLocale] = res.default
      }
      locale.value = newLocale
    },
  }

  context.setLocale(defaultLocale)

  return context
}

const mustacheParamRegex = /\{\{\s*([a-zA-Z10-9]+)\s*\}\}/g

// not the most performant way, but it should be okay
function interpolateTranslation(
  translation: string,
  params: Record<string, string | number>,
) {
  return translation.replace(mustacheParamRegex, (original, paramKey) => {
    if (paramKey in params)
      return String(params[paramKey])

    return original
  })
}
