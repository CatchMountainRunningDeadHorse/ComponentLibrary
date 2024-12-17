<template>
  <el-form-item>
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
      全选
    </el-checkbox>
    <el-checkbox-group v-model="checkOption" @change="handleCheckedChange">
      <el-checkbox
        v-for="it in data"
        :key="it.UserID"
        :value="it.UserID"
        :label="it.UserID"
        :checked="it.checked"
        >{{ it.UserName }}
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <div class="dialog-footer flex">
    <el-button @click="dialogCancel">取消</el-button>
    <el-button type="primary" @click="dialogConfirm"> 确认 </el-button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return []
    }
  }
})
const checkAll = ref(false)
onMounted(() => {
  let count = 0
  props.data.forEach((item) => {
    if (item.checked) {
      count++
    }
  })
  if (count === props.data.length) {
    checkAll.value = true
  }
})
const isIndeterminate = ref(false)
const checkOption = ref([])
const handleCheckAllChange = (val) => {
  checkOption.value = val
    ? props.data.map((item) => {
        return item.UserID
      })
    : []
  isIndeterminate.value = false
}

const handleCheckedChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === props.data.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.data.length
}

const emit = defineEmits(['myClick'])
const dialogCancel = () => {
  emit('myClick')
}

const dialogConfirm = () => {
  emit('myClick', checkOption.value)
}
</script>

<style scoped>
.dialog-footer {
  margin: 20px 0;
  justify-content: end;
}
</style>
