import { getLanguageToPluralFn, getPluralForm } from './plural'
import { getMessage, interpolateTranslation } from './utils'

import type { PluralRules } from './plural'

export interface Register {

}

type PickPropertyTypes<T, K> = T extends Record<any, any> ? T[K] : unknown
type AsyncFunction = (...arguments_: any[]) => Promise<unknown>
type AsyncReturnType<Target extends AsyncFunction> = Awaited<ReturnType<Target>>

type Messages<T = Register> = PickPropertyTypes<T, 'messages'>
type Locales = keyof Messages | (string & {})

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
  pluralRules?: PluralRules
  locale?: Locales
  messages?: Record<string, object>
}


export interface Context {
  t: (key: MessagesFlattenKeys, param?: Record<string, string | number>) => string
  locale: any
  setLocale: (newLang: Locales) => void
  messages: Record<string, object>
}

export function createContext(options: Options, createState: any): Context {
  const {
    locale: defaultLocale,
    messages = {},
    pluralRules
  } = options

  const locale = createState(defaultLocale || '')

  const languageToFn = pluralRules ? getLanguageToPluralFn(pluralRules) : {}

  const context: Context = {
    messages,
    locale,
    t(key, param) {
      const resource = messages[locale.value]
      if (!resource)
        return key

      let message = typeof key === 'string' ? getMessage(resource, key) : key

      if (!param) {
        return message
      }

      const pluralFn = languageToFn[locale.value]

      if(pluralFn && typeof param.count === 'number') {
        message = getPluralForm(pluralFn, message, param.count)
      }

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

  return context
}
