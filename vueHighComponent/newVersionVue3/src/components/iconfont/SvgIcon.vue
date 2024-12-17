<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconClassName" :fill="color" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#7B7B7B'
  }
  // size: {
  //   type: String,
  //   default: '16px'
  // }
})
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.iconName}`
})
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`
  }
  return 'svg-icon'
})
</script>

<style scoped>
.svg-icon {
  /* v-bind 是 Vue3 才支持的功能，可以将 CSS 的值与 js 的值绑定 */
  width: 2em;
  height: 2em;
  position: relative;
  overflow: hidden;
  fill: currentColor;
  vertical-align: -0.15em;
}
</style>
