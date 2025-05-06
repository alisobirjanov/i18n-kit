import { useI18n } from '@i18n-kit/solid'


export const Comp = () => {

  const { t } = useI18n()

  return <span>Comp { t('test') }</span>
}
