<template>
  <div class="schedule-card">
    <span class="iconfont icon-close" @click.stop="removeCard"></span>
    <p>{{ weekDay }} {{ beginTime }}</p>
    <p>{{ course }}</p>
    <p>{{ teacher }}</p>
  </div>
</template>

<script setup>
import { weekdayToChinese, timeStampToTime } from '@/utils/util'
import { computed, toRefs, h } from 'vue'
import MessageBox from '@/views/MessageBox2/components/index'
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['removeCard'])

const weekDay = computed(() => weekdayToChinese(props.data.weekday))
const beginTime = computed(() => timeStampToTime(props.data.begin_time))

const { course, teacher } = toRefs(props.data)

const removeCard = () => {
  MessageBox({
    confirmBtnText: '确定',
    cancelBtnText: '取消',
    showCancelBtn: true,
    title: '提示',
    content: h('p', null, [
      h('span', null, '你确定要'),
      h('i', { style: 'color: teal;margin:0 5px' }, '删除'),
      h('span', null, '该课程吗？')
    ]),
    confirm() {
      emit('removeCard', props.data)
    },
    cancel() {
      console.log('点击了cancel按钮')
      return
    }
  })
}
</script>

<style scoped lang="scss">
.schedule-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 100%;
  color: #155724;
  background-color: #d4edda;

  .iconfont {
    font-size: 30px;
    position: absolute;
    right: 5px;
    top: -5px;
    color: #067720;
    text-shadow: 1px 2px 3px #000;
    transition: text-shadow 0.3s;

    &:hover {
      text-shadow: 1px 1px 1px #000;
    }
  }
}
</style>