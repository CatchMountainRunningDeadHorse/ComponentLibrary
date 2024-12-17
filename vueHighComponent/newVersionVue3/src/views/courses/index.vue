<template>
  <div class="board">
    <div class="left">
      <course-panel
        v-for="({ name }, key) in data.courses"
        :key="key"
        :course-name="name"
        :course-key="key"
        @handle-drag-end="handleDragEnd"
      ></course-panel>
    </div>
    <div class="right" @dragover="handleDragOver" @dragenter="handleDragEnter">
      <table border="1">
        <tr>
          <th>时间段 / 星期</th>
          <th v-for="(weekday, index) of data.weekday" :key="index">{{ weekday }}</th>
        </tr>
        <tr v-for="(timeSlot, index) of data.time_slot" :key="index">
          <th>{{ timeSlot }}</th>
          <td v-for="weekday in 7" :key="weekday" :data-weekday="weekday" :data-time-slot="index">
            <template v-if="cellData[`${weekday}-${index}`]">
              <course-panel
                :course-name="data.courses[cellData[`${weekday}-${index}`]].name"
                :course-key="cellData[`${weekday}-${index}`]"
                v-course-panel="{
                  cellData,
                  weekday,
                  timeSlot: index
                }"
              >
              </course-panel>
            </template>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import data from '@/stores/data'
import CoursePanel from './components/CoursePanel'
import { ref } from 'vue'
import vCoursePanel from './directive/coursePanel'
const cellData = ref({
  '1-1': 'chinese'
})
let targetCell = null

function handleDragOver(e) {
  e.preventDefault()
}

function handleDragEnter(e) {
  e.preventDefault()
  const tar = e.target
  const tagName = tar.tagName.toLowerCase()
  targetCell = tagName !== 'td' ? null : tar
}

function handleDragEnd(target) {
  if (targetCell) {
    const weekday = targetCell.dataset.weekday
    const timeSlot = targetCell.dataset.timeSlot
    const prop = `${weekday}-${timeSlot}`
    if (!cellData.value[prop]) {
      const key = target.dataset.key
      cellData.value[prop] = key
    }
  }
}
</script>

<style scoped lang="scss">
.board {
  display: flex;
  flex-direction: row;
  .left {
    width: 300px;
  }
  .right {
    width: calc(100% - 300px);
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      td {
        height: 100px;
      }
    }
  }
}
</style>
