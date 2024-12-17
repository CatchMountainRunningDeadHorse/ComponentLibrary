<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="0" class="el-menu-vertical-demo">
          <el-menu-item
            v-for="item in AsideOption"
            :index="item.value"
            :key="item.value"
            @click="clickMenuItem"
          >
            <template #title>
              <span>{{ item.label }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <template v-if="Number(AsideIndex) === 0">
            <el-form v-model="BasicInfo" label-width="auto">
              <el-form-item label="表单名称" :required="true">
                <el-input v-model="BasicInfo.FlowName" />
              </el-form-item>
              <el-form-item label="表单分类" :required="true">
                <div class="flex" style="width: 100%">
                  <el-select
                    v-model="BasicInfo.FlowTypeName"
                    placeholder="请选择下拉信息"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="it in formTypeData"
                      :key="it.FlowType"
                      :label="it.FlowTypeName"
                      :value="it.FlowType"
                    />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="可见范围">
                <div class="flex" style="flex-wrap: wrap">
                  <span v-if="checkArr1.length === checkData1.length"
                    ><el-tag type="info" class="margin-right-l margin-bottom-l">全部可见</el-tag>
                  </span>
                  <span v-else>
                    <span v-for="(item, index) in checkData1" :key="item.UserID">
                      <el-tag
                        v-if="item.checked"
                        type="success"
                        class="margin-right-l margin-bottom-l"
                        :closable="true"
                        @close="deleteBasicUser(index)"
                      >
                        {{ item.UserName }}
                      </el-tag>
                    </span>
                  </span>
                  <el-tag type="info" class="margin-right-l margin-bottom-l" @click="addUser1">
                    +用户
                  </el-tag>
                </div>
              </el-form-item>
              <el-form-item label="表单说明">
                <el-input
                  type="textarea"
                  v-model="BasicInfo.FlowRem"
                  placeholder="填写表单制度及表单填写说明"
                />
              </el-form-item>
            </el-form>
          </template>
          <template v-if="Number(AsideIndex) === 1">
            <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">主表字段</div>
            <div class="flex" style="flex-wrap: wrap">
              <el-tag type="success" class="margin-right-l margin-bottom-l">申请主题</el-tag>
              <el-tag type="success" class="margin-right-l margin-bottom-l">申请人</el-tag>
              <el-tag type="success" class="margin-right-l margin-bottom-l">申请时间</el-tag>
              <span v-for="(item, index) in fieldData" :key="item.FieldName">
                <el-tag
                  v-if="item.SaveWay !== 3"
                  :closable="true"
                  type="success"
                  class="margin-right-l margin-bottom-l"
                  @close="deleteField(index)"
                  @click="addTableField('eidt', item, index)"
                >
                  {{ item.FieldName }}{{ item.FieldColumn ? '(' + item.FieldColumn + ')' : '' }}
                </el-tag>
              </span>
            </div>
            <div class="flex">
              <el-tag
                type="info"
                class="margin-right-l margin-bottom-l"
                @click="addTableField('add')"
              >
                添加主表字段
              </el-tag>
              <el-tag type="info" class="margin-right-l margin-bottom-l"> 排序 </el-tag>
            </div>

            <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">
              明细字段设置（可不填）
            </div>
            <div class="flex" style="flex-wrap: wrap">
              <span v-for="(item, index) in fieldDetailData" :key="item.FieldName">
                <el-tag
                  v-if="item.SaveWay !== 3"
                  :closable="true"
                  type="success"
                  class="margin-right-l margin-bottom-l"
                  @close="deleteDetailField(index)"
                  @click="addDetailField('eidt', item, index)"
                >
                  {{ item.FieldName }}{{ item.FieldColumn ? '(' + item.FieldColumn + ')' : '' }}
                </el-tag>
              </span>
            </div>
            <div class="flex">
              <el-tag
                type="info"
                class="margin-right-l margin-bottom-l"
                @click="addDetailField('add')"
              >
                添加明细字段
              </el-tag>
              <el-tag type="info" class="margin-right-l margin-bottom-l"> 排序 </el-tag>
            </div>
          </template>
          <template v-if="Number(AsideIndex) === 2">
            <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">默认流程</div>
            <div v-for="(item, index) in CheckFlowList" :key="item.CheckLevel">
              <div
                class="border padding-right padding-left bd-radius margin flex"
                v-if="item.SaveWay !== 3"
              >
                <div
                  style="flex: 10"
                  class="padding-top"
                  @click="addApplyOption('eidt', item, index)"
                >
                  <div>{{ item.CheckFlowName }}{{ item.CheckWay === 1 ? '(会签)' : '(或签)' }}</div>
                  <div class="felx content">
                    <el-tag
                      v-for="(elem, ix) in item.CheckManNameList"
                      :key="ix"
                      type="success"
                      class="margin-right-l margin-bottom-l"
                    >
                      {{ elem }}
                    </el-tag>
                  </div>
                </div>
                <div style="flex: 1" class="align-items flex justify-center">
                  <el-icon size="50" @click="deleteFlow(index)"><CircleClose /></el-icon>
                </div>
              </div>
            </div>
            <div class="flex">
              <el-tag
                type="info"
                class="margin-right-l margin-bottom-l"
                @click="addApplyOption('add')"
              >
                添加审批流程
              </el-tag>
            </div>

            <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">抄送</div>
            <div class="flex" style="flex-wrap: wrap">
              <span v-for="(item, index) in checkData2" :key="item.UserID">
                <el-tag
                  v-if="item.checked"
                  type="success"
                  class="margin-right-l margin-bottom-l"
                  :closable="true"
                  @close="deleteOptionUser(index)"
                >
                  {{ item.UserName }}
                </el-tag>
              </span>
              <el-tag type="info" class="margin-right-l margin-bottom-l" @click="addUser2">
                +用户
              </el-tag>
            </div>
          </template>
          <template v-if="Number(AsideIndex) === 3">
            <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">条件审批</div>
            <div class="flex content">
              <el-tag
                type="success"
                class="margin-right-l margin-bottom-l"
                v-for="(item, index) in ConditionFlowData"
                :key="index"
                :closable="true"
                @close="deleteCondition(index)"
                @click="addCondition('eidt', item, index)"
              >
                {{ item.Condition }}：{{ item.Decide }}{{ item.Value }}
              </el-tag>
            </div>
            <div class="flex">
              <el-tag
                type="info"
                class="margin-right-l margin-bottom-l"
                @click="addCondition('add')"
              >
                添加条件
              </el-tag>
              <el-tag type="info" class="margin-right-l margin-bottom-l"> 排序 </el-tag>
            </div>
          </template>
        </el-main>
        <el-footer>
          <div class="dialog-footer flex">
            <el-button @click="dialogCancel">取消</el-button>
            <el-button type="primary" @click="dialogConfirm"> 确认 </el-button>
          </div>
        </el-footer>

        <el-dialog v-model="showCheckBox1" v-if="showCheckBox1" title="选择用户" width="500">
          <checkBox :data="checkData1" @myClick="CustomClick1"></checkBox>
        </el-dialog>
        <el-dialog v-model="showCheckBox2" v-if="showCheckBox2" title="选择用户" width="500">
          <checkBox :data="checkData2" @myClick="CustomClick2"></checkBox>
        </el-dialog>
        <el-dialog v-model="showTableField" v-if="showTableField" title="主表字段">
          <tableField :data="mainData" type="main" @myClick="TableFieldClick"></tableField>
        </el-dialog>
        <el-dialog v-model="showTableDetailField" v-if="showTableDetailField" title="明细字段">
          <tableField
            :data="detailData"
            type="detail"
            @myClick="TableDetailFieldClick"
          ></tableField>
        </el-dialog>
        <el-dialog v-model="showOptionSet" v-if="showOptionSet" title="流程设置">
          <optionSet :data="optionData" @myClick="OptionSetClick"></optionSet>
        </el-dialog>
        <el-dialog v-model="showCondition" v-if="showCondition" title="条件审批">
          <conditionSet :data="fieldData" :item="condData" @myClick="conditionClick"></conditionSet>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted, ref, provide } from 'vue'
import { getFlowType, getBasicFormData } from '@/api/query'
import { BasicForm_Save } from '@/api/update'
import checkBox from '@/components/checkBox'
import optionSet from './optionSet'
import tableField from './tableField'
import conditionSet from './conditionSet'
import { filFlow, fieldValSplice, dataClassify } from '@/utils/util'
import { ElMessage } from 'element-plus'
const AsideOption = ref([
  { label: '基本设置', value: '0' },
  { label: '字段设置', value: '1' },
  { label: '流程设置', value: '2' },
  { label: '条件审批', value: '3' }
])

const BasicInfo = ref({
  SaveWay: 1,
  FlowName: '',
  FlowTypeName: '',
  FlowType: 0,
  FlowVisible: '全部可见',
  FlowRem: ''
})

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const fieldData = ref([])
const fieldDetailData = ref([])
const formTypeData = ref([])
const CheckFlowList = ref([])
const checkData1 = ref([])
const checkArr1 = ref([])
const checkData2 = ref([])
const ConditionFlowData = ref([])
const SendManInfo = ref([])
const UserList = ref(JSON.parse(localStorage.getItem('UserList')))
provide('FlowID', props.data.FlowID || 0)
onMounted(async () => {
  getFlowType().then((res) => {
    res.data.forEach((item) => {
      item.FlowType = item.FlowTypeID
    })
    formTypeData.value = res.data
  })
  if (Object.keys(props.data).length) {
    const { data } = await getBasicFormData({ FlowID: props.data.FlowID })
    //字段设置
    fieldData.value = data.fieldData.filter((item) => {
      item.SaveWay = 2
      return !item.IsDetail
    })
    fieldDetailData.value = data.fieldData.filter((item) => {
      item.SaveWay = 2
      return item.IsDetail
    })
    //流程设置
    data.FlowData.forEach((item) => {
      item.CheckType = item.IsCondition
      item.CheckTypeName = item.IsCondition === 1 ? '审批流程' : '抄送流程'
      item.CheckDept = []
    })
    CheckFlowList.value = filFlow(data.FlowData, ['CheckFlowID', 'CheckLevel'])
    CheckFlowList.value = CheckFlowList.value.map((item) => {
      item.CheckManNameList = []
      UserList.value.forEach((elem) => {
        if (item.CheckManList.includes(elem.UserID)) {
          item.CheckManNameList.push(elem.UserName)
        }
      })
      item.SaveWay = 2
      return { ...item }
    })

    //流程设置的抄送
    data.SendManData.forEach((item) => {
      SendManInfo.value.push(item.SendManID)
    })
    //基本设置
    if (data.formData.length) {
      data.formData[0].SaveWay = 2
      BasicInfo.value = data.formData[0]
    }
    //条件审批
    condtionApply(data.ConditionFlowData)
  }
  const aaa = JSON.parse(JSON.stringify(UserList.value))
  const bbb = JSON.parse(JSON.stringify(UserList.value))
  const ccc = JSON.parse(JSON.stringify(UserList.value))
  if (BasicInfo.value.FlowVisible === '全部可见') {
    checkData1.value = aaa.map((item) => {
      item.checked = true
      checkArr1.value.push(item.UserID)
      return { ...item }
    })
  } else {
    checkArr1.value = BasicInfo.value.FlowVisible.split(',').map(Number)
    checkData1.value = bbb.map((item) => {
      if (checkArr1.value.includes(item.UserID)) {
        item.checked = true
      }
      return { ...item }
    })
  }

  checkData2.value = ccc.map((item) => {
    if (SendManInfo.value.includes(item.UserID)) {
      item.checked = true
    }
    return { ...item }
  })
})

//条件审批数据处理
const condtionApply = (data) => {
  data.forEach((item) => {
    item.SaveWay = 2
    item.SendMan = SendManInfo.value
  })
  data = dataClassify(
    data,
    ['Condition', 'Decide', 'Value'],
    ['SaveWay', 'Condition', 'Decide', 'Value', 'FieldType', 'SendMan']
  )
  data.forEach((item) => {
    item.FlowList = []
    item.FlowList = fieldValSplice(
      item.children,
      ['CheckFlowID', 'CheckLevel'],
      'CheckManList',
      'CheckMan'
    )
    delete item.children
    item.FlowList.forEach((el) => {
      el.CheckManNameList = []
      UserList.value.forEach((elem) => {
        if (el.CheckManList.includes(elem.UserID)) {
          el.CheckManNameList.push(elem.UserName)
        }
      })
    })
  })
  ConditionFlowData.value = data
}

const AsideIndex = ref('0')
const clickMenuItem = (val) => {
  AsideIndex.value = val.index
}

const selectChange = (val) => {
  BasicInfo.value.FlowType = val
  BasicInfo.value.FlowTypeName = formTypeData.value.find((item) => {
    return item.FlowType === val
  }).FlowTypeName
}

const emit = defineEmits(['myClick'])
const dialogCancel = () => {
  emit('myClick')
}

const dialogConfirm = () => {
  if (BasicInfo.value.FlowName === '') {
    ElMessage({
      message: '请输入表单名称',
      type: 'error',
      duration: 5 * 1000
    })
    return
  }
  if (!BasicInfo.value.FlowType) {
    ElMessage({
      message: '请选择表单类型',
      type: 'error',
      duration: 5 * 1000
    })
    return
  }
  const data = {}
  data.ContentHead = JSON.stringify(BasicInfo.value)
  data.ContentBody1 = JSON.stringify(fieldData.value.concat(fieldDetailData.value))
  data.ContentBody2 = JSON.stringify({
    CheckInfo: CheckFlowList.value,
    SendManInfo: SendManInfo.value
  })
  data.ContentBody3 = JSON.stringify(ConditionFlowData.value)
  BasicForm_Save(data)
  emit('myClick', '确认')
}

const deleteBasicUser = (index) => {
  checkData1.value[index].checked = false
}

const deleteOptionUser = (index) => {
  checkData2.value[index].checked = false
}

const showCheckBox1 = ref(false)
const showCheckBox2 = ref(false)
const addUser1 = () => {
  showCheckBox1.value = true
}
const addUser2 = () => {
  showCheckBox2.value = true
}

const CustomClick1 = (e) => {
  showCheckBox1.value = false
  if (e) {
    checkData1.value.forEach((item) => {
      item.checked = false
      if (e.includes(item.UserID)) {
        item.checked = true
        BasicInfo.value.FlowVisible = e.join()
      }
      checkArr1.value = e
    })
  }
}

const CustomClick2 = (e) => {
  showCheckBox2.value = false
  if (e) {
    SendManInfo.value = e
    checkData2.value.forEach((item) => {
      if (e.includes(item.UserID)) {
        item.checked = true
      }
    })
  }
}

const showTableField = ref(false)
const mainData = ref({})
const mainIndex = ref('')
const addTableField = (type, parmas, index) => {
  if (type === 'eidt') {
    mainData.value = parmas
    mainIndex.value = index
  } else {
    mainData.value = {}
    mainIndex.value = ''
  }
  showTableField.value = true
}

const deleteField = (val) => {
  fieldData.value.forEach((item, index) => {
    if (index === val) {
      if (item.id) {
        item.SaveWay = 3
      } else {
        fieldData.value.splice(val, 1)
      }
    }
  })
}
const TableFieldClick = (e) => {
  showTableField.value = false

  if (e) {
    if (mainIndex.value === '') {
      fieldData.value.push(e)
      return
    }
    fieldData.value.splice(mainIndex.value, 1, e)
  }
}

const showTableDetailField = ref(false)
const detailData = ref({})
const detailIndex = ref('')
const addDetailField = (type, parmas, index) => {
  if (type === 'eidt') {
    detailData.value = parmas
    detailIndex.value = index
  } else {
    detailData.value = {}
    detailIndex.value = ''
  }
  showTableDetailField.value = true
}

const deleteDetailField = (val) => {
  fieldDetailData.value.forEach((item, index) => {
    if (index === val) {
      if (item.id) {
        item.SaveWay = 3
      } else {
        fieldDetailData.value.splice(val, 1)
      }
    }
  })
}
const TableDetailFieldClick = (e) => {
  showTableDetailField.value = false

  if (e) {
    if (detailIndex.value === '') {
      fieldDetailData.value.push(e)
      return
    }
    fieldDetailData.value.splice(detailIndex.value, 1, e)
  }
}

const showOptionSet = ref(false)
const optionData = ref({})
const optionIndex = ref('')
const addApplyOption = (type, parmas, index) => {
  if (type === 'eidt') {
    optionData.value = parmas
    optionIndex.value = index
  } else {
    optionData.value = {}
    optionIndex.value = ''
  }
  showOptionSet.value = true
}
const OptionSetClick = (e) => {
  showOptionSet.value = false
  if (e) {
    e.CheckManNameList = []
    UserList.value.forEach((elem) => {
      if (e.CheckManList.includes(elem.UserID)) {
        e.CheckManNameList.push(elem.UserName)
      }
    })
    if (optionIndex.value === '') {
      e.CheckLevel = CheckFlowList.value.length + 1
      CheckFlowList.value.push(e)
      return
    }
    CheckFlowList.value.splice(optionIndex.value, 1, e)
  }
}

const deleteFlow = (val) => {
  CheckFlowList.value.forEach((item, index) => {
    if (index === val) {
      if (item.CheckFlowID) {
        item.SaveWay = 3
      } else {
        CheckFlowList.value.splice(val, 1)
      }
    }
  })
}

const showCondition = ref(false)
const condIndex = ref('')
const condData = ref({})
const addCondition = (type, parmas, index) => {
  if (type === 'eidt') {
    console.log('111111111111111111111111111111', parmas)
    condData.value = parmas
    condIndex.value = index
  } else {
    condData.value = {}
    condIndex.value = ''
  }
  showCondition.value = true
}

const conditionClick = (e) => {
  showCondition.value = false
  console.log('5555555555555555555555555555', e, condIndex.value)
  if (e) {
    if (condIndex.value === '') {
      ConditionFlowData.value.push(e)
      return
    }
    ConditionFlowData.value.splice(condIndex.value, 1, e)
  }
}

const deleteCondition = (val) => {
  ConditionFlowData.value.forEach((item, index) => {
    if (index === val) {
      if (item.CheckFlowID) {
        item.SaveWay = 3
      } else {
        ConditionFlowData.value.splice(val, 1)
      }
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  margin: 20px 0;
  justify-content: end;
}
</style>
