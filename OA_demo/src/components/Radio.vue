<template>
  <el-radio-group v-model="radio" @change="changeOption">
    <el-radio :value="item.UserID" v-for="item in data" :key="item.UserID">{{
      item.UserName
    }}</el-radio>
  </el-radio-group>
  <div style="display: flex; justify-content: flex-end">
    <el-button @click="dialogCancel">取消</el-button>
    <el-button type="primary" @click="dialogConfirm"> 确认 </el-button>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return []
    }
  }
})
const radio = ref(3)
const checkOption = ref([])
const changeOption = (e) => {
  radio.value = e
  checkOption.value = props.data.filter((item) => {
    return item.UserID === e
  })
}
const emit = defineEmits(['myClick'])
const dialogCancel = () => {
  emit('myClick')
}

const dialogConfirm = () => {
  if (checkOption.value.length) {
    emit('myClick', checkOption.value[0])
  } else {
    ElMessage({
      message: '请先选择一个选项',
      type: 'warning'
    })
  }
}
</script>
