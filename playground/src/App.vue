<script setup lang="ts">
import { createI18n } from '@i18n-kit/vue'
import uz from '../locales/uz.json'

function $t(s: string) {
  return (uz as any)[s]
}
console.log(createI18n())
</script>

<template>
  <div>
    Hello World {{ $t('test.bar.test.name') }}
  </div>
</template>
