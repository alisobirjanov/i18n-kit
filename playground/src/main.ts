import { createApp } from 'vue'
import { createI18n } from '@i18n-kit/vue'
import messages from '@i18n-kit/messages'
import App from './App.vue'
import 'virtual:uno.css'

// const messages = {
//   ru: () => import('../locales/ru.json'),
//   uz: () => import('../locales/uz.json'),
// }

// declare module '@i18n-kit/vue' {
//   interface Register {
//     messages: typeof messages
//   }
// }

const i18n = createI18n({
  locale: 'uz',
  messages,
})

const app = createApp(App)

app.use(i18n)

app.mount('#app')
