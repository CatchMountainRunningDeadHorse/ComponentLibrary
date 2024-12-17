<template>
  <table
    border="1"
    v-row-drag="tableData"
    v-column-drag="{
      data: tableData,
      titles: titleData
    }"
  >
    <thead>
      <tr>
        <th v-for="title of titleData" :key="title">{{ title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of tableData" :key="index">
        <td v-for="elem of item" :key="elem[0]">{{ elem[1] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from 'vue'
import vRowDrag from './directives/rowDrag'
import vColumnDrag from './directives/columnDrag'

const data = [
  {
    id: 1,
    name: 'Mike',
    age: 18,
    score: 85
  },
  {
    id: 2,
    name: 'Job',
    age: 20,
    score: 85
  },
  {
    id: 3,
    name: 'Bob',
    age: 21,
    score: 90
  },
  {
    id: 4,
    name: 'Lisa',
    age: 19,
    score: 73
  }
]

/**
 * 目标数据
 * data => [
 *      [
 *          ['id',1],
 *          ['name','Mike'],
 *          ['age',18],
 *          ['score',85]
 *      ]
 * ]
 */

const titles = ['id', 'name', 'age', 'score']
function formatData(data) {
  return data.map((item) => {
    const arrItem = []
    for (let k in item) {
      arrItem.push([k, item[k]])
    }
    return arrItem
  })
}

const tableData = ref(formatData(data))
const titleData = ref(titles)
console.log(tableData)
</script>

<style scoped lang="scss">
table {
  width: 800px;
  border-collapse: collapse;
  text-align: center;
}
</style>