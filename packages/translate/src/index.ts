import { readFileSync, writeFileSync } from 'node:fs'
import { parse, resolve } from 'node:path'
import { cwd } from 'node:process'
import type { ParsedPath } from 'node:path'
import _translate from 'translate'
import fg from 'fast-glob'
import normalizePath from 'normalize-path'

const root = cwd()

interface Options {
  localesPath?: string
  from: string
  key?: string
  engine?: 'google' | 'deepl' | 'libre' | 'yandex'
}

export function translate(options: Options) {
  const {
    localesPath = './locales',
    from,
    key,
    engine,
  } = options

  if (key) {
    // @ts-expect-error
    _translate.key = key
  }
  if (engine) {
    // @ts-expect-error
    _translate.engine = engine
  }

  const glob = `${normalizePath(resolve(root, localesPath))}/*.json`

  const localesParsedPaths = fg.sync(glob).map(parse)

  const fromLocalePath = localesParsedPaths.find(i => i.name === from)
  if (!fromLocalePath) {
    // TODO: log error message
    console.log('Error')
    return
  }
  const toLocalesPaths = localesParsedPaths.filter(i => i.name !== from)

  const fromMessages = toJSON(fromLocalePath)
  toLocalesPaths.forEach(async (path) => {
    const result = await translateDeep(fromMessages, toJSON(path), fromLocalePath.name, path.name)
    writeFileSync(`${path.dir}/${path.base}`, JSON.stringify(result, null, 2))
  })
}

function toJSON(path: ParsedPath) {
  const msg = readFileSync(`${path.dir}/${path.base}`, 'utf8')
  return JSON.parse(msg || '{}')
}

async function translateDeep(from: any, to: any, fromLang: string, toLang: string) {
  const msg = Object.entries(from).map((item) => {
    return {
      current: to,
      item,
    }
  })

  for (let i = 0; i < msg.length; i++) {
    const { current, item } = msg[i]

    const [key, value] = item

    if (typeof value === 'string') {
      if (!current[key])
        current[key] = await _translate(value, { from: fromLang, to: toLang })
    }
    else {
      if (!current[key])
        current[key] = {}

      Object.entries(value as any).forEach((item) => {
        msg.push({
          current: current[key],
          item,
        } as any)
      })
    }
  }
  return to
}
