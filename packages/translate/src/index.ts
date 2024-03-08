import { readFileSync, writeFileSync } from 'node:fs'
import _translate from 'translate'

type Obj = Record<string, string | object>

function toJSON(path) {
  path = readFileSync(`${path.dir}/${path.base}`, 'utf8')
  return JSON.parse(path || '{}')
}

export function translate(from, to) {
  from = toJSON(from)
  to.forEach(async (path) => {
    const result = await translateDeep(from, toJSON(path), from.name, path.name)
    writeFileSync(`${path.dir}/${path.base}`, JSON.stringify(result, null, 2))
  })
}

async function translateDeep(from: Obj, to: Obj, fromLang: string, toLang: string) {
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

      Object.entries(value).forEach((item) => {
        msg.push({
          current: current[key],
          item,
        } as any)
      })
    }
  }
  return to
}
