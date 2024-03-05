import { cwd } from 'node:process'
import { parse, resolve } from 'node:path'
import type { Plugin } from 'vite'
import fg from 'fast-glob'
import { normalizePath as _normalizePath } from 'vite'
import picomatch from 'picomatch'
import { charCombinations } from './utils'
import { generateDtsFile, generateVirtualModule } from './generate'
import { transformLocalesJson, transformMatchesMessages } from './transform'
import { translate as _translate } from './translate'

const virtualModuleId = 'virtual:i18n-kit'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

const regexp = /\$t\(\s*(["'\`])(.*?)\1\s*(\,.*?)?\)/g

function normalizePath(path: string) {
  return _normalizePath(resolve(cwd(), path))
}

interface Options {
  locales?: string
  dts?: boolean | string
  translate?: {
    from: string
  }
}

export default function vitePluginI18n(options: Options = {}): Plugin {
  let {
    locales = './locales',
    dts = true,
    translate,
  } = options

  const localesDir = normalizePath(locales)
  const localesGlob = `${localesDir}/*.json`
  const localesParsedPath = fg.sync(localesGlob).map(parse)
  const isMatch = picomatch(localesGlob)
  const localesIdFilter = (id: string) => isMatch(_normalizePath(id))

  if (dts) {
    dts = normalizePath(typeof dts === 'boolean' ? './i18n.d.ts' : dts)
    generateDtsFile(dts, localesParsedPath)
  }

  if (translate) {
    const from = localesParsedPath.find(({ name }) => name === translate?.from)
    const to = localesParsedPath.filter(({ name }) => name !== translate?.from)
    if (from && to.length)
      _translate(from, to)
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
    name: '@i18n-kit/vite-plugin',
    enforce: 'pre',
    resolveId(id) {
      if (id === virtualModuleId)
        return resolvedVirtualModuleId
    },
    load(id) {
      if (id === resolvedVirtualModuleId)
        return generateVirtualModule(localesParsedPath)
    },
    configureServer({ watcher, restart }) {
      const checkReload = (path: string) => {
        if (localesIdFilter(path))
          restart()
      }
      watcher.on('add', checkReload)
      watcher.on('unlink', checkReload)
    },
    transform(code: string, id: string) {
      // root/path/to/locales/*.json
      if (localesIdFilter(id))
        return transformLocalesJson(code, hashFn)

      const matches = [...code.matchAll(regexp)]

      if (!matches.length)
        return

      return transformMatchesMessages(code, matches, hashFn)
    },
  }
}
