<template>
  <div class="my-selector">
    <div class="selected-value" @click="showOptionList">{{ selectedValue }}</div>
    <div class="option-list" v-if="visible">
      <a href="javascript:;" v-for="item of data" :key="item.id" @click="selectValue(item)">
        {{ item[textKey] }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'

const { data, textKey, defaultValue } = defineProps({
  data: Object,
  textKey: String,
  defaultValue: String
})

const emit = defineEmits(['update'])

const state = reactive({
  selectedValue: defaultValue || data[0][textKey],
  visible: false
})

const { selectedValue, visible } = toRefs(state)

onMounted(() => {
  emit('update', state.selectedValue)
})

const selectValue = (item) => {
  setSelectedValue(item[textKey])
  setVisible(false)
  emit('update', state.selectedValue)
}

const showOptionList = () => {
  setVisible(!state.visible)
}

const setVisible = (isVisible) => {
  state.visible = isVisible
}

const setSelectedValue = (value) => {
  state.selectedValue = value
}
</script>

<style scoped lang="scss">
.my-selector {
  width: 100%;
  height: 33px;
  border: 1px solid #ddd;
  margin: 15px;
  box-sizing: border-box;

  .selected-value {
    height: 100%;
    text-align: center;
    line-height: 33px;
  }
  .option-list {
    display: flex;
    flex-direction: column;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    margin-top: 1px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    .list-item {
      display: block;
      height: 33px;
      line-height: 33px;
      text-align: center;
      color: #999;

      &:hover {
        background-color: #ededed;
      }
    }
  }
}
</style>