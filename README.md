# i18n-kit
🌐 Lightweight internationalization plugin for Vue.js 3

# 🌟 Features

- i18n resource pre-compilation
- 100% TypeSafe
- Lightweight

![Скриншот 18-03-2024 221124](https://github.com/alisobirjanov/i18n-kit/assets/80165465/55df9b46-9b3e-4373-9560-b6ea36bc7958)


## Install
```shell
pnpm add @i18n-kit/vue
```

## Usage

```ts
// main.ts
import { createApp } from 'vue'
import { createI18n } from '@i18n-kit/vue'

import uz from '../locales/uz.json'
import en from '../locales/en.json'

const messages = {
  uz,
  en,
}

const i18n = createI18n({
  locale: 'uz',
  messages,
})

const app = createApp(App)

app.use(i18n)

app.mount('#app')
```

```html
// App.vue
<template>
  <div>
    <h3>
      {{ $t('message.hello') }}
    </h3>
  </div>
</template>
```

## Unplugin
```shell
pnpm add @i18n-kit/unplugin
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import i18nPlugin from '@i18n-kit/unplugin/vite'

export default defineConfig({
  plugins: [
    i18nPlugin({ /* options */ }),
  ],
})
```

## Usage

```json
// ./locales/en.json
{
  "message": {
    "hello": "Hello World",
    "foo": "bar"
  },
  "test": "Test Message"
}
```
```html
// App.vue
<template>
  <div>
    {{ $('test') }}
    <h3>
      {{ $t('message.hello') }}
    </h3>
  </div>
</template>
```

Will be transformed to:

```json
// ./locales/en.json
{
  "a": "Hello World",
  "b": "bar",
  "c": "Test Message"
}
```

```html
// App.vue
<template>
  <div>
    {{ $('c') }}
    <h3>
      {{ $t('a') }}
    </h3>
  </div>
</template>
```

@i18n-kit/unplugin can use the bundler virtual mechanism to import all locales at once, using the special identifier @i18n-kit/messages, as the bellow:

```ts
// main.ts
import { createApp } from 'vue'
import { createI18n } from '@i18n-kit/vue'

import messages from '@i18n-kit/messages'

const i18n = createI18n({
  locale: 'uz',
  messages,
})

const app = createApp(App)

app.use(i18n)

app.mount('#app')
```

## Options


```ts
i18nPlugin({
 ...
})

interface KeepOption {
  /**
   * Path to i18n resources
   * @default './locales'
   */
  locales?: string
  /**
   * Path to generated .d.ts file
   * @default false
   */
  dts?: boolean | string

  /**
   * Lazy load i18n resources
   * @default false
   */
  lazyLoadMessages?: boolean
}
```
## Translate
```shell
npx @i18n-kit/translate --locales path/to/messages --from en 
```
