<script setup lang="ts">
import uz from '../locales/uz.json'

function $t(s: string) {
  return (uz as any)[s]
}
// console.log(process.env)
</script>

<template>
  <div>
    Hello World {{ $t('name') }}
  </div>
</template>
