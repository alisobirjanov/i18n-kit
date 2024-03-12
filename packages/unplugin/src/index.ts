import { cwd } from 'node:process'
import { parse, resolve } from 'node:path'
import type { Plugin } from 'vite'
import fg from 'fast-glob'
import { normalizePath as _normalizePath } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import type { FilterPattern } from '@rollup/pluginutils'
import { charCombinations } from './utils'
import { generateDtsFile, generateVirtualModule } from './generate'
import { transformLocalesJson, transformMatchesMessages } from './transform'

const virtualModuleId = '@i18n-kit/messages'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

const regexp = /[$]?t\(\s*(["'\`])(.*?)\1\s*(\,.*?)?\)/g

function normalizePath(path: string) {
  return _normalizePath(resolve(cwd(), path))
}

interface Options {
  locales?: string
  dts?: boolean | string
  include?: FilterPattern
  exclude?: FilterPattern
  lazyLoadMessages?: boolean
}

export default function vitePluginI18n(options: Options = {}): Plugin {
  let {
    locales = './locales',
    dts = true,
    include = [/\.[cm]?[jt]sx|vue?$/],
    exclude = [],
    lazyLoadMessages = false,
  } = options

  // TODO: refactor this code
  exclude = Array.isArray(exclude) ? [...exclude, /node_modules/] : [exclude, /node_modules/]
  const idFilter = createFilter(include, exclude)

  const localesDir = normalizePath(locales)
  const localesGlob = `${localesDir}/*.json`
  const localesParsedPath = fg.sync(localesGlob).map(parse)
  const isMatch = createFilter(localesGlob)
  const localesIdFilter = (id: string) => isMatch(_normalizePath(id))

  if (dts) {
    dts = normalizePath(typeof dts === 'boolean' ? './i18n.d.ts' : dts)
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
    name: '@i18n-kit/unplugin',
    enforce: 'pre',
    resolveId(id) {
      if (id === virtualModuleId)
        return resolvedVirtualModuleId
    },
    load(id) {
      if (id === resolvedVirtualModuleId)
        return generateVirtualModule(localesParsedPath, lazyLoadMessages)
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

      if (!idFilter(id))
        return
      const matches = [...code.matchAll(regexp)]

      if (!matches.length)
        return

      return transformMatchesMessages(code, matches, hashFn)
    },
  }
}
