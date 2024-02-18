import { createApp } from 'vue'
import { createI18n } from '@i18n-kit/vue'
import uz from '../locales/uz.json'
import App from './App.vue'
import 'virtual:uno.css'

const i18n = createI18n({
  locale: 'uz',
  messages: { uz },
})

const app = createApp(App)

app.use(i18n)

app.mount('#app')
