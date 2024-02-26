import { cwd } from 'node:process'
import { parse, resolve } from 'node:path'
import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import { normalizePath } from 'vite'
import fg from 'fast-glob'
import { generateDtsFile, generateVirtualModule } from './generate'
import { charCombinations, deepFlatten } from './utils'

const virtualModuleId = 'virtual:i18n-kit'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

const regexp = /\$t\(\s*(["'\`])(.*?)\1\s*(\,.*?)?\)/gm

export default function vitePluginI18n(options: any = {}): Plugin {
  let {
    locales = './locales',
    dts = true,
  } = options

  const localesDir = normalizePath(resolve(cwd(), locales))
  const localesParsedPath = getParsedPaths(`${localesDir}/*.json`)

  if (dts) {
    dts = normalizePath(resolve(cwd(), typeof dts === 'boolean' ? './i18n.d.ts' : dts))
    generateDtsFile(dts, localesParsedPath)
  }

  const hashMap = new Map()
  const nextCombination = charCombinations()

  const hashFn = (key: string) => {
    let hash = hashMap.get(key)
    if (!hash) {
      hash = nextCombination()
      hashMap.set(key, hash)
    }
    return hash
  }

  return {
    enforce: 'pre',
    name: '@i18n-kit/vite-plugin',
    resolveId(id) {
      if (id === virtualModuleId)
        return resolvedVirtualModuleId
    },
    load(id) {
      if (id === resolvedVirtualModuleId)
        return generateVirtualModule(localesParsedPath)
    },
    transform(code: string, id: string) {
      if (id.startsWith(localesDir) && id.endsWith('.json'))
        return transformLocalesJson(code, hashFn)

      const matches = [...code.matchAll(regexp)]

      if (!matches.length)
        return

      return transformMatchesMessages(code, matches, hashFn)
    },
  }
}

function transformLocalesJson(code: string, hashFn: (key: string) => string) {
  try {
    const json = deepFlatten(JSON.parse(code))

    const result = Object.entries(json).reduce((acc: Record<string, string>, [key, value]) => {
      const hash = hashFn(key)
      acc[hash] = value
      return acc
    }, {})
    return {
      code: JSON.stringify(result),
    }
  }
  catch (err) {
    console.log(err)
  }
}

function transformMatchesMessages(code: string, matches: any[], hashFn: (key: string) => string) {
  const s = new MagicString(code)

  for (const match of matches) {
    const key = match[2]
    const hash = hashFn(key)
    const start = match.index!
    const str = match[0].replace(key, hash)
    s.overwrite(start, start + match[0].length, str)
  }

  return {
    code: s.toString(),
  }
}

function getParsedPaths(source: string) {
  return fg.sync(source).map(parse)
}
