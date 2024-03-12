# i18n-kit
🌐 Lightweight internationalization plugin for Vue.js 3

# 🌟 Features

- i18n resource pre-compilation
- 100% TypeSafe

![image_2024-03-13_00-25-43](https://github.com/alisobirjanov/i18n-kit/assets/80165465/f220c2c5-98bf-4c61-a282-94ef8ab22235)


## Install
```shell
pnpm add @i18n-kit/vue
```

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

## Usage

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
npx i18n-kit --locales path/to/messages --from en 
```
