<template>
  <div class="btn-group">
    <button @click="BtnGroupClick('cancel')" v-if="showCancelBtn" class="btn-default">
      {{ cancelBtnText }}
    </button>
    <button @click="BtnGroupClick('confirm')" class="btn-primary">{{ confirmBtnText }}</button>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  data: Object
})

const emit = defineEmits(['BtnGroupClick'])

const { showCancelBtn, confirmBtnText, cancelBtnText } = toRefs(props.data)

const BtnGroupClick = (type) => {
  emit('BtnGroupClick', type)
}
</script>

<style scoped lang="scss">
.btn-group {
  position: relative;
  float: right;
  display: flex;
  flex-direction: row;
  align-items: center;
  bottom: 0;
  padding: 5px 15px 15px;
  button {
    border: none;
    outline: none;
    height: 32px;
    padding: 8px 15px;
    border-radius: 3px;
    box-sizing: border-box;
    &.btn-primary {
      background-color: #4093ff;
      color: #fff;
      margin-left: 10px;
      border: 1px solid #4093ff;
    }
    &.btn-default {
      background-color: #fff;
      border: 1px solid #ddd;
    }
  }
}
</style>