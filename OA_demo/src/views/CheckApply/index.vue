<template>
  <div
    class="padding-left-l padding-right-l eaf0f3"
    style="background-color: #eaf0f3; font-size: 16px; width: 100%"
  >
    <div ref="pageCheck">
      <div style="background-color: #fff; position: sticky; z-index: 99; top: 0">
        <div class="padding eaf0f3"></div>
        <div class="align-items flex" style="padding: 15px 20px">
          <div class="align-items flex backTag" @click="goBack">
            <el-icon><Back /></el-icon>
            <div class="padding-left-s align-items header-text">返回</div>
          </div>
          <span style="height: 30px; margin: 0 15px" class="bd-left bs-box"></span>
          <span class="header-text">{{ route.query.FlowName }}(查看)</span>
        </div>
      </div>
      <div class="padding eaf0f3"></div>
    </div>
    <div class="flex justify-between" style="overflow: hidden">
      <div
        style="background-color: #fff; width: 64%; padding: 20px 0 20px 20px; overflow-y: auto"
        :style="leftSide"
      >
        <div>
          <span style="color: #2387f9">▎</span>
          <span>基本信息</span>
        </div>
        <div class="flex basic-info">
          <div class="basic-text">
            <span>申请编号：</span>
            <span>{{ ApplyData.ApplyNo }}</span>
          </div>
          <div class="basic-text">
            <span>申请日期：</span>
            <span>{{ sub(ApplyData.ApplyDate, 0, 19) }}</span>
          </div>
          <div class="basic-text">
            <span>申请主题：</span>
            <span>{{ ApplyData.ApplyTheme }}</span>
          </div>
          <div class="basic-text">
            <span>申请人：</span>
            <span>{{ ApplyData.UserName }}</span>
          </div>
          <div class="basic-text" v-for="(item, index) in fieldData" :key="index + item.FlowID">
            <span>{{ item.FieldName }}：</span>
            <span>{{ item.FieldValue }}</span>
          </div>
        </div>
        <div class="justify-center flex padding-top padding-bottom-l">
          <template v-if="ApplyData.ApplyStatus == 1 && IsCheckMan && IsChecking">
            <el-button type="success" size="large" @click="checkPass">同意</el-button>
            <el-button type="warning" size="large" @click="changeCheck">转交</el-button>
            <el-button type="danger" size="large" @click="checkUnPass">拒绝</el-button>
            <template v-if="IsApplyMan">
              <el-button type="info" size="large" @click="cancelApply">撤回</el-button>
            </template>
          </template>
          <template v-else-if="ApplyData.ApplyStatus == 5 && IsCheckMan && IsChecking">
            <el-button type="success" size="large" @click="agree">通过</el-button>
            <el-button type="warning" size="large" @click="disAgree">驳回</el-button>
          </template>
          <template v-else-if="ApplyData.ApplyStatus == 1 && IsApplyMan">
            <el-button type="warning" size="large" @click="noticeCheck">催审</el-button>
            <el-button type="info" size="large" @click="cancelApply">撤回</el-button>
            <el-button type="danger" size="large" @click="deleteApply">删除</el-button>
          </template>
          <template v-else-if="ApplyData.ApplyStatus == 4 && IsApplyMan">
            <el-button type="info" size="large" @click="copyApply">复制</el-button>
          </template>
          <template v-else-if="ApplyData.ApplyStatus == 2 && IsApplyMan && !HasCancelApply">
            <el-button type="info" size="large" @click="cancelPassApply">通过后撤回</el-button>
          </template>
        </div>
        <div v-if="ImageData.length">
          <span style="color: #2387f9">▎</span>
          <span>附件</span>
        </div>
        <div class="flex" style="flex-wrap: wrap" v-if="ImageData.length">
          <div v-for="item in ImageData" :key="item.ImageID" class="flex padding">
            <el-image
              v-if="item.ImageType === 'image'"
              :src="item.ImageUrl"
              class="picture-Card"
              fit="contain"
              infinite
              :preview-src-list="[item.ImageUrl]"
            />
            <div v-else class="picture-Card border bd-radius flex align-items">
              <span>{{ item.ImageName }}</span>
            </div>
          </div>
        </div>
        <div v-if="RelateApplyData.length">
          <span style="color: #2387f9">▎</span>
          <span>关联审批单</span>
        </div>
        <template v-if="RelateApplyData.length">
          <div v-for="(item, index) in RelateApplyData" :key="index" style="padding: 10px 20px">
            {{ item }}
          </div>
        </template>
        <div v-if="FlowData.length">
          <span style="color: #2387f9">▎</span>
          <span>审批</span>
        </div>
        <div class="padding-right">
          <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column align="center" prop="CheckFlowName" label="审批流程" width="180">
              <template #default="scope">
                <span
                  >{{ scope.row.CheckFlowName }}({{
                    scope.row.CheckWay === 1 ? '会签' : '或签'
                  }})</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" prop="CheckMan" label="审批人">
              <template #default="scope">
                <div>{{ IDTureName(scope.row.CheckMan) }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="CheckDetail" label="审批结果">
              <template #default="scope">
                <div v-if="scope.row.CheckResult === 2">
                  <el-tag type="success">{{ scope.row.CheckDetail }}</el-tag>
                </div>
                <div v-else-if="scope.row.CheckResult === 3">
                  <el-tag type="danger">{{ scope.row.CheckDetail }}</el-tag>
                </div>
                <div v-else-if="scope.row.CheckResult === 0"></div>
                <div v-else>
                  <el-tag type="info">{{ scope.row.CheckDetail }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="UserSign" label="签名">
              <template #default="scope">
                <div v-if="IsIncludes(scope.row.CheckResult, [0, 1])"></div>
                <div v-else>
                  <el-image
                    :src="'data:image/png;base64,' + scope.row.UserSign"
                    style="height: 29px"
                    infinite
                  />
                  <!-- <div>{{ scope.row.UserSign.split(',') }}</div> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="CheckDate" label="审批时间">
              <template #default="scope">
                <div>
                  {{ sub(scope.row.CheckDate, 0, 19) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
        style="background-color: #fff; width: 32%; padding: 20px 0 20px 20px; overflow-y: auto"
        :style="leftSide"
      >
        <div v-if="SendManData.length">
          <span style="color: #2387f9">▎</span>
          <span>抄送</span>
        </div>
        <div class="flex gap-2 margin-top" style="flex-wrap: wrap" v-if="SendManData.length">
          <el-tag
            type="primary"
            v-for="item in SendManData"
            :key="item.SendManID"
            class="margin-right margin-bottom"
            >{{ item.UserName }}</el-tag
          >
        </div>
        <div>
          <span style="color: #2387f9">▎</span>
          <span>跟踪记录</span>
        </div>
        <div class="padding-right">
          <el-table :data="RecordData" style="width: 100%; margin-top: 20px" stripe>
            <el-table-column align="center" prop="CheckManName" label="人员" width="100" />
            <el-table-column align="center" prop="CheckDetail" label="记录" />
            <el-table-column align="center" prop="DoDate" label="记录时间">
              <template #default="scope">
                <span>{{ sub(scope.row.DoDate, 0, 19) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- //审批弹窗 -->
    <el-dialog v-model="showCheckDialog" v-if="showCheckDialog" title="审批" width="500">
      <el-input
        v-model="CheckDetail"
        type="textarea"
        placeholder="请输入审批意见"
        :maxlength="100"
        :show-word-limit="true"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="onClose">取消</el-button>
          <el-button type="primary" @click="onCheckPass"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 转交弹窗 -->
    <el-dialog v-model="showTransferDialog" v-if="showTransferDialog" title="转交" width="500">
      <Radio :data="checkData2" @myClick="CustomClick2"></Radio>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, onUnmounted, watchEffect } from 'vue'
import {
  Apply_GetApplyDetail,
  Apply_DoCheckFlow,
  Apply_TakeOverFlow,
  Apply_CancelCheck,
  Apply_DoCancelPassFlow,
  Apply_Delete,
  NoticeCheck_PushMsg,
  Apply_CancelPassCheck
} from '@/api/query'
import { sub, uniqueFunc, IsIncludes } from '@/utils/util'
import Radio from '@/components/Radio.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const UserList = ref(JSON.parse(localStorage.getItem('UserList')))
//自定义合并列的计算方法
const objectSpanMethod = ({ row, column, rowIndex }) => {
  if (column.property === 'CheckFlowName') {
    if (rowIndex === 0 || row.CheckFlowID !== tableData.value[rowIndex - 1].CheckFlowID) {
      let rowspan = 1
      for (let i = rowIndex + 1; i < tableData.value.length; i++) {
        if (tableData.value[i].CheckFlowID === row.CheckFlowID) {
          rowspan++
        } else {
          break
        }
      }
      return {
        rowspan,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}
const UserSign = ref(localStorage.getItem('UserSign'))
onMounted(() => {
  GetApplyDetail()
})

const leftSide = ref({
  height: '718px'
})
const pageCheck = ref()
const ApplyData = ref({})
const fieldData = ref([])
// const fieldDetailData = ref([])
const FlowData = ref([])
const SendManData = ref([])
const RecordData = ref([])
const ImageData = ref([])
const RelateApplyData = ref([])
const IsApplyMan = ref(false)
const router = useRouter()
const route = useRoute()
const tableData = ref([])
const collectData = ref()
const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))

//初始化变量
const init = () => {
  IsApplyMan.value = false
  IsCheckMan.value = false
  IsChecking.value = false
  NowCheckLevel.value = ''
  NowCheckFlowID.value = ''
  NowCheckMan_g = []
  NowChecResult_g = []
  HasCancelApply.value = false
  NowCancelChecResult = []
}
const GetApplyDetail = async () => {
  init()
  const { data } = await Apply_GetApplyDetail(route.query)
  console.log('111111111111111111111', data)
  collectData.value = JSON.parse(JSON.stringify(data))
  ApplyData.value = data.ApplyData[0]
  fieldData.value = JSON.parse(data.ApplyData[0].ApplyJson).concat(
    JSON.parse(data.ApplyData[0].ApplyJsonDetail).flat(Infinity)
  )
  SendManData.value = data.SendManData
  data.RecordData.forEach((item) => {
    if (item.CheckMan === 0) {
      const user = UserList.value.filter((elem) => {
        return elem.UserID === item.DoMan
      })
      if (user.length) {
        item.CheckManName = user[0].UserName
      }
    }
  })

  RecordData.value = data.RecordData
  ImageData.value = data.ImageData
  RelateApplyData.value = data.RelateApplyData
  if (data.ApplyData[0].ApplyMan === UserInfo.UserID) {
    IsApplyMan.value = true
  } else {
    IsApplyMan.value = false
  }
  tableData.value = JSON.parse(JSON.stringify(data.FlowData))
  handleFlow(data.FlowData)
  handleCancelFlow(data.CancelFlowData)
  window.addEventListener('resize', onresize)
  onresize()
}

const IDTureName = (val) => {
  const data = UserList.value.filter((item) => {
    return item.UserID === val
  })
  if (data.length) {
    return data[0].UserName
  }
  return
}

const hg = ref()
const onresize = () => {
  const pc = pageCheck.value.getBoundingClientRect()
  hg.value = window.innerHeight - 100 - pc.height
}

onUnmounted(() => {
  window.removeEventListener('resize', onresize)
})

watchEffect(() => {
  leftSide.value.height = hg.value + 'px'
})

const IsCheckMan = ref(false)
const IsChecking = ref(false)
const NowCheckLevel = ref('')
const NowCheckFlowID = ref('')
let NowCheckMan_g = [],
  NowChecResult_g = []
const handleFlow = (flowData) => {
  let NowCheckMan_i = [],
    NowChecResult_i = []
  if (flowData.length > 0) {
    for (let i = 0; i < flowData.length; i++) {
      let arr = [],
        arr2 = [],
        arr3 = []
      flowData[i].CheckWayName = flowData[i].CheckWay == 1 ? '会签' : '或签'
      for (let j = 0; j < flowData.length; j++) {
        if (flowData[i].CheckFlowID == flowData[j].CheckFlowID) {
          let obj = {},
            deptObj = {}
          if (flowData[j].DeptID > 0) {
            deptObj.id = flowData[j].DeptID
            deptObj.label = flowData[j].DeptName
            deptObj.deptMan = flowData[j].CheckMan
            arr3.push(deptObj)
          } else {
            if (ApplyData.value.ApplyStatus == 0) {
              //草稿
              if (Object.keys(flowData[i]).includes('CheckManList')) {
                arr = flowData[i].CheckManList.split(',')
              } else {
                arr.push(flowData[j].CheckMan)
              }
            } else {
              arr.push(flowData[j].CheckMan)
            }
          }
          obj.CheckMan = flowData[j].CheckMan
          obj.CheckResult = flowData[j].CheckResult
          obj.UserSign = `data:image/png;base64,${flowData[j].UserSign}`
          arr2.push(obj)
        }
      }
      flowData[i].CheckManList = arr
      flowData[i].CheckManListStr = arr.join(',')
      flowData[i].CheckManNameList = []
      UserList.value.forEach((item) => {
        if (arr.includes(item.UserID)) {
          flowData[i].CheckManNameList.push(item.UserName)
        }
      })
      flowData[i].CheckDept = arr3
      flowData[i].CheckDeptStr = arr3.join(',')
      flowData[i].CheckResultList = arr2
      if (flowData[i].NowCheckLevel === flowData[i].CheckLevel && flowData[i].IsStartFlow) {
        NowCheckMan_i = arr
        NowChecResult_i = arr2
        NowCheckFlowID.value = flowData[i].CheckFlowID
        NowCheckLevel.value = flowData[i].NowCheckLevel
      }
      flowData[i].UserSign = `data:image/png;base64,${flowData[i].UserSign}`
    }
    flowData.sort((a, b) => a.CheckLevel - b.CheckLevel)
    FlowData.value = uniqueFunc(flowData, 'CheckFlowID')
    NowCheckMan_g = NowCheckMan_i
    NowChecResult_g = NowChecResult_i
  }

  if (NowCheckMan_i.join(',').indexOf(UserInfo.UserID.toString()) > -1) {
    IsCheckMan.value = true
  } else {
    IsCheckMan.value = false
  }

  for (var i = 0, len = NowChecResult_i.length; i < len; i++) {
    if (NowChecResult_i[i].CheckMan == UserInfo.UserID && NowChecResult_i[i].CheckResult == 1) {
      IsChecking.value = true
      break
    }
  }
}

//已通过撤回流程信息
// let NowCancelCheckFlowID = 0,
//   NowCancelCheckLevel = 0,
//   NowCancelCheckMan = [],
let NowCancelChecResult = []
const HasCancelApply = ref(false)
const handleCancelFlow = (cancelflowData) => {
  if (cancelflowData != undefined && cancelflowData.length > 0) {
    for (var i = 0; i < cancelflowData.length; i++) {
      var arr = [],
        arr2 = []
      cancelflowData[i].CheckWayName = cancelflowData[i].CheckWay == 1 ? '会签' : '或签'
      for (var j = 0, jlen = cancelflowData.length; j < jlen; j++) {
        if (cancelflowData[i].CheckFlowID == cancelflowData[j].CheckFlowID) {
          var obj = {}
          arr.push(cancelflowData[j].CheckMan)
          obj.CheckMan = cancelflowData[j].CheckMan
          obj.CheckResult = cancelflowData[j].CheckResult
          obj.UserSign = `data:image/png;base64,${cancelflowData[j].UserSign}`
          arr2.push(obj)
        }
      }
      cancelflowData[i].CheckManList = arr
      cancelflowData[i].CheckResultList = arr2
      // NowCancelCheckMan = arr
      NowCancelChecResult = arr2
      // NowCancelCheckFlowID = cancelflowData[i].CheckFlowID
      // NowCancelCheckLevel = cancelflowData[i].CheckLevel
      //cancelflowData[i].UserSign = `data:image/png;base64,${cancelflowData[i].UserSign}`
    }
    cancelflowData.sort((a, b) => b.CheckResult - a.CheckResult)
    cancelflowData = uniqueFunc(cancelflowData, 'CheckFlowID')
    HasCancelApply.value = true

    //撤回
    for (let i = 0; i < NowCancelChecResult.length; i++) {
      if (
        NowCancelChecResult[i].CheckMan == UserInfo.UserID &&
        NowCancelChecResult[i].CheckResult == 5
      ) {
        IsChecking.value = true
        break
      }
    }
  }
}

const showCheckDialog = ref(false) //是否显示审批弹窗
const CheckResult = ref() //审批结果
const CheckDetail = ref('') //审批意见内容
const checkPass = () => {
  CheckResult.value = 2
  showCheckDialog.value = true
}

const checkUnPass = () => {
  CheckResult.value = 3
  showCheckDialog.value = true
}
const onCheckPass = async () => {
  showCheckDialog.value = false
  const CheckSignID = UserSign.value ? 1 : 0
  const params = {
    FlowID: ApplyData.value.FlowID,
    ApplyID: ApplyData.value.ApplyID,
    CheckFlowID: NowCheckFlowID.value,
    CheckLevel: NowCheckLevel.value,
    CheckResult: CheckResult.value,
    CheckDetail: CheckDetail.value,
    CheckSignID: CheckSignID
  }
  await Apply_DoCheckFlow(params)
  GetApplyDetail()
  CheckDetail.value = ''
}
const showTransferDialog = ref()
const checkData2 = ref([])
const changeCheck = () => {
  showTransferDialog.value = true
  checkData2.value = UserList.value
}
const CustomClick2 = async (e) => {
  showTransferDialog.value = false
  if (e) {
    const params = {
      ApplyID: ApplyData.value.ApplyID,
      CheckFlowID: NowCheckFlowID.value,
      CheckLevel: NowCheckLevel.value,
      TakeOverMan: e.UserID
    }
    await Apply_TakeOverFlow(params)
    GetApplyDetail()
  }
}
const cancelApply = async () => {
  const params = {
    ApplyID: ApplyData.value.ApplyID,
    FlowID: ApplyData.value.FlowID
  }
  await Apply_CancelCheck(params)
  GetApplyDetail()
}
const agree = async () => {
  const params = {
    ApplyID: ApplyData.value.ApplyID,
    FlowID: ApplyData.value.FlowID,
    CheckResult: 2
  }
  await Apply_DoCancelPassFlow(params)
  GetApplyDetail()
}
const disAgree = async () => {
  const params = {
    ApplyID: ApplyData.value.ApplyID,
    FlowID: ApplyData.value.FlowID,
    CheckResult: 3
  }
  await Apply_DoCancelPassFlow(params)
  GetApplyDetail()
}
const deleteApply = async () => {
  ElMessageBox.confirm(`确认要删除吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data } = await Apply_Delete({ ApplyID: ApplyData.value.ApplyID })
      router.go(-1)
      ElMessage({
        type: 'success',
        message: data
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}
const noticeCheck = async () => {
  //过滤审核人员
  let pushMan = NowChecResult_g.filter((item) => {
    console.log(item.CheckResult)
    //return item.CheckResult.indexOf("1") > -1;
    return item.CheckResult === 1
  })
  var arr = []
  for (var i = 0; i < pushMan.length; i++) {
    var obj = {}
    obj.CheckMan = pushMan[i].CheckMan
    arr.push(obj)
  }
  const params = {
    ApplyID: ApplyData.value.ApplyID,
    FlowID: ApplyData.value.FlowID,
    PushManJson: JSON.stringify(arr)
  }
  const { data } = await NoticeCheck_PushMsg(params)
  ElMessage({
    type: 'info',
    message: data
  })
}
const copyApply = () => {
  const result = collectData.value
  const data = {
    fieldData: result.ApplyData[0].ApplyJson,
    fieldDetail: result.ApplyData[0].ApplyJsonDetail,
    SendManData: JSON.stringify(result.SendManData),
    RelateApplyData: JSON.stringify(result.RelateApplyData),
    FlowData: JSON.stringify(result.FlowData)
  }
  localStorage.setItem(
    'pathQuery',
    JSON.stringify({
      FlowID: ApplyData.value.FlowID,
      FlowName: ApplyData.value.FlowName,
      data: JSON.stringify(data)
    })
  )
  router.push({
    path: '/AddApply'
    // query: {
    //   FlowID: ApplyData.value.FlowID,
    //   FlowName: ApplyData.value.FlowName,
    //   data: JSON.stringify(data)
    // }
  })
}
const cancelPassApply = async () => {
  const params = {
    ApplyID: ApplyData.value.ApplyID,
    FlowID: ApplyData.value.FlowID
  }
  const { data } = await Apply_CancelPassCheck(params)
  ElMessage({
    type: 'info',
    message: data
  })
  GetApplyDetail()
}

const goBack = () => {
  router.go(-1)
}

const onClose = () => {
  showCheckDialog.value = false
  CheckDetail.value = ''
}
</script>

<style scoped>
.backTag {
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
}
.backTag:hover {
  background-color: #e7e7e7;
}
.header-text {
  color: #333333;
  font-weight: 400;
}
.picture-Card {
  height: var(--el-upload-picture-card-size);
  width: var(--el-upload-picture-card-size);
}
:deep .el-upload--picture-card {
  --el-upload-picture-card-size: 100px;
}

.padding .picture-Card:nth-child(n) {
  margin-right: 20px;
}
:deep .el-table th.el-table__cell {
  background-color: transparent;
}
:deep .el-table__header-wrapper {
  --el-table-tr-bg-color: #ebf1fb;
  --el-table-header-text-color: #666666;
}
:deep .el-table thead th {
  font-weight: 400;
}

.eaf0f3 {
  background-color: #eaf0f3;
}
.basic-text {
  height: 20px;
  width: 40%;
  font-family:
    Source Han Sans CN,
    Source Han Sans CN;
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  padding: 8px 15px;
  margin: 10px 0;
  background-color: #eceeef;
}
.basic-info {
  flex-wrap: wrap;
  margin: 10px 40px;
  justify-content: space-between;
}
</style>
