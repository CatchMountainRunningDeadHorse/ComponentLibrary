<template>
  <div class="row justCenter">
    <div class="row">
      <div
        style="width: 200px; height: 60px"
        class="flex justify-center align-items bd-right bs-box"
      >
        <img src="/static/img/yylogo.png" style="width: 126px; height: 36px" />
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
      <div class="margin-right">{{ CustInfo.CustName }}</div>
      <menuPopup position="bottom" :menuPopup="menuPopups">
        <el-icon><User /></el-icon>
        <div>{{ UserInfo.UserName }}</div>
        <el-icon><CaretBottom /></el-icon>
      </menuPopup>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" v-if="dialogVisible" title="选择客户" style="height: 50%">
    <CustSelect :data="CustList" @click="selectedCust"></CustSelect>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted, inject, getCurrentInstance } from 'vue'
import menuPopup from '@/components/menuPopup.vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import CustSelect from '@/views/login/components/CustSelect.vue'
import store from '@/store'
import { formatDate, oneMonthBefore } from '@/utils/util'
import { UserInfo_GetData, GetOBSInfo } from '@/api/query'
import Cookies from 'js-cookie'
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
    click: (row) => {
      return changeTeam(row)
    }
  },
  {
    label: '退出登录',
    disable: false,
    click: (row) => {
      return logOut(row)
    }
  }
])
const UserInfo = ref({})
const router = useRouter()
const CustList = ref(JSON.parse(localStorage.getItem('CustList')))
const CustInfo = ref(JSON.parse(localStorage.getItem('CustInfo')))
const shdfbjh = ref()
onMounted(() => {
  UserInfo.value = JSON.parse(localStorage.getItem('UserInfo'))
  shdfbjh.value = props.breadcrumb[0].path
})
const changeIsClose = () => {
  isClose.value = !isClose.value
}

const logOut = () => {
  ElMessageBox.confirm(`确认要退出登录吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    localStorage.clear()
    Cookies.remove('isLogin')
    Cookies.remove('FlowID')
    Cookies.remove('activeName')
    Cookies.remove('flowName')
    Cookies.remove('path')
    router.push('/login')
  })
}

const dialogVisible = ref(false)
const changeTeam = () => {
  dialogVisible.value = true
}

const reload = inject('reload')
const CustGuid = ref('')
const selectedCust = async (e) => {
  dialogVisible.value = false
  CustGuid.value = e.CustGuid
  CustInfo.value = e
}

const reNewCache = (val) => {
  localStorage.setItem('CustGuid', val)
  localStorage.setItem('CustInfo', JSON.stringify(CustInfo.value))
  Cookies.remove('FlowID')
  Cookies.remove('activeName')
  Cookies.remove('flowName')
  store.commit('setSearchInfo', {
    BeginDate: formatDate(oneMonthBefore(new Date())),
    EndDate: formatDate(new Date()),
    FlowID: 0,
    Index: 0,
    ApplyStatus: 1,
    pageSize: 20,
    currentPage: 1,
    KeyWords: ''
  })
  UserInfo_GetData().then((res) => {
    res.data.forEach((item) => {
      item.checked = false
    })
    localStorage.setItem('UserList', JSON.stringify(res.data))
  })

  GetOBSInfo().then((res) => {
    localStorage.setItem('OBSInfo', JSON.stringify(res.data))
  })
  reload()
}

watch(isClose, (newVal) => {
  emits('change', newVal)
})

watch(CustGuid, (newVal) => {
  reNewCache(newVal)
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
}
</style>
