import { cac } from 'cac'
import { translate } from './index'

const cli = cac('i18n-kit')

cli
  .option('--locales <locales>', 'Choose a locales path')
  .option('--from <from>', 'Choose a from lang')
  .option('--engine <engine>', 'Choose a engine')
  // TODO: another way to get secret kay
  .option('--key <key>', 'Choose a secret key')

interface ParsedData {
  options: {
    locales?: string
    from?: string
    engine?: string
    key?: string
  }
}

const { options } = cli.parse() as ParsedData

const resolvedOption: any = {}

if (options.locales)
  resolvedOption.locales = options.locales

if (options?.from)
  resolvedOption.from = options?.from

if (options.engine)
  resolvedOption.engine = options.engine

if (options.key)
  resolvedOption.key = options.key

translate(resolvedOption)
