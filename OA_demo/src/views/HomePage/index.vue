<template>
  <div style="background-color: #eaf0f3; width: 100%" class="container">
    <div class="bd-radius-xs padding-l box1" :class="{ boxpadd: !isClose }" ref="pageHeader">
      <div class="box-name padding-bottom-l flex align-items justify-between">
        <span v-if="isLaunch">填写申请</span>
        <el-icon v-else><Plus /></el-icon>
        <el-icon @click="close" v-if="isLaunch"><Fold /></el-icon>
        <el-icon @click="open" v-else><Expand /></el-icon>
      </div>
      <div v-for="(item, ix) in FormData" :key="ix">
        <div class="flex align-items" v-if="isLaunch">
          <SvgIcon
            :iconName="icons[ix % icons.length].icon"
            className="svgIcon"
            :color="icons[ix % icons.length].color"
          >
          </SvgIcon>
          <span>{{ item.FlowTypeName }}({{ item.children.length }})</span>
        </div>
        <div
          v-for="(elem, index) in item.children"
          :key="elem.FlowID"
          class="flex align-items box-name-item margin-left"
          :class="{ nameItem: !isClose }"
          @click="addApply(elem)"
        >
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="elem.FlowName"
            placement="right"
            :disabled="isLaunch"
          >
            <el-image
              style="width: 32px; height: 32px"
              :src="`/static/img/${imgs[index % imgs.length]}.png`"
            />
          </el-tooltip>

          <span class="margin-left" v-if="isLaunch">{{ elem.FlowName }}</span>
        </div>
      </div>
    </div>
    <div class="column margin-top-l" style="flex: 1">
      <div class="flex">
        <div class="box2 padding-l">
          <div class="box-name">
            <div class="padding-bottom-l">审批中心</div>
            <div
              class="flex align-items justify-around"
              style="font-size: 16px; font-weight: 400; height: calc(100% - 41px)"
            >
              <div class="align-items column" style="border-right: 1px #b4b4b4 solid; flex: 1">
                <div style="color: red; font-size: 50px">{{ waitApllyNums }}</div>
                <div>待审批</div>
              </div>
              <div class="align-items column" style="flex: 1">
                <div style="position: relative; text-align: center">
                  <el-image src="../static/img/014.png" style="font-size: 50px" />
                  <div style="top: -10px; right: -5px" class="image-dot">20</div>
                  <div>已审批</div>
                </div>
              </div>
              <div class="align-items column" style="flex: 1">
                <div style="position: relative; text-align: center">
                  <el-image src="../static/img/015.png" style="font-size: 50px" alt="" />
                  <div style="top: -10px; right: -10px" class="image-dot">20</div>
                  <div>已发起</div>
                </div>
              </div>
              <div class="align-items column" style="flex: 1">
                <div style="position: relative; text-align: center">
                  <el-image src="../static/img/016.png" style="font-size: 50px" alt="" />
                  <div style="top: -10px; right: -0px" class="image-dot">20</div>
                  <div>我收到的</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box2 padding-l">
          <div class="box-name" style="overflow-x: auto">
            <div class="padding-bottom-l">数据统计</div>
            <div class="flex justify-between align-items" style="font-size: 16px; font-weight: 400">
              <div
                style="margin-right: 10px"
                class="bd-radius-s column align-items data-total-item"
              >
                <div>本月我的申请数据</div>
                <div style="font-size: 48px">0</div>
              </div>
              <div
                style="margin-right: 10px"
                class="bd-radius-s column align-items data-total-item"
              >
                <div>本月我的审批数据</div>
                <div style="font-size: 48px">0</div>
              </div>
              <div class="bd-radius-s column align-items data-total-item">
                <div>本月抄送我的数据</div>
                <div style="font-size: 48px">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex margin-top-l">
        <div style="flex: 1">
          <div class="bd-radius padding-l box">
            <div class="box-name flex justify-between padding-bottom-l">
              <span>我的审批</span>
              <span class="title-more" @click="goTo('/Approval')"
                >更多<el-icon><ArrowRight /></el-icon
              ></span>
            </div>
            <template v-if="myCheckData.length">
              <div
                v-for="item in myCheckData"
                :key="item.ApplyID"
                class="flex justify-between padding-top-l box-name-item1"
                @click="goToCheck(item)"
              >
                <span>{{ item.ApplyTheme }}</span>
                <span>
                  <span v-if="item.ApplyStatus === 2">
                    <el-tag type="success">{{ item.ApplyStatuStr }}</el-tag>
                  </span>
                  <span v-else-if="item.ApplyStatus === 3">
                    <el-tag type="danger">{{ item.ApplyStatuStr }}</el-tag>
                  </span>
                  <span v-else-if="item.ApplyStatus === 0"></span>
                  <span v-else>
                    <el-tag type="info">{{ item.ApplyStatuStr }}</el-tag>
                  </span>
                  <span style="margin-left: 20px">{{ sub(item.ApplyDate, 5, 16) }}</span>
                </span>
              </div>
            </template>
            <template v-else> <el-empty description="暂无数据" /></template>
          </div>
        </div>
        <div style="flex: 1">
          <div class="bd-radius padding-l box">
            <div class="box-name flex justify-between padding-bottom-l">
              <span>我的申请</span>
              <span class="title-more" @click="goTo('/allApply')"
                >更多<el-icon><ArrowRight /></el-icon
              ></span>
            </div>
            <template v-if="myShenQingData.length">
              <div
                v-for="item in myShenQingData"
                :key="item.ApplyID"
                class="flex justify-between padding-top-l box-name-item1"
                @click="goToCheck(item)"
              >
                <span>{{ item.ApplyTheme }}</span>
                <span>{{ sub(item.ApplyDate, 5, 16) }}</span>
              </div>
            </template>
            <template v-else> <el-empty description="暂无数据" /></template>
          </div>
        </div>
        <div style="flex: 1">
          <div class="bd-radius padding-l box">
            <div class="box-name flex justify-between padding-bottom-l">
              <span>抄送我的</span>
              <span class="title-more" @click="goTo('/sendCopy')"
                >更多<el-icon><ArrowRight /></el-icon
              ></span>
            </div>
            <template v-if="mySendCopyData.length">
              <div
                v-for="item in mySendCopyData"
                :key="item.ApplyID"
                class="flex justify-between padding-top-l box-name-item1"
                @click="goToCheck(item)"
              >
                <span>{{ item.ApplyTheme }}</span>
                <span>{{ sub(item.ApplyDate, 5, 16) }}</span>
              </div>
            </template>
            <template v-else> <el-empty description="暂无数据" /></template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { BasicForm_HisData, getCheckData, getMyApplyData, getSendApplyData } from '@/api/query'
import { dataClassify, sub, statuString } from '@/utils/util'
import { useRouter } from 'vue-router'
import store from '@/store/index'
// import Cookies from 'js-cookie'
// const cxt = getCurrentInstance() //相当于Vue2中的this
// const bus = cxt.appContext.config.globalProperties.$bus
const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
const waitApllyNums = ref()
onMounted(async () => {
  const data0 = await getFormData()
  const data1 = await _getCheckData()
  data1.ReturnData.forEach((item) => {
    item.ApplyStatuStr = statuString(item.ApplyStatus)
  })
  const data2 = await _getMyApplyData()
  const data3 = await _getSendApplyData()
  window.addEventListener('resize', onresize)
  nextTick(() => {
    FormData.value = data0
    myCheckData.value = data1.ReturnData
    waitApllyNums.value = data1.SumData[0].TotalNums
    myShenQingData.value = data2
    mySendCopyData.value = data3
  })
})

const imgs = ref(['001', '002', '003', '004'])
const icons = ref([
  { icon: 'icon-daohang_jiaqinyun', color: '#2A80E2' },
  { icon: 'icon-hangzhengguanli', color: '#412AE2' },
  { icon: 'icon-caiwu', color: '#E22A2A' },
  { icon: 'icon-daichujipiao', color: '#2265D8' }
])
const router = useRouter()
const FormData = ref([])
const getFormData = async () => {
  let { data } = await BasicForm_HisData()
  const dsf = dataClassify(
    data,
    ['FlowTypeID'],
    ['FlowTypeName', 'FlowTypeID', 'FlowTypeSort', 'FlowType']
  )
  return dsf
}

const myCheckData = ref([])
//我的审批
const _getCheckData = async () => {
  const parmas = {
    CheckMan: UserInfo.UserID,
    FlowID: 9999,
    ApplyStatus: -1,
    BeginDate: store.state.SearchOption.BeginDate,
    EndDate: store.state.SearchOption.EndDate,
    Index: 0,
    KeyWords: '',
    pageSize: 10,
    currentPage: 1
  }
  const { data } = await getCheckData(parmas)
  return data
}
const myShenQingData = ref([])
//我的申请
const _getMyApplyData = async () => {
  const parmas = {
    ApplyMan: UserInfo.UserID,
    IsAll: false,
    FlowID: 9999,
    ApplyStatus: 1,
    BeginDate: store.state.SearchOption.BeginDate,
    EndDate: store.state.SearchOption.EndDate,
    KeyWords: '',
    pageSize: 10,
    currentPage: 1
  }
  const { data } = await getMyApplyData(parmas)
  return data
}
const mySendCopyData = ref([])
//抄送我的
const _getSendApplyData = async () => {
  const parmas = {
    SendMan: UserInfo.UserID,
    FlowID: 9999,
    ApplyStatus: -1,
    BeginDate: store.state.SearchOption.BeginDate,
    EndDate: store.state.SearchOption.EndDate,
    KeyWords: '',
    pageSize: 10,
    currentPage: 1
  }
  const { data } = await getSendApplyData(parmas)
  return data
}
const addApply = (e) => {
  localStorage.setItem('pathQuery', JSON.stringify({ FlowID: e.FlowID, FlowName: e.FlowName }))
  router.push({
    path: '/AddApply'
  })
}
const goTo = (path) => {
  // Cookies.set('path', path)
  // bus.emit('savePath', path)
  // store.commit('setRoutePath', path)
  router.push(path)
}

const goToCheck = (e) => {
  router.push({
    path: '/CheckApply',
    query: { FlowID: e.FlowID, ApplyID: e.ApplyID, FlowName: e.FlowName }
  })
}

const isLaunch = ref(localStorage.getItem('isLaunch') == 'false' ? false : true)
const isClose = ref(localStorage.getItem('isLaunch') == 'false' ? false : true)
const open = () => {
  isClose.value = true
  localStorage.setItem('isLaunch', true)
  setTimeout(() => {
    isLaunch.value = true
  }, 500)
}
const close = () => {
  isClose.value = false
  isLaunch.value = false
  localStorage.setItem('isLaunch', false)
}

const pageHeader = ref()
const onresize = () => {
  const ph = pageHeader.value.getBoundingClientRect()
  if (ph.width < 200) {
    isClose.value = false
    isLaunch.value = false
    localStorage.setItem('isLaunch', false)
  }
}

onUnmounted(() => {
  window.removeEventListener('resize', onresize)
})
</script>

<style scoped>
.box {
  background-color: #fff;
  min-height: 100px;
  flex: 1;
  transition: flex 0.5s;
  margin-right: 20px;
  overflow-x: auto;
  overflow: hidden;
}
.box1 {
  background-color: #fff;
  min-height: 100px;
  transition: width 0.5s;
  width: 280px;
  margin: 20px;
  overflow-x: auto;
  overflow: hidden;
  min-width: 50px;
}
.box2 {
  background-color: #fff;
  min-height: 100px;
  flex: 1;
  margin-right: 20px;
  overflow-x: auto;
  overflow: hidden;
}
.boxpadd {
  width: 50px !important;
}
.container {
  display: flex; /* 使用Flexbox布局 */
  flex-direction: row;
  align-items: flex-start;
}
.svgIcon {
  font-size: 12px;
  padding-right: 10px;
}
.box-name-item {
  font-size: 14px;
  padding: 10px;
  transition: padding 0.5s;
}
.box-name-item1 {
  font-size: 15px;
  color: #8a8a8a;
  padding: 10px 0;
}
.box-name-item1:hover {
  background-color: #eeeded;
  border-radius: 4px;
}
.nameItem {
  padding: 10px 0 !important;
}
.box-name-item:hover {
  background-color: #eeeded;
  border-radius: 4px;
}
.box-name {
  font-weight: bolder;
  height: 100%;
  font-family: Source Han Sans CN-Medium;
}
.title-more {
  color: #909399;
  font-size: 13px;
  display: flex;
  font-weight: 300;
  align-items: center;
}
.title-more:hover {
  text-decoration: underline;
  color: rgb(12, 119, 207);
}

.data-total-item {
  min-width: 150px;
  background: linear-gradient(to right, #62b2e6, #5160df);
  padding: 10px;
  color: #fff;
  flex: 1;
}

.image-dot {
  background-color: #3ee871;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  color: #fff;
  float: right;
  position: absolute;
  text-align: center;
}
</style>
