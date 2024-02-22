<script setup lang="ts">
import { useI18n } from '@i18n-kit/vue'

const { setLocale, locale } = useI18n()
function changeLocale() {
  if (locale.value === 'ru') {
    setLocale('uz')
    return
  }
  setLocale('ru')
}
</script>

<template>
  <div>
    <button @click="changeLocale">
      TEST
    </button>
  </div>
  <h3>
    {{ locale }} {{ $t('test') }}
  </h3>
</template>
