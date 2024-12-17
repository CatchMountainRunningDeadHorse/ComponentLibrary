<template>
  <div style="position: relative; z-index: 999; width: 100%" v-outside>
    <el-input
      style="width: 100%"
      :value="dateTime"
      placeholder="请输入"
      :prefix-icon="Calendar"
      readonly
    />
    <div v-if="show" class="cus-picker">
      <div class="flex align-items">
        <div class="wrap">
          <div class="flex justify-between align-items">
            <el-icon @click="preYear"><DArrowLeft /></el-icon>
            <el-icon @click="preMonth"><ArrowLeft /></el-icon>
            <span>{{ curYear }}年</span>
            <span>{{ curMonth }}月</span>
            <el-icon @click="nextMonth"><ArrowRight /></el-icon>
            <el-icon @click="nextYear"><DArrowRight /></el-icon>
          </div>
          <div class="weeks">
            <div v-for="item in week" :key="item" class="week">{{ item }}</div>
          </div>
          <div class="days">
            <!-- 上个月 -->
            <div v-for="item in firstDay" :key="item + 'pre'" class="lastday">
              {{ preDays - (firstDay - item) }}
            </div>
            <!-- 当月 -->
            <div
              v-for="item in curDays"
              :key="item + 'cur'"
              :class="['curday', { select: item === currentDay }]"
              @click="selectDate(item)"
            >
              {{ item }}
            </div>
            <!-- 下个月 -->
            <div v-for="item in 13 - nextDays" :key="item + 'next'" class="lastday">
              {{ item }}
            </div>
          </div>
        </div>
        <div style="width: 100px">
          <div
            style="text-align: center"
            :class="['padding', { select: upDown === 'a' }]"
            @click="upOrDown('a')"
          >
            上午
          </div>
          <div
            style="text-align: center"
            :class="['padding', { select: upDown === 'p' }]"
            @click="upOrDown('p')"
          >
            下午
          </div>
        </div>
      </div>
      <div class="justify-end flex">
        <span
          style="margin: 10px; padding: 0 5px; border-radius: 4px; border: 1px #000 solid"
          @click="cancel"
          >取消</span
        >
        <span
          style="
            margin: 10px;
            padding: 0 5px;
            border-radius: 4px;
            border: 1px #000 solid;
            background-color: #288ada;
            color: #fff;
          "
          @click="comfirmDate"
          >确认</span
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import moment from 'moment'
import { Calendar } from '@element-plus/icons-vue'
moment.suppressDeprecationWarnings = true
const preDays = ref(30)
const nextDays = ref(7)
const curYear = ref(moment().year()) //当前年
const curMonth = ref(moment().month() + 1) //当前月
const week = ref(['日', '一', '二', '三', '四', '五', '六'])
const firstDay = ref(
  moment(`${moment().year()}-${moment().month() + 1}`)
    .startOf('month')
    .day()
) //获取当月第一天是星期几;星期日为 0，星期六为 6
const curDays = ref(moment().daysInMonth()) //获取当月一共有多少天
const dateTime = ref()
const show = ref(false)

const props = defineProps(['modelValue'])

const emit = defineEmits(['update:modelValue'])

// 在模板中启用 v-outside
//指令的用途是用来判断当前用户点击的区域在不在日期选择面板之内
const vOutside = {
  mounted(el, binding, vnode) {
    //dom元素，参数集，虚拟dom（只有一个有用的属性 context 上下文的意思）
    // vnode.context 表示当前组件了
    //我们需要监听用户的点击行为，看在不在我们的日期选择面板
    el.hander = (e) => {
      //e 当前事件源对象
      //拿着面板的区域(el)和当前点击的区域(e.target)，做个对比
      //如果你点击的区域在日期选择面板区域内：不要隐藏面板
      //如果你点击的区域在日期选择面板区域外：要隐藏面板
      //contains 是包含的意思
      if (el.contains(e.target) && !show.value) {
        if (!show.value) {
          onFocus()
        }
      } else if (!el.contains(e.target) && show.value) {
        if (show.value) {
          onBlur()
        }
      }
    }
    document.addEventListener('click', el.hander)
  },
  unmounted(el) {
    document.removeEventListener('click', el.hander)
  }
}

onMounted(() => {
  getPreMonthDays()
  getNextMonthDays()
})
const onBlur = () => {
  show.value = false
}
const onFocus = () => {
  show.value = true
}

const preYear = () => {
  curYear.value--
  updateDate()
  //显示上个月日期
  getPreMonthDays()
  getNextMonthDays()
}
const preMonth = () => {
  curMonth.value--
  // 如果小于1表示上一年;重置日期
  if (curMonth.value < 1) {
    curYear.value--
    curMonth.value = 12
  }
  updateDate()
  getPreMonthDays()
  getNextMonthDays()
}
const nextMonth = () => {
  curMonth.value++
  // 如果超过12表示下一年;重置日期
  if (curMonth.value > 12) {
    curYear.value++
    curMonth.value = 1
  }
  updateDate()
  //显示上个月日期
  getPreMonthDays()
  getNextMonthDays()
}
const nextYear = () => {
  curYear.value++
  updateDate()
  //显示上个月日期
  getPreMonthDays()
  getNextMonthDays()
}
// 获取上个月剩余天数
const getPreMonthDays = () => {
  if (firstDay.value == 1) return //表示上个月无剩余天数
  let month = curMonth.value
  let year = curYear.value
  month--
  if (month == 0) {
    year--
    month = 12
  }
  // 获取上个月的天数
  const days = moment(`${year}-${month}`).daysInMonth()
  preDays.value = days
}
// 获取下个月要显示的天数
const getNextMonthDays = () => {
  let month = curMonth.value
  let year = curYear.value
  // 获取当月最后一天是星期几
  const lastDay = moment(`${year}-${month}`).endOf('month').day()
  nextDays.value = lastDay == 0 ? 7 : lastDay
}

const currentDay = ref(moment().date())
const selectDate = (val) => {
  currentDay.value = val
}

//更新日期信息
const updateDate = () => {
  curDays.value = moment(`${curYear.value}-${curMonth.value}`).daysInMonth()
  firstDay.value = moment(`${curYear.value}-${curMonth.value}`).startOf('month').day()
  if (firstDay.value == 0) {
    firstDay.value = 7
  }
}

const upDown = ref('a')
const dayAP = ref('上午')
const upOrDown = (val) => {
  upDown.value = val
}

const padZero = (s) => {
  return String(s).padStart(2, '0')
}
watch(upDown, (val) => {
  dayAP.value = val === 'a' ? '上午' : '下午'
})

const comfirmDate = () => {
  show.value = false
  const date = `${[curYear.value, curMonth.value, currentDay.value].map(padZero).join('-')} ${dayAP.value}`
  dateTime.value = date
  emit('update:modelValue', dateTime.value)
}

const cancel = () => {
  // emit('update:modelValue', false)
  show.value = false
}

/**
 * 初始化
 */

const init = () => {
  dateTime.value = props.modelValue
}

watch(
  () => props.modelValue,
  () => {
    init()
  },
  { deep: true, immediate: true }
)
</script>

<style>
.cus-picker {
  width: 394px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  float: left;
  position: absolute;
  background-color: #fff;
  z-index: 999;
}

.wrap {
  width: 294px;
  height: 100%;
}

.weeks {
  width: 100%;
  height: 38px;
  display: flex;
}

.week {
  width: 42px;
  line-height: 38px;
  text-align: center;
  background: gainsboro;
}
.days {
  display: flex;
  flex-wrap: wrap;
}

.lastday {
  width: 42px;
  line-height: 38px;
  text-align: center;
}

.curday {
  width: 42px;
  line-height: 38px;
  text-align: center;
}
.lastday {
  color: gold;
}
.select {
  background: #288ada;
  color: #fff;
}
</style>
