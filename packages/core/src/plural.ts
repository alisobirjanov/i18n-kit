
export interface PluralRules {
  pluralTypes: {
    [key: string]: (n: number) => number
  }
  pluralTypeToLanguages: {
    [key: string]: string[]
  }
}

type PluralFn = (n: number) => number

export function getLanguageToPluralFn(pluralRules: PluralRules) {
  const languageToFn: Record<string, (n: number) => number> = {}

  for (const [type, langs] of Object.entries(pluralRules.pluralTypeToLanguages)) {
    const fn = pluralRules.pluralTypes[type]
    langs.forEach(lang => {
      languageToFn[lang] = fn
    })
  }

  return languageToFn
}

export function getPluralForm(pluralFn: PluralFn, message: string, count: number) {
  const idx: number = pluralFn(count)

  const forms = message.split('|')

  return forms[idx] || forms[0] || message
}