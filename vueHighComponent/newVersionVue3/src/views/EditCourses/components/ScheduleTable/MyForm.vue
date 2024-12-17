<template>
  <div class="my-form">
    <h1>{{ _weekDay }} {{ _beginTime }}</h1>
    <div class="selector-group">
      <my-selector
        :data="course"
        text-key="name"
        :default-value="_course"
        @update="courseUpdate"
      ></my-selector>
      <my-selector
        :data="teacher"
        text-key="name"
        :default-value="_teacher"
        @update="teacherUpdate"
      ></my-selector>
    </div>
  </div>
</template>

<script setup>
import { weekdayToChinese, timeStampToTime } from '@/utils/util'
import { computed, reactive } from 'vue'
import MySelector from './MySelector.vue'

const { weekDay, beginTime, scheduleData, course, teacher } = defineProps({
  weekDay: Number,
  beginTime: Number,
  scheduleData: Object,
  course: Array,
  teacher: Array
})

const _weekDay = computed(() => weekdayToChinese(weekDay))
const _beginTime = computed(() => timeStampToTime(beginTime))
const _course = scheduleData ? scheduleData.course : course[0].name
const _teacher = scheduleData ? scheduleData.teacher : teacher[0].name

const emit = defineEmits(['formUpdate'])

const state = reactive({
  course: _course,
  teacher: _teacher
})
const courseUpdate = (course) => {
  state.course = course
  formEmit()
}

const teacherUpdate = (teacher) => {
  state.teacher = teacher
  formEmit()
}

const formEmit = () => {
  emit('formUpdate', {
    begin_time: beginTime,
    weekday: weekDay,
    course: state.course,
    teacher: state.teacher
  })
}
</script>

<style scoped lang="scss">
.my-form {
  padding: 15px;
  box-sizing: border-box;

  h1 {
    font-size: 20px;
    color: #666;
  }

  .selector-group {
    display: flex;
    flex-direction: row;
  }
}
</style>