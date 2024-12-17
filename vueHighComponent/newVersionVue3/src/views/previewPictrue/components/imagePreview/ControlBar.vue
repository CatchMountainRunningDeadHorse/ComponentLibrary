<template>
  <div class="control-bar">
    <span
      :class="['iconfont', icon.icon]"
      @click="icon.click"
      v-for="icon of icons"
      :key="icon.icon"
    ></span>
  </div>
</template>

<script setup>
const props = defineProps({
  icons: {
    type: Array,
    default: () => []
  }
})
</script>
  

<style scoped lang="scss">
.control-bar {
  position: absolute;
  bottom: 10px;
  z-index: 1;
  justify-content: center;
  display: flex;

  .iconfont {
    color: #fff;
    font-size: 30px;
    font-weight: bold;
    text-shadow: 1px 3px 5px #000;
    cursor: pointer;
    transition: text-shadow 0.3s;
    padding: 0 10px;

    &:hover {
      text-shadow: 1px 2px 3px #000;
    }
  }
}
</style>