<script setup>
// 在App.vue中
import { provide, nextTick, ref } from 'vue'
const isRouterActive = ref(true)
provide('reload', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
</script>

<template>
  <RouterView v-if="isRouterActive" />
</template>

<style scoped></style>
