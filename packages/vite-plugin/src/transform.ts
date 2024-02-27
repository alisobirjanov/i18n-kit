import MagicString from 'magic-string'
import { deepFlatten } from './utils'

export function transformLocalesJson(code: string, hashFn: (key: string) => string) {
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

export function transformMatchesMessages(code: string, matches: any[], hashFn: (key: string) => string) {
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
