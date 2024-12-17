<template>
    <div ref="pickerContainer" class="picker-container">
      <!-- 输入框 -->
      <input type="text" v-model="displayValue" @focus="handleFocus" placeholder="请选择日期" readonly class="input-box" />
  
      <!-- 日历区域 -->
      <div v-if="showPicker" class="calendar-wrapper">
        <!-- 日历头部 -->
        <div class="calendar-header">
          <button type="button" @click.stop="preYear">&lt;&lt;</button>
          <button type="button" @click.stop="preMonth">&lt;</button>
          <span>{{ currentYear }} 年 {{ currentMonth }} 月</span>
          <button type="button" @click.stop="nextMonth">&gt;</button>
          <button type="button" @click.stop="nextYear">&gt;&gt;</button>
        </div>
  
        <!-- 日历主体 -->
        <div class="calendar-body">
          <table>
            <thead>
              <tr>
                <th v-for="day in weekDays" :key="day">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, index) in calendarDays" :key="index">
                <td v-for="day in week" :key="day.date"
                  :class="{ active: isSelected(day), disabled: !day.isCurrentMonth }" @click="selectDate(day)">
                  {{ day.day }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- 上/下午选择 -->
        <div class="time-select">
          <button type="button" :class="{ active: timePeriod === '上午' }" @click.stop="selectTimePeriod('上午')">
            上午
          </button>
          <button type="button" :class="{ active: timePeriod === '下午' }" @click.stop="selectTimePeriod('下午')">
            下午
          </button>
        </div>
  
        <!-- 底部按钮 -->
        <div class="calendar-footer">
          <button type="button" @click.stop="cancelSelection">取消</button>
          <button type="button" class="confirm" @click.stop="confirmSelection">确认</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  
  const props = defineProps({
    modelValue: { type: String, default: '' }
  })
  const emit = defineEmits(['update:modelValue'])
  
  const pickerContainer = ref(null)
  const showPicker = ref(false) // 控制日历显示
  const cachedValue = ref(props.modelValue) // 缓存值
  const displayValue = ref(props.modelValue) // 输入框显示的值
  
  // 日期相关
  const currentDate = new Date()
  const currentYear = ref(currentDate.getFullYear())
  const currentMonth = ref(currentDate.getMonth() + 1)
  const selectedDay = ref(null)
  const timePeriod = ref('上午') // 上/下午
  
  // 星期标题
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  
  // 生成日历
  const calendarDays = ref([])
  const generateCalendar = () => {
    const days = []
    const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
    const lastDate = new Date(currentYear.value, currentMonth.value, 0).getDate()
  
    let week = []
    for (let i = 0; i < firstDay; i++) week.push({ day: '', isCurrentMonth: false })
    for (let day = 1; day <= lastDate; day++) {
      week.push({ day, isCurrentMonth: true, date: `${currentYear.value}-${currentMonth.value}-${day}` })
      if (week.length === 7) {
        days.push(week)
        week = []
      }
    }
    while (week.length < 7) week.push({ day: '', isCurrentMonth: false })
    days.push(week)
    calendarDays.value = days
  }
  
  // 事件方法
  const handleFocus = () => {
    showPicker.value = true
    cachedValue.value = displayValue.value
  }
  
  const selectDate = (day) => {
    if (!day.isCurrentMonth) return
    selectedDay.value = day.date
    updateDisplayValue()
  }
  
  const selectTimePeriod = (period) => {
    timePeriod.value = period
    updateDisplayValue()
  }
  
  const updateDisplayValue = () => {
    let day = selectedDay.value || `${currentYear.value}-${(currentMonth.value).toString().padStart(2, '0')}-${(currentDate.getDate()).toString().padStart(2, '0')}`;
    if (selectedDay.value) {
      const [year, month, date] = selectedDay.value.split('-');
      day = `${year}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`;
    }
    displayValue.value = `${day} ${timePeriod.value}`;
  }
  
  const confirmSelection = () => {
    emit('update:modelValue', displayValue.value)
    showPicker.value = false
  }
  
  const cancelSelection = () => {
    displayValue.value = cachedValue.value
    showPicker.value = false
  }
  
  const isSelected = (day) => day.date === selectedDay.value
  
  const preYear = () => {
    currentYear.value--
    generateCalendar()
  }
  const nextYear = () => {
    currentYear.value++
    generateCalendar()
  }
  const preMonth = () => {
    currentMonth.value = currentMonth.value === 1 ? 12 : currentMonth.value - 1
    if (currentMonth.value === 12) currentYear.value--
    generateCalendar()
  }
  const nextMonth = () => {
    currentMonth.value = currentMonth.value === 12 ? 1 : currentMonth.value + 1
    if (currentMonth.value === 1) currentYear.value++
    generateCalendar()
  }
  
  // 点击外部隐藏日历
  onMounted(() => {
    generateCalendar()
  
  })
  
  const handleClick = (e) => {
    if (!pickerContainer.value.contains(e.target)) {
      showPicker.value = false
      displayValue.value = cachedValue.value
    }
  }
  
  
  // 监听父组件值变化
  watch(() => props.modelValue, (newVal) => {
    displayValue.value = newVal
  })
  
  watch(showPicker, (newVal) => {
    if (!newVal) {
      document.removeEventListener('click', handleClick)
    } else {
      document.addEventListener('click', handleClick)
    }
  })
  </script>
  
  <style scoped>
  .picker-container {
    position: relative;
    width: 100%;
  }
  
  .input-box {
    width: 100%;
    padding: 5px;
  }
  
  .calendar-wrapper {
    position: absolute;
    top: 40px;
    left: 0;
    background: #fff;
    border: 1px solid #ddd;
    z-index: 10;
    width: 394px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .calendar-header,
  .time-select,
  .calendar-footer {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }
  
  .time-select button {
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .time-select .active,
  .calendar-body td.active {
    background: #409eff;
    color: #fff;
  }
  
  .calendar-body table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
  }
  
  .calendar-body td {
    padding: 5px;
    cursor: pointer;
  }
  
  .disabled {
    color: #ddd;
    pointer-events: none;
  }
  
  .confirm {
    color: #fff;
    background-color: #409eff;
    border: none;
    cursor: pointer;
  }
  </style>
  