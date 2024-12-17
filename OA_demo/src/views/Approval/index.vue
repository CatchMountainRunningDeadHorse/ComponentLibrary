<template>
  <div class="padding-left-l padding-right-l" style="background-color: #eaf0f3; width: 100%">
    <div style="position: sticky; top: 0; z-index: 99; background-color: #fff" ref="pageHeader">
      <div class="padding" style="background-color: #eaf0f3"></div>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabsClick">
        <el-tab-pane
          :label="item.FlowTypeName"
          :name="item.FlowTypeID"
          v-for="item in treeData"
          :key="item.FlowTypeID"
        >
          <div class="flex padding-bottom padding-left-l" style="flex-wrap: wrap">
            <div
              class="margin-right align-items flex box-card bs-box margin-bottom padding-left-l padding-right-l"
              v-for="(elem, index) in item.children"
              :key="elem.FlowID"
              :class="{ active: queryForm.FlowID === elem.FlowID }"
              @click="handleNodeClick(elem)"
            >
              <el-image
                style="width: 32px; height: 32px"
                :src="`/static/img/${imgs[index % imgs.length]}.png`"
              />
              <span class="text-text margin-left">{{ elem.FlowName }}</span>
              <el-icon><Plus /></el-icon>
              <!-- <span class="num-text">{{ elem.FlowNums }}</span> -->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div style="height: 20px; width: 100%; background-color: #eaf0f3"></div>

      <div class="flex padding-bottom-l" style="flex-wrap: wrap">
        <div class="margin-left-l margin-top-l margin-right-l">
          <el-select v-model="queryForm.Index" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="margin-left-l margin-top-l margin-right-l">
          <el-select v-model="queryForm.ApplyStatus" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="margin-left-l margin-top-l margin-right-l">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
          />
        </div>
        <div class="margin-left-l margin-top-l margin-right-l">
          <el-input
            v-model="queryForm.KeyWords"
            style="width: 240px"
            placeholder="请输入"
            :prefix-icon="Search"
            clearable
          />
        </div>
        <div class="margin-left-l margin-top-l margin-right-l">
          <el-button @click="reset">重置</el-button>
        </div>
        <div class="margin-left-l margin-top-l margin-right-l">
          <el-button type="primary" @click="queryData">查询</el-button>
        </div>
        <div class="margin-left-l margin-top-l margin-right-l">
          <el-button type="primary" @click="addApply('add')">新增</el-button>
        </div>
      </div>
    </div>

    <div style="background-color: #fff">
      <div class="margin-left-l margin-right-l">
        <tableComp
          ref="tables"
          :option="option"
          :tableData="tableData"
          :queryForm="queryForm"
          :hg="hg"
        ></tableComp>
      </div>
      <div
        class="margin-left-l margin-right-l flex justify-end padding-top-l padding-bottom-l"
        style="position: sticky; bottom: 0; background-color: #fff; z-index: 99"
      >
        <el-pagination
          background
          v-show="total > 0"
          v-model:current-page="queryForm.currentPage"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import tableComp from '@/components/tableComp'
import { getFormList, getCheckData, GeneratePdf } from '@/api/query'
import { dataClassify, formatDate, statuString } from '@/utils/util'
import { useRouter } from 'vue-router'
import store from '@/store/index'
import Cookies from 'js-cookie'
import { ElLoading } from 'element-plus'
const imgs = ref(['001', '002', '003', '004'])
const option = ref({
  // 表格列
  columns: [
    {
      label: '状态', //报表编码
      field: 'ApplyStatuStr',
      editField: 'ApplyStatuStr',
      minWidth: ''
    },
    // {
    //   label: '申请编号', //名称
    //   field: 'ApplyNo',
    //   editField: 'ApplyNo'
    // },
    {
      label: '申请时间', //分组,暂时不展示出来
      field: 'ApplyDate',
      editField: 'ApplyDate',
      type: 'date',
      minWidth: ''
    },
    {
      label: '申请人', //分组,暂时不展示出来
      field: 'UserName',
      editField: 'UserName',
      minWidth: ''
    },
    {
      label: '表单名称', //分组,暂时不展示出来
      field: 'FlowName',
      editField: 'FlowName',
      minWidth: ''
    },
    {
      label: '主题', //分组,暂时不展示出来
      field: 'ApplyTheme',
      editField: 'ApplyTheme',
      minWidth: ''
    },
    {
      label: '审批人', //分组,暂时不展示出来
      field: 'CheckManName',
      editField: 'CheckManName',
      minWidth: 200
    }
  ],
  // 表格行按钮
  rowButtons: [
    {
      label: '查看',
      permission: null,
      click: (row) => {
        return checkApply(row)
      }
    },
    {
      label: '导出PDF',
      permission: null,
      click: (row) => {
        return exportPDF(row)
      }
    }
  ]
})

const queryForm = ref({
  BeginDate: store.state.SearchInfo.BeginDate,
  EndDate: store.state.SearchInfo.EndDate,
  FlowID: store.state.SearchInfo.FlowID,
  Index: store.state.SearchInfo.Index,
  ApplyStatus: store.state.SearchInfo.ApplyStatus,
  pageSize: store.state.SearchInfo.pageSize,
  currentPage: store.state.SearchInfo.currentPage,
  KeyWords: store.state.SearchInfo.KeyWords
})

const options = ref([
  { value: 0, label: '待我审批' },
  { value: 1, label: '我参与的' },
  { value: 2, label: '全部审批' }
])

let flowName = ref('')
const handleNodeClick = (data) => {
  flowName.value = data.FlowName
  queryForm.value.FlowID = data.FlowID
  Cookies.set('FlowID', queryForm.value.FlowID)
  Cookies.set('activeName', activeName.value)
  Cookies.set('flowName', flowName.value)
  getTableData()
}
const total = ref(400)

const handleSizeChange = async (val) => {
  queryForm.value.pageSize = val
  await getTableData()
}
const handleCurrentChange = async (val) => {
  queryForm.value.currentPage = val
  await getTableData()
}

const treeData = ref([])
onMounted(async () => {
  if (queryForm.value.Index === 0) {
    options2.value = options3.value
  } else if (queryForm.value.Index === 1) {
    options2.value = options4.value
  } else {
    options2.value = options5.value
  }
  getTreeData()
})

const activeName = ref(1)
const getTreeData = async () => {
  const { data } = await getFormList()
  const dsf = dataClassify(
    data,
    ['FlowTypeID'],
    ['FlowTypeName', 'FlowTypeID', 'FlowTypeSort', 'FlowType']
  )
  flowName.value = Cookies.get('flowName') || data[0].FlowName
  queryForm.value.FlowID = Number(Cookies.get('FlowID')) || data[0].FlowID
  activeName.value = Number(Cookies.get('activeName')) || dsf[0].FlowTypeID
  treeData.value = dsf
  await getTableData()
  window.addEventListener('resize', onresize)
  onresize()
}

const tableData = ref([])
const getTableData = async () => {
  const { data } = await getCheckData(queryForm.value)
  console.log('dddddddddddddddddddd', data)
  data.ReturnData.forEach((item) => {
    item.ApplyStatuStr = statuString(item.ApplyStatus)
  })
  tableData.value = data.ReturnData
  total.value = data.SumData[0].TotalNums
}

//导出PDF
const loading = ref()
const exportPDF = async (e) => {
  const parmas = {
    FlowID: e.FlowID,
    ApplyID: e.ApplyID
  }
  loading.value = ElLoading.service({
    lock: true,
    text: '导出中，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  setTimeout(() => {}, 2000)
  const { data } = await GeneratePdf(parmas)
  const binaryData = base64ToArrayBuffer(data)
  if (binaryData) {
    openPDF(binaryData)
  }
}

const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}
//下载PDF
const downloadPDF = (arrayBuffer) => {
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'file.pdf'
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

//打开PDF
const openPDF = (arrayBuffer) => {
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  loading.value.close()
  window.open(url)
  // Optionally revoke the object URL after some time
  setTimeout(() => {
    window.URL.revokeObjectURL(url)
  }, 10000) // 10 seconds
}
const checkApply = (e) => {
  router.push({
    path: '/CheckApply',
    query: { FlowID: e.FlowID, ApplyID: e.ApplyID, FlowName: flowName.value }
  })
}

const router = useRouter()
const addApply = async () => {
  localStorage.setItem(
    'pathQuery',
    JSON.stringify({ FlowID: queryForm.value.FlowID, FlowName: flowName.value })
  )
  router.push({
    path: '/AddApply'
    // query: { FlowID: queryForm.value.FlowID, FlowName: flowName.value }
  })
}

const reset = () => {
  queryForm.value.Index = store.state.SearchOption.Index
  queryForm.value.BeginDate = store.state.SearchOption.BeginDate
  queryForm.value.EndDate = store.state.SearchOption.EndDate
  queryForm.value.ApplyStatus = store.state.SearchOption.ApplyStatus
  queryForm.value.KeyWords = store.state.SearchOption.KeyWords
  dateRange.value = [queryForm.value.BeginDate, queryForm.value.EndDate]
}
const queryData = () => {
  getTableData()
}

const handleTabsClick = (tab) => {
  const index = tab.index
  flowName.value = treeData.value[index].children[0].FlowName
  queryForm.value.FlowID = treeData.value[index].children[0].FlowID
  Cookies.set('FlowID', queryForm.value.FlowID)
  Cookies.set('activeName', tab.paneName)
  Cookies.set('flowName', flowName.value)
  getTableData()
}
const dateRange = ref([queryForm.value.BeginDate, queryForm.value.EndDate])
watchEffect(() => {
  queryForm.value.BeginDate = formatDate(new Date(dateRange.value[0]))
  queryForm.value.EndDate = formatDate(new Date(dateRange.value[1]))
})
watchEffect(() => {
  store.commit('setSearchInfo', queryForm.value)
})

const options2 = ref([])
const options3 = ref([{ value: 1, label: '审批中' }])
const options4 = ref([{ value: 2, label: '已通过' }])
const options5 = ref([
  { value: -1, label: '全部' },
  { value: 0, label: '草稿' },
  { value: 1, label: '审批中' },
  { value: 2, label: '已通过' },
  { value: 3, label: '已否决' },
  { value: 4, label: '已撤回' },
  { value: 5, label: '已通过撤回中' }
])
watch(
  () => queryForm.value.Index,
  (newVal) => {
    if (newVal === 0) {
      options2.value = options3.value
      queryForm.value.ApplyStatus = 1
    } else if (newVal === 1) {
      options2.value = options4.value
      queryForm.value.ApplyStatus = 2
    } else {
      options2.value = options5.value
      queryForm.value.ApplyStatus = -1
    }
  }
)

const pageHeader = ref()
const hg = ref()
const onresize = () => {
  const ph = pageHeader.value.getBoundingClientRect()
  hg.value = window.innerHeight - 132 - ph.height
}
onUnmounted(() => {
  window.removeEventListener('resize', onresize)
})
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
:deep .el-tabs__item {
  padding: 0 20px !important;
}
.box-card {
  /* width: 220px; */
  height: 64px;
  background: #e4eaf3;
  border-radius: 6px 6px 6px 6px;
}
.box-card .text-text {
  font-family:
    Source Han Sans CN,
    Source Han Sans CN;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  line-height: 0px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
.box-card .num-text {
  font-family: D-DIN-PRO, D-DIN-PRO;
  font-weight: bold;
  font-size: 30px;
  color: #333333;
  margin-left: 16px;
}
.active {
  background: #b4d2ff;
  border-radius: 6px 6px 6px 6px;
  border: 2px solid #4488ff;
}
</style>
