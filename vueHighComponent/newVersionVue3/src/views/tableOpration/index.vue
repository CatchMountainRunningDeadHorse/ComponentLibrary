<template>
  <div>
    <table border="1" v-table-select="state">
      <tr v-for="(rowData, rowIndex) in state.data" :key="rowIndex">
        <th>{{ rowData.row }}</th>
        <td
          v-for="(columnData, columnIndex) in rowData.data"
          :key="columnIndex"
          :class="{ selected: columnData.selected }"
          :data-row="rowIndex"
          :data-cloumn="columnIndex"
        >
          {{ columnData.content }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import vTableSelect from './directives/tabelSelect'

const data = [
  {
    row: 'X',
    data: [
      {
        id: 1,
        content: 1,
        selected: false
      },
      {
        id: 2,
        content: 2,
        selected: false
      },
      {
        id: 3,
        content: 3,
        selected: false
      },
      {
        id: 4,
        content: 4,
        selected: false
      }
    ]
  },
  {
    row: 'Y',
    data: [
      {
        id: 5,
        content: 5,
        selected: false
      },
      {
        id: 6,
        content: 6,
        selected: false
      },
      {
        id: 7,
        content: 7,
        selected: false
      },
      {
        id: 8,
        content: 8,
        selected: false
      }
    ]
  },
  {
    row: 'Z',
    data: [
      {
        id: 9,
        content: 9,
        selected: false
      },
      {
        id: 10,
        content: 10,
        selected: false
      },
      {
        id: 11,
        content: 11,
        selected: false
      },
      {
        id: 12,
        content: 12,
        selected: false
      }
    ]
  }
]

const state = reactive({
  data: data,
  selectedData: null,
  selectedAreaData: []
})

watch(
  () => state.selectedData,
  (newValue) => {
    console.log('selectedData:', newValue)
  }
)

watch(
  () => state.selectedAreaData,
  (newValue) => {
    console.log('selectedAreaData:', newValue)
  }
)
</script>

<style lang="scss" scoped>
table {
  width: 800px;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: center;
}
td {
  height: 33px;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
}
td.selected {
  background-color: #ffa500;
}
</style>
