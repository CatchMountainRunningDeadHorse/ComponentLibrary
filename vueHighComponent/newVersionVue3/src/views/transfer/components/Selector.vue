<template>
  <select @change="selectChange($event.target.value)">
    <option :value="index" v-for="(title, index) in data" :key="index">{{ title }}</option>
  </select>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['selectChange'])

const selectChange = (value) => {
  emit('selectChange', value)
}
</script>