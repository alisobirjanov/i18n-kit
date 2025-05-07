
export function getMessage(messages: any, key: string) {
  return key.split('.').reduce((acc, key) => acc[key] ? acc[key] : '', messages)
}

// https://github.com/Ayub-Begimkulov/i18n/blob/main/src/i18n.ts#L125
const mustacheParamRegex = /\{\s*([a-zA-Z10-9]+)\s*\}/g

// not the most performant way, but it should be okay
export function interpolateTranslation(
  translation: string,
  params: Record<string, string | number>,
) {
  return translation.replace(mustacheParamRegex, (original, paramKey) => {
    if (paramKey in params)
      return String(params[paramKey])

    return original
  })
}
