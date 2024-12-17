<template>
  <table border="1" v-cell-select="weekdayTimeData">
    <tr>
      <th rowspan="2">星期 / 时间</th>
      <th colspan="12">00:00 - 12:00</th>
      <th colspan="12">12:00 - 23:59</th>
    </tr>
    <tr>
      <th v-for="n in 24" :key="n">{{ n - 1 }}</th>
    </tr>
    <tr v-for="n in 7" :key="n" :data-weekday="n - 1">
      <th class="weekday-title">{{ weekdayTitle[n - 1] }}</th>
      <template v-for="m in 24" :key="m">
        <td :data-time="m - 1" :data-weekday="n - 1">
          {{ sdhchj[n - 1] && sdhchj[n - 1][m - 1] == m - 1 ? sdhchj[n - 1][m - 1] : '' }}
        </td>
      </template>
    </tr>
  </table>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import vCellSelect from './directives/cellSelect'
const weekdayTimeData = reactive([])
const weekdayTitle = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
let sdhchj = ref([])

watch(weekdayTimeData, (newValue) => {
  sdhchj.value = newValue.map((item) => {
    return [...item]
  })
  console.log(sdhchj.value)
})
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  tr {
    height: 50px;
  }
  .weekday-title {
    width: 100px;
  }
  td {
    width: 50px;
    &.target {
      background-color: #3737e2;
    }
  }
}
</style>
