import { readFileSync, writeFileSync } from 'node:fs'
import { parse, resolve } from 'node:path'
import { cwd, exit } from 'node:process'
import type { ParsedPath } from 'node:path'
import _translate from 'translate'
import fg from 'fast-glob'
import normalizePath from 'normalize-path'

const root = cwd()

interface Options {
  locales?: string
  from?: string
  key?: string
  engine?: 'google' | 'deepl' | 'libre' | 'yandex'
}

export async function translate(options: Options) {
  let {
    locales = './locales',
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

  const glob = `${normalizePath(resolve(root, locales))}/*.json`

  const localesParsedPaths = fg.sync(glob).map(parse)

  if (!localesParsedPaths.length) {
    console.log(`Error: Messages is not detect from ${normalizePath(locales)}/*.json`)
    exit(1)
  }

  if (!from)
    from = localesParsedPaths[0].name

  const fromLocalePath = localesParsedPaths.find(i => i.name === from)
  if (!fromLocalePath) {
    console.log(`Error: From messages '${from}.json' is not defined`)
    exit(1)
  }

  const toLocalesPaths = localesParsedPaths.filter(i => i.name !== from)

  const fromMessages = readMessages(fromLocalePath)

  console.log(`From Messages: ${fromLocalePath.base}\n`)
  console.log('Translate completed:')

  for (const path of toLocalesPaths) {
    const messages = readMessages(path)
    const result = await deepTranslateObjectValues(
      fromMessages,
      messages,
      fromLocalePath.name,
      path.name,
    )
    writeFileSync(`${path.dir}/${path.base}`, JSON.stringify(result, null, 2))
    console.log(`\t${path.base}`)
  }
}

function readMessages(path: ParsedPath) {
  try {
    const msg = readFileSync(`${path.dir}/${path.base}`, 'utf8')
    return JSON.parse(msg || '{}')
  }
  catch (err: any) {
    console.log(`Error: ${err.messages}`)
    exit(1)
  }
}

interface Messages {
  [key: string]: string | Messages
}

async function deepTranslateObjectValues(from: Messages, to: Messages, fromLang: string, toLang: string) {
  const stack = Object.entries(from).map((messages) => {
    return {
      current: to,
      messages,
    }
  })

  for (let i = 0; i < stack.length; i++) {
    const { current, messages } = stack[i]

    const [key, value] = messages

    if (typeof value === 'string') {
      if (!current[key])
        current[key] = await _translate(value, { from: fromLang, to: toLang })
    }
    else {
      if (!current[key])
        current[key] = {}

      Object.entries(value).forEach((messages) => {
        stack.push({
          current: current[key],
          messages,
        } as any)
      })
    }
  }
  return to
}
