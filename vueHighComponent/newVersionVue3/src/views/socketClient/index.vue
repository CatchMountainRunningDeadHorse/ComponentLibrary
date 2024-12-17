<template>
  <div>
    <table border="1" width="300" align="center" v-table-click="state">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Score</th>
        <th>Age</th>
      </tr>
      <tr v-for="(item, index) of state.userList" :key="item.id" align="center">
        <td>{{ item.id }}</td>
        <td :data-index="index" data-field="name">
          <span>{{ item.name }}</span>
        </td>
        <td :data-index="index" data-field="score">
          <span>{{ item.score }}</span>
        </td>
        <td :data-index="index" data-field="age">
          <span>{{ item.age }}</span>
        </td>
      </tr>
    </table>
    <p>{{ statusText }}</p>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client'
import { computed, onBeforeUnmount, reactive } from 'vue'
import vTableClick from './directives/tabelClick'

const socket = io('ws://localhost:3000')

const state = reactive({
  userList: [],
  status: false,
  field: '',
  index: -1,
  socket
})

const statusText = computed(() => {
  return state.status ? '正在修改中...' : ''
})

socket.on('loadData', (data) => {
  state.userList = data
})

socket.on('changeStatus', (status) => {
  state.status = status
})

socket.on('changeData', (data) => {
  state.userList = state.userList.map((item, idx) => {
    if (idx == data.index) {
      item[data.field] = data.data
    }
    return item
  })
})
onBeforeUnmount(() => {
  socket.disconnect()
})
</script>

<style scoped>
td {
  position: relative;
}
</style>
