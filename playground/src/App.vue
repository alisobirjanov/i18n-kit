<script setup lang="ts">
import { useI18n } from '@i18n-kit/vue'

const i18n = useI18n()
</script>

<template>
  <h3 @click="i18n.setLocale(i18n.locale.value === 'uz' ? 'ru' : 'uz')">
    {{ i18n.locale }}
  </h3>
  <div>
    Hello World {{ $t('test.bar.test.name') }}
  </div>
</template>
