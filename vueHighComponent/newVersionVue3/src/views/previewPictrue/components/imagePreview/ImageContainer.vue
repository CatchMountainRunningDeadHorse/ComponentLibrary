<template>
  <div class="image-container">
    <img
      :src="`./images/${item.image}`"
      :style="{ transform: `rotate(${item.rotate}deg) scale(${item.scale})` }"
    />
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    default: () => {}
  }
})
</script>

<style scoped lang="scss">
.image-container {
  float: left;
  width: 440px;
  height: 248px;

  img {
    width: 100%;
    height: 100%;
    transition: all 0.3s;
  }
}
</style>