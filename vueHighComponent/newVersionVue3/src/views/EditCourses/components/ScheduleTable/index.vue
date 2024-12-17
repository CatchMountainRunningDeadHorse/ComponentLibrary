<template>
  <div class="schedule-table">
    <table border="1" cellpadding="0">
      <week-title></week-title>
      <tr v-for="item of duration" :key="item.begin_time">
        <duration-title :title="item.title"></duration-title>
        <td v-for="n in 7" :key="n" @click="handleTDClick(item.begin_time, n)">
          <schedule-card
            v-if="schedule[item.begin_time + '_' + n]"
            :data="schedule[item.begin_time + '_' + n]"
            @remove-card="removeCard"
          ></schedule-card>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { onMounted, toRefs, h } from 'vue'
import './styles/index.scss'
import WeekTitle from './WeekTitle.vue'
import DurationTitle from './DurationTitle'
import { getInitialData, updateSchedule, removeSchedule } from '@/http/service'
import { useInitialData, useFormData } from '../../hooks'
import ScheduleCard from './ScheduleCard.vue'
import MessageBox from '@/views/MessageBox2/components/index'
import { checkHasData } from '@/utils/util'
import MyForm from './MyForm.vue'

const { data, setInitialData, setSchedule } = useInitialData()
const [setFormData] = useFormData()
onMounted(async () => {
  const { duration, course, schedule, teacher } = await getInitialData()
  setInitialData({ duration, course, schedule, teacher })
})

const handleTDClick = (beginTime, weekDay) => {
  const scheduleData = data.schedule[`${beginTime}_${weekDay}`]
  MessageBox({
    confirmBtnText: '确定',
    cancelBtnText: '取消',
    showCancelBtn: true,
    title: checkHasData(scheduleData),
    content: h(MyForm, {
      weekDay,
      beginTime,
      scheduleData,
      course: data.course,
      teacher: data.teacher,
      onFormUpdate: setFormData
    }),
    async confirm() {
      console.log(data.formData)
      const res = await updateSchedule({ data: data.formData })
      setSchedule({ ...res })
      setFormData({})
    },
    cancel() {
      console.log('点击了cancel按钮')
      return
    }
  })
}

const removeCard = async (item) => {
  const { type } = await removeSchedule({ id: item.id })
  setSchedule({ type, result: item })
}

const { duration, schedule } = toRefs(data)
</script>

<style scoped lang="scss"></style> 