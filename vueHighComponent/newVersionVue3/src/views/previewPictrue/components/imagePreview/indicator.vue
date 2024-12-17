<template>
  <span :class="['iconfont', `icon-arrow-${dir}`]" @click="handleImageSlide(dir)"></span>
</template>

<script setup>
const props = defineProps({
  dir: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['handleImageSlide'])
const handleImageSlide = (dir) => {
  emit('handleImageSlide', dir)
}
</script>

<style scoped lang="scss">
.iconfont {
  position: absolute;
  top: 110px;
  z-index: 1;
  font-size: 25px;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 3px 5px #000;
  transition: text-shadow 0.3s;
  cursor: pointer;

  &:hover {
    text-shadow: 1px 2px 3px #000;
  }

  &.icon-arrow-left {
    left: 20px;
  }
  &.icon-arrow-right {
    right: 20px;
  }
}
</style>