<template>
  <div>
    <div>
      <Selector :data="options" @select-change="setTargetIndex" />
    </div>
    <div class="transfer">
      <div class="box left-list" @dragover.prevent @drop="removeRightListData([dragedItem])">
        <h1 class="list-title">{{ leftTitle }}</h1>
        <listItem
          @checkboxClick="setCheckedData"
          :data="leftListData"
          left-Or-Right="left"
          @drag-item="setDragedItem"
        />
      </div>
      <div class="box button-group">
        <button
          :disabled="trandferButtonDisabled.left"
          @click="removeRightListData(checkedData.right)"
        >
          &lt;
        </button>
        <button
          :disabled="trandferButtonDisabled.right"
          @click="addRightListData(checkedData.left)"
        >
          &gt;
        </button>
      </div>
      <div class="box right-list" @dragover.prevent @drop="addRightListData([dragedItem])">
        <h1 class="list-title">{{ rightTitle }}</h1>
        <listItem
          @checkboxClick="setCheckedData"
          :data="rightListData"
          left-Or-Right="right"
          @drag-item="setDragedItem"
        />
      </div>
    </div>
  </div>
</template>
    
<script setup>
import {
  useTargetIndex,
  useComputed,
  useRightListData,
  useCheckedData,
  useDragedItem
} from '../hooks'
import Selector from './Selector.vue'
import listItem from './listItem'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  rightTitle: {
    type: String,
    default: '已选择机型'
  }
})
const options = props.data.map(({ title }) => title)

const { targetIndex, setTargetIndex } = useTargetIndex(0)

const { removeCheckedData, addCheckedData, checkedData } = useCheckedData()

const { rightListData, addRightListData, removeRightListData } = useRightListData([], checkedData)

const { setDragedItem, dragedItem } = useDragedItem()

const { leftTitle, leftListData, trandferButtonDisabled } = useComputed(
  props.data,
  targetIndex,
  rightListData,
  checkedData
)

const setCheckedData = (checked, leftOrRight, item) => {
  checked ? addCheckedData(leftOrRight, item) : removeCheckedData(leftOrRight, item.id)
}
</script>
    
<style scoped lang="scss">
.transfer {
  display: flex;
  flex-direction: row;
  width: 360px;
  height: 300px;
  border: 1px solid #ddd;

  .box {
    width: 120px;
    height: 100%;

    .list-title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 38px;
      font-weight: normal;
      margin: 0;
      color: #666;
      border-bottom: 1px solid #ddd;
      background-color: #efefef;
      font-size: 14px;
    }

    .list-item {
      display: flex;
      align-items: center;
      height: 30px;
      font-size: 12px;
      color: #666;

      &.disabled {
        opacity: 0.7;
      }
    }
    &.button-group {
      display: flex;
      justify-content: space-around;
      align-items: center;

      button {
        background-color: #ffa500;
        border: none;
        color: #fff;
        &:disabled {
          opacity: 0.4;
        }
      }
    }
  }
}
</style>