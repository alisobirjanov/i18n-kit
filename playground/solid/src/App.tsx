import './App.css'
import { I18nProvider } from '@i18n-kit/solid'
import type { Options } from '@i18n-kit/solid'

import { Comp } from './Comp'

const messages = {
  en: {
    test: 'Hello { name }',
  },
  uz: {
    test: 'Salom { name }',
  }
}


declare module '@i18n-kit/solid' {
  interface Register {
    messages: typeof messages
    fallbackKey: never
  }
}

const i18nOptions: Options = {
  locale: 'en',
  messages
}



function App() {

  return (
    <div>
      <I18nProvider options={i18nOptions} >

        <Comp />
      </I18nProvider>
    </div>
  )
}

export default App
