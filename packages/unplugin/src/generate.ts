import { writeFileSync } from 'node:fs'
import type { ParsedPath } from 'node:path'

export function generateDtsFile(path: string, localesParsedPath: ParsedPath[]) {
  const imports: string[] = []
  const exports: string[] = []
  const types: string[] = []

  localesParsedPath.forEach(({ dir, base, name }) => {
    imports.push(`import ${name} from '${dir}/${base}'`)
    exports.push(`${name}`)
    types.push(`${name}: typeof import('${dir}/${base}')`)
  })

  const dts
    = `declare module '@i18n-kit/messages' {
  ${imports.join('\n\t')}

  declare module '@i18n-kit/vue' {
    interface Register {
      messages: {
        ${types.join('\n\t\t\t\t')}
      }
    }
  }

  export default { ${exports.join(', ')} }
}`
  writeFileSync(path, dts)
}

export function generateVirtualModule(localesParsedPath: ParsedPath[], lazy: boolean = false) {
  let imports = ''
  let exports = ''

  localesParsedPath.forEach(({ dir, base, name }) => {
    const path = `${dir}/${base}`
    if (lazy) {
      exports += `${name}: () => import('${path}'),`
    }
    else {
      imports += `import ${name} from '${path}'\n`
      exports += `${name},`
    }
  })

  return `
  ${imports}
  export default { ${exports} }
  `
}
