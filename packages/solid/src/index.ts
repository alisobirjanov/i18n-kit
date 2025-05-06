import { 
  createSignal,
  createComponent, 
  createContext as createContextSolid,
  useContext
} from 'solid-js'

import { createContext } from '@i18n-kit/core'
import type { Context, Options } from '@i18n-kit/core'

export * from '@i18n-kit/core'

interface Props {
  options: Options
  children: any
}

const I18nContext = createContextSolid<Context>()

const createState = (inntialValue: any) => {
  const [value, setValue] = createSignal(inntialValue)
  return {
    get value() {
      return value()
    },
    set value(value: any) {
      setValue(value)
    }
  }
}

export function I18nProvider(props: Props) {
  const context = createContext(
    props.options,
    createState
  )

  return createComponent(I18nContext.Provider, {
    value: context,
    get children() {
      return props.children()
    }
  })
}


export function useI18n(): Context {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
