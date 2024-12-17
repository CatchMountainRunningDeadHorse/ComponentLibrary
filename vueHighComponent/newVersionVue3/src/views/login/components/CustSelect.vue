<template>
  <div>
    <div
      v-for="item in data"
      :key="item.CustID"
      class="flex justify-between padding bd-bottom"
      @click="select(item)"
    >
      <span>{{ item.CustName }}</span>
      <el-icon v-if="CustID === item.CustID" color="#25b120"><Select /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
defineProps({
  data: {
    type: Object,
    default: () => {
      return []
    }
  }
})

const CustID = ref(0)
const CustInfo = ref(JSON.parse(localStorage.getItem('CustInfo')) || { CustID: 0 })
onMounted(() => {
  CustID.value = CustInfo.value.CustID
})
const emits = defineEmits(['click'])
const select = (e) => {
  emits('click', e)
}
</script>

<style scoped>
.justify-between:hover {
  background-color: rgba(232, 232, 233, 0.897);
}
</style>
