declare module 'virtual:i18n-kit' {
  import ru from 'D:/open-source/ts-starter/playground/locales/ru.json'
	import uz from 'D:/open-source/ts-starter/playground/locales/uz.json'

  declare module '@i18n-kit/vue' {
    interface Register {
      messages: {
        ru: typeof import('D:/open-source/ts-starter/playground/locales/ru.json')
				uz: typeof import('D:/open-source/ts-starter/playground/locales/uz.json')
      }
    }
  }

  export default { ru, uz }
}