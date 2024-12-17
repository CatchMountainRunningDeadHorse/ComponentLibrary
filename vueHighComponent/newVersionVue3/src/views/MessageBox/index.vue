<template>
  <div>
    <button @click="showMessageBox">showMessageBox</button>
    <button @click="showConfirmMessageBox">showConfirmMessageBox</button>
    <button @click="showPromptMessageBox">showPromptMessageBox</button>
  </div>
</template>

<script setup>
import MessageBox from './components/index'
const showMessageBox = () => {
  MessageBox({
    confirmBtnText: '确定',
    title: 'MessageBox',
    content: 'This is MessageBox content'
  })
    .then(() => {
      console.log('MessageBox resolve')
    })
    .catch(() => {
      console.log('MessageBox reject')
    })
}

const showConfirmMessageBox = () => {
  MessageBox.confirm({
    showCancelBtn: true,
    cancelBtnText: '取消',
    title: 'ConfirmMessageBox',
    content: 'This is ConfirmMessageBox content'
  })
    .then(() => {
      console.log('ConfirmMessageBox resolve')
    })
    .catch(() => {
      console.log('ConfirmMessageBox reject')
    })
}

const showPromptMessageBox = () => {
  MessageBox.prompt({
    showCancelBtn: true,
    confirmBtnText: '确定',
    cancelBtnText: '取消',
    title: 'PromptMessageBox',
    content: 'This is PromptMessageBox content'
  })
    .then((value) => {
      console.log('PromptMessageBox resolve', value)
    })
    .catch(() => {
      console.log('PromptMessageBox reject')
    })
}
</script>

<style scoped lang="scss"></style>