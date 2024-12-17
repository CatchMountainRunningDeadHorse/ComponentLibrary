<template>
  <div
    class="padding-left-l padding-right-l eaf0f3"
    style="background-color: #eaf0f3; font-size: 16px; width: 100%"
  >
    <div style="background-color: #fff; position: sticky; z-index: 99; top: 0">
      <div class="padding eaf0f3"></div>
      <div class="align-items flex" style="padding: 15px 20px">
        <div class="align-items flex backTag" @click="goBack">
          <el-icon><Back /></el-icon>
          <div class="padding-left-s align-items header-text">返回</div>
        </div>
        <span style="height: 30px; margin: 0 15px" class="bd-left bs-box"></span>
        <span class="header-text">{{ pathQuery.FlowName }}(新增)</span>
      </div>
    </div>
    <div class="padding eaf0f3"></div>
    <div class="justify-center flex">
      <div style="background-color: #fff; min-width: 800px; max-width: 1200px" class="padding-l">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
          <div>
            <span style="color: #2387f9">▎</span>
            <span>基本信息</span>
          </div>
          <div class="flex" style="flex-wrap: wrap">
            <div style="flex: 0 0 50%">
              <el-form-item label="申请主题">
                <el-input v-model="form.theme" disabled />
              </el-form-item>
            </div>
            <div v-for="(item, index) in fieldData" :key="index" style="flex: 0 0 50%">
              <el-form-item :label="item.FieldName" :prop="item.FieldColumn">
                <el-input v-model="form[item.FieldColumn]" v-if="item.FieldType === '单行框'" />
                <el-input
                  type="textarea"
                  v-model="form[item.FieldColumn]"
                  v-else-if="item.FieldType === '多行框'"
                />
                <el-input
                  type="number"
                  v-model="form[item.FieldColumn]"
                  v-else-if="item.FieldType === '数字框'"
                />
                <el-date-picker
                  v-else-if="item.FieldType === '日期框'"
                  v-model="form[item.FieldColumn]"
                  type="date"
                  placeholder="请选择"
                  size="default"
                />
                <template v-else-if="item.FieldType === '日期框(上下午)'">
                  <AmPmDate v-model="form[item.FieldColumn]"></AmPmDate>
                </template>
                <el-date-picker
                  v-else-if="item.FieldType === '日期框(时间)'"
                  v-model="form[item.FieldColumn]"
                  type="datetime"
                  placeholder="请选择"
                  format="YYYY-MM-DD HH:mm"
                />
                <el-select
                  v-model="form[item.FieldColumn]"
                  placeholder="请选择下拉信息"
                  v-else-if="item.FieldType === '下拉框'"
                >
                  <el-option
                    v-for="(it, ix) in item.FieldSelectData.split('\n')"
                    :key="ix"
                    :label="it"
                    :value="it"
                  />
                </el-select>
                <el-checkbox-group
                  v-model="form[item.FieldColumn]"
                  v-else-if="item.FieldType === '多选框'"
                >
                  <el-checkbox
                    v-for="(it, ix) in item.FieldSelectData.split('\n')"
                    :key="ix"
                    :label="it"
                    :value="it"
                  />
                </el-checkbox-group>
                <el-input
                  type="checkbox"
                  v-model="form[item.FieldColumn]"
                  v-else-if="item.FieldType === '选择人员'"
                />
              </el-form-item>
            </div>
          </div>
          <div v-for="(elem, it) in fieldDetailData" :key="it">
            <div v-if="fieldDetailData.length">
              <span style="color: #2387f9">▎</span>
              <span>{{ form.theme }}明细{{ it + 1 }}</span>
              <span
                class="margin-right-l padding-s"
                style="color: dodgerblue"
                @click="copyDetail(elem, it)"
                >复制</span
              >
              <span
                class="margin-right-l padding-s"
                style="color: dodgerblue"
                v-if="fieldDetailData.length > 1"
                @click="deleteDetail(it)"
                >删除</span
              >
            </div>
            <div class="flex" style="flex-wrap: wrap" v-if="fieldDetailData.length">
              <template v-for="(item, index) in elem" :key="index">
                <div style="flex: 0 0 50%">
                  <el-form-item :label="item.FieldName" required>
                    <el-input v-model="item.FieldValue" v-if="item.FieldType === '单行框'" />
                    <el-input
                      type="textarea"
                      v-model="item.FieldValue"
                      v-else-if="item.FieldType === '多行框'"
                    />
                    <el-input
                      type="number"
                      v-model="item.FieldValue"
                      v-else-if="item.FieldType === '数字框'"
                    />
                    <el-date-picker
                      v-else-if="item.FieldType === '日期框'"
                      v-model="item.FieldValue"
                      type="date"
                      placeholder="请选择"
                      size="default"
                    />
                    <template v-else-if="item.FieldType === '日期框(上下午)'">
                      <AmPmDate v-model="item.FieldValue"></AmPmDate>
                    </template>
                    <el-date-picker
                      v-else-if="item.FieldType === '日期框(时间)'"
                      v-model="item.FieldValue"
                      type="datetime"
                      placeholder="请选择"
                      format="YYYY-MM-DD HH:mm"
                    />
                    <el-select
                      v-model="item.FieldValue"
                      placeholder="请选择下拉信息"
                      v-else-if="item.FieldType === '下拉框'"
                    >
                      <el-option
                        v-for="(it, ix) in item.FieldSelectData.split('\n')"
                        :key="ix"
                        :label="it"
                        :value="it"
                      />
                    </el-select>
                    <el-checkbox-group
                      v-model="item.FieldValue"
                      v-else-if="item.FieldType === '多选框'"
                    >
                      <el-checkbox
                        v-for="(it, ix) in item.FieldSelectData.split('\n')"
                        :key="ix"
                        :label="it"
                        :value="it"
                      />
                    </el-checkbox-group>
                    <el-input
                      type="checkbox"
                      v-model="item.FieldValue"
                      v-else-if="item.FieldType === '选择人员'"
                    />
                  </el-form-item>
                </div>
              </template>
            </div>
          </div>
          <div>
            <span style="color: #2387f9">▎</span>
            <span>附件</span>
          </div>
          <div class="flex padding">
            <div v-for="(item, index) in fileList" :key="index" class="felx">
              <el-image
                v-if="item.type === 'image'"
                class="picture-Card"
                :src="item.url"
                fit="contain"
                infinite
                :preview-src-list="[item.url]"
              />
              <div v-else class="picture-Card border bd-radius flex align-items">
                <span>{{ item.name }}</span>
              </div>
            </div>
            <el-upload
              v-model:file-list="fileList"
              list-type="picture-card"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="beforeUpload"
              class="picture-Card"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>

          <div>
            <span style="color: #2387f9">▎</span>
            <span>关联审批单</span>
            <span
              class="margin-l padding-left-s padding-right-s bd-radius-s"
              style="border: 1px red solid; color: red"
              >选择</span
            >
          </div>
          <div
            style="margin: 20px 40px; font-size: 14px"
            v-for="(item, index) in relateApplyList"
            :key="index"
          >
            {{ item }}
          </div>
          <div>
            <span style="color: #2387f9">▎</span>
            <span>审批</span>
          </div>
          <div
            class="border bd-radius"
            style="margin-left: 40px; font-size: 14px; width: calc(50% - 40px)"
          >
            <div class="justify-between flex align-items">
              <span class="margin">审批流程</span>
              <el-button type="primary" class="margin-right-s" @click="defaultFlow"
                >默认流程</el-button
              >
            </div>
            <el-timeline style="max-width: 600px; font-size: 12px">
              <el-timeline-item center placement="top">
                <span style="color: #a2a2a2; font-size: 14px">发起</span>
              </el-timeline-item>
              <el-timeline-item placement="top" v-for="(item, index) in FlowData" :key="index">
                <div class="flex" style="flex-wrap: wrap">
                  <span class="margin-right" style="color: #a2a2a2; font-size: 14px"
                    >{{ item.CheckFlowName }}{{ item.CheckWay === 1 ? '(会签)' : '(或签)' }}</span
                  >
                  <span
                    class="border margin-bottom-s"
                    style="padding: 0 15px; border-radius: 12px"
                    v-if="item.IsEditable"
                    @click="addApprovalMan(index)"
                    >+</span
                  >
                  <span
                    class="padding-right margin-left flex margin-bottom-s"
                    style="background-color: #ececec; border-radius: 12px; height: 22px"
                    v-for="(elem, ix) in item.CheckManName"
                    :key="ix"
                    ><div
                      class="align-items justify-center flex margin-right-s"
                      style="
                        border-radius: 50px;
                        background-color: #5795f2;
                        color: #fff;
                        width: 22px;
                        height: 22px;
                      "
                    >
                      {{ elem[0] }}
                    </div>
                    <div style="line-height: 22px">{{ elem }}</div></span
                  >
                </div>
              </el-timeline-item>
              <el-timeline-item center placement="top"
                ><span style="color: #a2a2a2; font-size: 14px">发起</span>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div>
            <span style="color: #2387f9">▎</span>
            <span>抄送</span>
          </div>
          <span v-for="item in SendManData" :key="item.SendManID" class="margin-left">
            <el-tag type="info" class="mar-right-20">
              {{ item.SendManName }}
            </el-tag>
          </span>
          <el-form-item class="dialog-footer flex">
            <el-button type="primary" @click="dialogConfirm(formRef)"> 确认 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog v-model="showCheckBox" v-if="showCheckBox" title="选择用户" width="500">
      <checkBox :data="checkData" @myClick="CustomClick"></checkBox>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Apply_GetBasicInfo } from '@/api/query'
import { useRoute, useRouter } from 'vue-router'
import { uniqueFunc } from '@/utils/util'
import AmPmDate from '@/components/AmPmDate'
import checkBox from '@/components/checkBox'
import obs from '@/mini-obs-sdk/obs'
import { Apply_Save } from '@/api/update'
import ObsClient from 'esdk-obs-browserjs'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

const rules = ref({})
const formRef = ref()
const form = ref({})
const FlowData = ref([])
const fieldData = ref([])
const fieldDetailData = ref([])
const fieldDetail = ref([])
const SendManData = ref([])
const formData = ref([])
const relateApplyList = ref([])
const route = useRoute()
const router = useRouter()
const pathQuery = ref(JSON.parse(localStorage.getItem('pathQuery')))
const UserList = ref(JSON.parse(localStorage.getItem('UserList')))

onMounted(async () => {
  if (pathQuery.value.data) {
    const aaa = JSON.parse(JSON.parse(pathQuery.value.data).fieldData)
    const bbb = JSON.parse(JSON.parse(pathQuery.value.data).SendManData)
    const ccc = JSON.parse(JSON.parse(pathQuery.value.data).RelateApplyData)
    const ddd = JSON.parse(JSON.parse(pathQuery.value.data).FlowData)
    const eee = JSON.parse(JSON.parse(pathQuery.value.data).fieldDetail)

    fieldData.value = aaa.filter((item) => {
      form.value[item.FieldColumn] = item.FieldValue
      if (!item.IsDetail) {
        rules.value[item.FieldColumn] = [{ required: item.IsMust, message: '数据不能为空' }]
      }
      return !item.IsDetail
    })
    fieldDetailData.value.push(...eee)
    form.value.theme = pathQuery.value.FlowName
    bbb.forEach((item) => {
      UserList.value.forEach((elem) => {
        if (item.SendManID === elem.UserID) {
          item.SendManName = elem.UserName
          SendManData.value.push(item)
        }
      })
    })
    relateApplyList.value = ccc
    handleFlow(ddd)

    return
  } else {
    const { data } = await Apply_GetBasicInfo({ FlowID: pathQuery.value.FlowID })
    console.log('1111111111111111111111111111', data)

    fieldData.value = data.fieldData.filter((item) => {
      form.value[item.FieldColumn] = item.FieldType === '多选框' ? [] : ''
      if (!item.IsDetail) {
        rules.value[item.FieldColumn] = [{ required: item.IsMust, message: '数据不能为空' }]
      }
      return !item.IsDetail
    })

    fieldDetail.value = data.fieldData.filter((item) => {
      return item.IsDetail
    })
    if (fieldDetail.value.length) {
      fieldDetailData.value.push(fieldDetail.value)
    }

    relateApplyList.value = data.RelateApplyData
    form.value.theme = data.formData[0].FlowName
    data.SendManData.forEach((item) => {
      UserList.value.forEach((elem) => {
        if (item.SendManID === elem.UserID) {
          item.SendManName = elem.UserName
          SendManData.value.push(item)
        }
      })
    })
    handleFlow(data.FlowData)
    formData.value = data.formData
  }
})

const defaultFlowData = []
const handleFlow = (flowForm) => {
  if (flowForm.length > 0) {
    for (let i = 0; i < flowForm.length; i++) {
      let arr = [],
        arr2 = []
      if (Object.keys(flowForm[i]).includes('CheckManList')) {
        arr = flowForm[i].CheckManList.split(',').map(Number)
      } else {
        for (let j = 0; j < flowForm.length; j++) {
          if (flowForm[i].CheckFlowID == flowForm[j].CheckFlowID) {
            const deptObj = {}
            if (flowForm[j].DeptID > 0) {
              deptObj.id = flowForm[j].DeptID
              deptObj.label = flowForm[j].DeptName
              arr2.push(deptObj)
            } else {
              arr.push(flowForm[j].CheckMan)
            }
          }
        }
      }
      flowForm[i].CheckManList = arr
      flowForm[i].CheckManListStr = arr.join(',')
      flowForm[i].CheckManName = []
      UserList.value.forEach((item) => {
        if (arr.includes(item.UserID)) {
          flowForm[i].CheckManName.push(item.UserName)
        }
      })
      flowForm[i].CheckDept = arr2
      flowForm[i].CheckDeptStr = arr2.join(',')
    }
    FlowData.value = uniqueFunc(flowForm, 'CheckFlowID')
    defaultFlowData.push(...JSON.parse(JSON.stringify(uniqueFunc(flowForm, 'CheckFlowID'))))
  }
}

const copyDetail = (elem, index) => {
  fieldDetailData.value.splice(
    index + 1,
    0,
    JSON.parse(JSON.stringify(fieldDetailData.value[index]))
  )
}

const goBack = () => {
  router.go(-1)
}

const deleteDetail = (index) => {
  fieldDetailData.value.splice(index, 1)
}

const fileList = ref([])
const beforeUpload = (rawFile) => {
  console.log(rawFile)
  if (rawFile.raw.type.startsWith('image/')) {
    rawFile.type = 'image'
  } else {
    rawFile.type = 'file'
  }

  fileList.value.pop()
  fileList.value.push(rawFile)
}

const defaultFlow = () => {
  FlowData.value = JSON.parse(JSON.stringify(defaultFlowData))
}

const showCheckBox = ref(false)
const checkData = ref([])
const FlowIndex = ref('')
const addApprovalMan = (index) => {
  showCheckBox.value = true
  FlowIndex.value = index
  checkData.value = UserList.value
}

const CustomClick = (e) => {
  showCheckBox.value = false
  if (e) {
    FlowData.value[FlowIndex.value].CheckManList = e
    FlowData.value[FlowIndex.value].CheckManList = e
    FlowData.value[FlowIndex.value].CheckManListStr = e.join(',')
    FlowData.value[FlowIndex.value].CheckManName = []
    UserList.value.forEach((item) => {
      if (e.includes(item.UserID)) {
        FlowData.value[FlowIndex.value].CheckManName.push(item.UserName)
      }
    })
  }
}

// const dialogCancel = () => {
//   console.log('点击了取消按钮...')
// }
let loading
const dialogConfirm = (e) => {
  e.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm(`确认要保存吗?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          loading = ElLoading.service({
            lock: true,
            // text: 'Loading',
            background: 'rgba(255, 255, 255, 0)'
          })
          const uploadPromiseTask = [] //定义上传的promise任务栈
          for (let i = 0; i < fileList.value.length; i++) {
            if (Object.keys(fileList.value[i]).includes('size')) {
              uploadPromiseTask.push(ObsFileUpload(fileList.value[i]))
            }
          }
          Promise.all(uploadPromiseTask).then((res) => {
            Save(res)
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '保存已取消'
          })
        })
    } else {
      console.log('error submit!')
    }
  })
}

const ObsFileUpload = (file) => {
  const OBSInfo = ref(JSON.parse(localStorage.getItem('OBSInfo')))
  //初始化ObsClient实例
  const obsClient = new ObsClient({
    access_key_id: OBSInfo.value.AK,
    secret_access_key: OBSInfo.value.SK,
    server: OBSInfo.value.EndPoint
    // server: OBSInfo.value.EndPoint + 'obsApi'
  })
  const fileName = obs.getPostFileUrl(file.name)
  const parmas = {
    Bucket: OBSInfo.value.BucketName,
    Key: fileName,
    SourceFile: file.raw
  }

  return new Promise((resolve, reject) => {
    obsClient.putObject(parmas, function (err, result) {
      if (err) {
        loading.close()
        reject()
      } else {
        if (result.CommonMsg.Status == 200) {
          const name = file.type === 'file' ? file.name : ''
          resolve({
            ImageUrl: fileName.split('/')[1] + ',' + name,
            ImageType: file.type
          })
        } else {
          loading.close()
          reject()
        }
      }
    })
  })
}

const Save = async (bodyOne) => {
  const data = {}
  const CustGuid = ref(localStorage.getItem('CustGuid').toLocaleUpperCase())
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  fieldData.value.forEach((item) => {
    item.FieldValue = form.value[item.FieldColumn]
  })
  data.ContentHead = JSON.stringify({
    SaveWay: 1,
    FlowID: pathQuery.value.FlowID,
    ApplyID: 0,
    ApplyTheme: form.value.theme,
    ApplyMan: UserInfo.UserID,
    ApplyStatus: 1,
    ApplyJson: JSON.stringify(fieldData.value),
    ApplyJsonDetail: JSON.stringify(fieldDetailData.value)
  })
  data.ContentBody1 = JSON.stringify(bodyOne)
  data.ContentBody2 = CustGuid.value
  data.ContentBody3 = JSON.stringify(FlowData.value)
  data.ContentBody4 = JSON.stringify([])
  const res = await Apply_Save(data)
  loading.close()
  if (res.data === '操作成功') {
    ElMessage({
      message: '保存成功',
      type: 'success'
    })
    router.go(-1)
  } else {
    ElMessage({
      message: '保存失败',
      type: 'error'
    })
  }
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
.dialog-footer {
  justify-content: end;
}
:deep .dialog-footer .el-form-item__content {
  margin-left: 0 !important;
  justify-content: end;
}
:deep .el-timeline-item__wrapper {
  top: 0;
}
:deep .el-timeline-item__timestamp.is-top {
  margin-bottom: 0;
  padding-top: 0;
}

.eaf0f3 {
  background-color: #eaf0f3;
}
</style>
