<template>
  <button @click="showMessageBox">showMessageBox</button>
</template>


<script setup>
import MessageBox from './components/index.js'
import { h } from 'vue'

const showMessageBox = () => {
  MessageBox({
    confirmBtnText: '确定',
    cancelBtnText: '取消',
    showCancelBtn: false,
    title: 'MessageBox',
    content: h('p', null, [
      h('span', null, '你确定要'),
      h('i', { style: 'color: teal;margin:0 5px' }, '删除'),
      h('span', null, '该课程吗？')
    ]),
    confirm() {
      console.log('点击了confirm按钮')
    },
    cancel() {
      console.log('点击了cancel按钮')
      return
    }
  })
}
</script>

<style scoped lang="scss">
</style>