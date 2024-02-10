import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import { variationsChars } from './utils'

const regexp = /\$t\(\s*(["'\`])(.*?)\1\s*(\,.*?)?\)/gm

export default function vitePluginI18n(options: any = {}): Plugin {
  const {
    locales = './locales',
  } = options

  const localesDir = resolve(process.cwd(), locales).split('\\').join('-')

  const localesMap = new Map()

  const hashFn = variationsChars()

  return {
    enforce: 'pre',
    name: 'vite-plugin-i18n',
    transform(code: string, id: string) {
      id = id.split('/').join('-')
      if (id.startsWith(localesDir) && id.endsWith('.json')) {
        try {
          const json = deepFlatten(JSON.parse(code))
          const result = Object.entries(json).reduce((acc, [key, value]) => {
            let hash = localesMap.get(key)
            if (!hash) {
              hash = hashFn()
              localesMap.set(key, hash)
            }
            acc[hash] = value
            return acc
          }, {})
          console.log(1)
          return {
            code: JSON.stringify(result),
          }
        }
        catch (err) {
          console.log(err)
        }
      }
      const matches = [...code.matchAll(regexp)]
      if (!matches.length)
        return

      const s = new MagicString(code)

      for (const match of matches) {
        const key = match[2]
        const hash = localesMap.get(key)
        console.log(key, hash, localesMap.keys())
        if (hash) {
          const start = match.index!
          s.overwrite(start + 1, start + key.length - 1, hash)
        }
      }
      console.log(2)
      return {
        code: s.toString(),
      }
    },
  }
}

interface Locales {
  [key: string]: string | Locales
}

function deepFlatten(locales: Locales) {
  const map = {}
  const objEntries = [...Object.entries(locales)]

  for (let i = 0; i < objEntries.length; i++) {
    const [key, value] = objEntries[i]

    if (typeof value === 'string') {
      map[key] = value
    }
    else {
      // @ts-expect-error
      objEntries.push(...Object.entries(value).map(([k, v]) => {
        return [`${key}.${k}`, v]
      }))
    }
  }

  return map
}
