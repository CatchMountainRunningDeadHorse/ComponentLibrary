import { reactive } from 'vue'

const data = reactive({
  duration: [],
  schedule: [],
  course: [],
  teacher: [],
  formData: []
})

export function useInitialData() {
  function setInitialData({ duration, schedule, course, teacher }) {
    data.duration = duration
    data.course = course
    data.schedule = schedule
    data.teacher = teacher
  }

  function setSchedule({ type, result }) {
    const { course, teacher, begin_time, weekday } = result
    const mark = `${begin_time}_${weekday}`
    const target = data.schedule[mark]

    switch (type) {
      case 'EDIT':
        target.course = course
        target.teacher = teacher
        break
      case 'ADD':
        data.schedule[mark] = result
        break
      case 'REMOVE':
        delete data.schedule[mark]
        break
      default:
        break
    }
  }

  return {
    data,
    setInitialData,
    setSchedule
  }
}

export function useFormData() {
  function setFormData(item) {
    data.formData = item
  }

  return [setFormData]
}
