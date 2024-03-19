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

export interface Options {
  locale?: Locales
  messages?: Record<string, object>
}

export interface Context {
  t: (key: MessagesFlattenKeys, param?: Record<string, string>) => string
  locale: any
  setLocale: (newLang: Locales) => void
  messages: Record<string, object>
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
      const resource = messages[locale.value]
      if (!resource)
        return ''

      const message = typeof key === 'string' ? getMessage(resource, key) : ''
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

  defaultLocale && context.setLocale(defaultLocale)

  return context
}

function getMessage(messages: any, key: string) {
  return key.split('.').reduce((acc, key) => acc[key] ? acc[key] : '', messages)
}

// https://github.com/Ayub-Begimkulov/i18n/blob/main/src/i18n.ts#L125
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
