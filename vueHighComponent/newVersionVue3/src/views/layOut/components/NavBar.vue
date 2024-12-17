<template>
  <div>
    <div class="row justCenter">
      <div class="row">
        <div
          style="width: 200px; height: 60px"
          class="flex justify-center align-items bd-right bs-box"
        >
          <img src="" style="width: 126px; height: 36px" />
        </div>
        <div class="row padding-left-l">
          <div class="v-center margin-right flex">
            <el-icon v-if="isClose"><Expand @click="changeIsClose" /></el-icon>
            <el-icon v-else><Fold @click="changeIsClose" /></el-icon>
          </div>
          <el-breadcrumb separator="/" class="v-center">
            <el-breadcrumb-item v-for="item in breadcrumb" :key="item.path">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="row v-center padding-right-l" style="font-size: 14px">
        <menuPopup position="bottom" :menuPopup="menuPopups">
          <el-icon><User /></el-icon>
          <div>admin</div>
          <el-icon><CaretBottom /></el-icon>
        </menuPopup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import menuPopup from '@/components/menuPopup.vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { useUserRoutersStore } from '@/stores/store'
const cxt = getCurrentInstance()
const bus = cxt.appContext.config.globalProperties.$bus

const props = defineProps({
  breadcrumb: {}
})
const emits = defineEmits(['change'])
const isClose = ref(false)
const menuPopups = ref([
  {
    label: '团队切换',
    disable: false,
    click: () => {}
  },
  {
    label: '退出登录',
    disable: false,
    click: () => {
      logOut()
    }
  }
])
const changeIsClose = () => {
  isClose.value = !isClose.value
}
const setRouter = useUserRoutersStore()
const router = useRouter()
const logOut = () => {
  localStorage.clear()
  Cookies.remove('isLogin')
  setRouter.setHasAuth(false)
  router.push('/login')
}

watch(isClose, (newVal) => {
  emits('change', newVal)
})

watch(
  props,
  (newVal) => {
    bus.emit('pathBackward', newVal.breadcrumb[0].path)
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.v-center {
  display: flex;
  align-items: center;
}

.justCenter {
  justify-content: space-between;
  background: linear-gradient(to right, #dfeef6, #e0e5f5);
}
.margin-right:hover {
  cursor: pointer;
}

.row {
  display: flex;
  flex-direction: row;
  color: #333;
}
</style>
