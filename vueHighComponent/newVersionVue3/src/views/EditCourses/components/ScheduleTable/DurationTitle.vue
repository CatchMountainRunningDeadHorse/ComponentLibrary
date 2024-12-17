<template>
  <td class="duration-title">{{ title }}</td>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
.duration-title {
  background-color: #fff3cd;
  color: #856404;
}
</style>