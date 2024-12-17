<template>
  <select v-if="isShow" @change="handleChange">
    <option value="">{{ defaultTitle }}</option>
    <option v-for="(info, name) in data" :value="`${info[codeKey]}:${name}`" :key="info[codeKey]">
      {{ name }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  defaultTitle: {
    trpe: String,
    default: '请选择'
  },
  data: {
    type: Object,
    default: () => {}
  },
  codeKey: String
})

const emit = defineEmits(['handleChange'])

const handleChange = (e) => {
  emit('handleChange', e.target.value)
}
</script>