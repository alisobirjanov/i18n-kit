import { readFileSync, writeFileSync } from 'node:fs'

type Obj = Record<string, string | object>

function toJSON(path) {
  path = readFileSync(`${path.dir}/${path.base}`, 'utf8')
  return JSON.parse(path || '{}')
}

export function translate(from, to) {
  from = toJSON(from)
  to.forEach((path) => {
    const result = translateDeep(from, toJSON(path))
    writeFileSync(`${path.dir}/${path.base}`, JSON.stringify(result, null, 2))
  })
}

function translateDeep(from: Obj, to: Obj) {
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
        current[key] = `${value} ru`
    }
    else {
      if (!current[key])
        current[key] = {}

      msg.push(
        ...Object.entries(value).map((item) => {
          return {
            current: current[key],
            item,
          }
        }) as any,
      )
    }
  }
  return to
}
