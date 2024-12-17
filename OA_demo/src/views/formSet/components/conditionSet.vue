<template>
  <el-form
    style="min-width: 600px"
    :model="ruleForm"
    label-width="auto"
    class="demo-ruleForm"
    status-icon
  >
    <el-form-item label="条件项">
      <el-select v-model="ruleForm.Condition" placeholder="请选择" @change="onConfirm1">
        <el-option :label="item" :value="item" v-for="item in columns1" :key="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="判定">
      <el-select v-model="ruleForm.Decide" placeholder="请选择">
        <el-option :label="item" :value="item" v-for="item in columns2" :key="item" />
      </el-select>
    </el-form-item>
    <template v-if="ruleForm.FieldType == '数字框' && ruleForm.Decide != ''">
      <el-form-item label="条件值">
        <el-select v-model="ruleForm.Value" placeholder="请选择">
          <el-option :label="item" :value="item" v-for="item in columns3" :key="item" />
        </el-select>
      </el-form-item>
    </template>
    <template v-else-if="ruleForm.FieldType == '下拉框' && ruleForm.Decide != ''">
      <el-form-item label="条件值">
        <el-select v-model="ruleForm.Value" placeholder="请选择">
          <el-option :label="item" :value="item" v-for="item in columns3" :key="item" />
        </el-select>
      </el-form-item>
    </template>
    <template
      v-else-if="
        ruleForm.FieldType == '字符串' && ruleForm.Condition == '申请人' && ruleForm.Decide != ''
      "
    >
      <el-form-item label="条件值">
        <div
          class="flex content"
          v-if="
            ruleForm.FieldType == '字符串' &&
            ruleForm.Condition == '申请人' &&
            ruleForm.Decide != ''
          "
        >
          <span v-for="(item, index) in checkData1" :key="index">
            <el-tag
              type="success"
              class="margin-right-l margin-bottom-l"
              v-if="item.checked"
              :closable="true"
              @close="deleteFieldUser1(index)"
              >{{ item.UserName }}</el-tag
            >
          </span>
          <el-tag type="info" class="margin-right-l margin-bottom-l" @click="addUser1('add')">
            +用户
          </el-tag>
        </div>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item label="条件值"></el-form-item>
    </template>
    <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">条件流程</div>
    <div v-for="(item, index) in ruleForm.FlowList" :key="item.CheckLevel">
      <div class="border padding-left bd-radius margin flex" v-if="item.SaveWay !== 3">
        <div style="flex: 10" class="padding-top" @click="addApplyOption('eidt', item, index)">
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
      <el-tag type="info" class="margin-right-l margin-bottom-l" @click="addApplyOption('add')">
        添加审批流程
      </el-tag>
    </div>
    <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">抄送</div>
    <div class="flex content">
      <span v-for="(item, index) in checkData2" :key="index">
        <el-tag
          type="success"
          class="margin-right-l margin-bottom-l"
          v-if="item.checked"
          :closable="true"
          @close="deleteFieldUser2(index)"
          >{{ item.UserName }}</el-tag
        >
      </span>
    </div>
    <div class="flex">
      <el-tag type="info" class="margin-right-l margin-bottom-l" @click="addUser2('add')">
        +用户
      </el-tag>
    </div>
    <el-form-item>
      <el-button type="primary" @click="submitForm"> 确认 </el-button>
      <el-button @click="cancelForm">取消</el-button>
    </el-form-item>
  </el-form>
  <el-dialog v-model="showOptionSet" v-if="showOptionSet" title="条件流程设置">
    <condOptionSet :data="optionData" @myClick="OptionSetClick"></condOptionSet>
  </el-dialog>
  <el-dialog v-model="showCheckBox1" v-if="showCheckBox1" title="选择用户" width="500">
    <checkBox :data="checkData1" @myClick="CustomClick1"></checkBox>
  </el-dialog>
  <el-dialog v-model="showCheckBox2" v-if="showCheckBox2" title="选择用户" width="500">
    <checkBox :data="checkData2" @myClick="CustomClick2"></checkBox>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import checkBox from '@/components/checkBox.vue'
import condOptionSet from './condOptionSet.vue'
const UserList = ref(JSON.parse(localStorage.getItem('UserList')))

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return []
    }
  },
  item: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['myClick'])

const ruleForm = ref({
  SaveWay: 1,
  Condition: '',
  Decide: '',
  Value: '',
  FieldType: '',
  FlowList: [],
  SendMan: []
})

const columns1 = ref([])
const ConditionList = ref([])

onMounted(() => {
  ruleForm.value = Object.keys(props.item).length ? props.item : ruleForm.value
  handlePropsData()
  handleUser()
})
const orgin = {
  id: 9999,
  FieldName: '申请人',
  FieldType: '字符串',
  Decide: ['等于', '不等于'],
  FieldSelectData: []
}
const handlePropsData = () => {
  columns1.value.push('申请人')
  columns2.value = orgin.Decide
  ConditionList.value.push(orgin)
  for (var i = 0; i < props.data.length; i++) {
    var obj = {}
    if (props.data[i].FieldType == '数字框') {
      obj.id = props.data[i].id
      obj.FieldName = props.data[i].FieldName
      obj.FieldType = props.data[i].FieldType
      obj.Decide = ['等于', '大于等于', '大于', '小于等于', '小于', '不等于']
      obj.FieldSelectData = []
      columns1.value.push(obj.FieldName)
      columns2.value = obj.Decide
      ConditionList.value.push(obj)
    } else if (props.data[i].FieldType == '下拉框') {
      obj.id = props.data[i].id
      obj.FieldName = props.data[i].FieldName
      obj.FieldType = props.data[i].FieldType
      obj.Decide = ['等于', '不等于']
      obj.FieldSelectData = props.data[i].FieldSelectData.split('\n')
      columns1.value.push(obj.FieldName)
      columns2.value = obj.Decide
      ConditionList.value.push(obj)
    }
  }
}

const handleUser = () => {
  const aaa = JSON.parse(JSON.stringify(UserList.value))
  const bbb = JSON.parse(JSON.stringify(UserList.value))
  if (ruleForm.value.Value !== '') {
    checkData1.value = aaa.map((item) => {
      if (ruleForm.value.Value.split(',').map(Number).includes(item.UserID)) {
        item.checked = true
      }
      return { ...item }
    })
  } else {
    checkData1.value = UserList.value
  }

  if (ruleForm.value.SendMan.length) {
    checkData2.value = bbb.map((item) => {
      if (ruleForm.value.SendMan.includes(item.UserID)) {
        item.checked = true
      }
      return { ...item }
    })
  } else {
    checkData2.value = UserList.value
  }
}

const columns2 = ref()
const columns3 = ref()
const onConfirm1 = (e) => {
  console.log('马克思减肥呢死哦u记得不', e)
  ConditionList.value.forEach((item) => {
    if (item.FieldName === e) {
      columns2.value = item.Decide
      ruleForm.value.FieldType = item.FieldType
      if (item.FieldType == '下拉框') {
        columns3.value = item.FieldSelectData
      }
    }
  })
  ruleForm.value.Decide = ''
  ruleForm.value.Value = ''
}

const showCheckBox1 = ref(false)
const checkData1 = ref([])
const addUser1 = () => {
  showCheckBox1.value = true
}

const CustomClick1 = (e) => {
  showCheckBox1.value = false
  if (e) {
    checkData1.value.forEach((item) => {
      item.checked = false
      if (e.includes(item.UserID)) {
        item.checked = true
      }
    })
    ruleForm.value.Value = e.join()
  }
}

const deleteFieldUser1 = (index) => {
  checkData1.value[index].checked = false
  ruleForm.value.Value = ruleForm.value.Value.split(',')
    .map(Number)
    .filter((item) => {
      return item !== checkData1.value[index].UserID
    })
    .join()
}

const showCheckBox2 = ref(false)
const checkData2 = ref([])
const addUser2 = () => {
  showCheckBox2.value = true
}

const CustomClick2 = (e) => {
  showCheckBox2.value = false
  console.log('2222222222222222222222222', e)
  if (e) {
    checkData2.value.forEach((item) => {
      item.checked = false
      if (e.includes(item.UserID)) {
        item.checked = true
      }
    })
    ruleForm.value.SendMan = e
  }
}

const deleteFieldUser2 = (index) => {
  checkData2.value[index].checked = false
  ruleForm.value.SendMan = ruleForm.value.SendMan.filter((item) => {
    return item !== checkData2.value[index].UserID
  })
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
  console.log('你这下班v计划时代背景和', e)
  if (e) {
    e.CheckManNameList = []
    UserList.value.forEach((elem) => {
      if (e.CheckManList.includes(elem.UserID)) {
        e.CheckManNameList.push(elem.UserName)
      }
    })
    if (optionIndex.value === '') {
      e.CheckLevel = ruleForm.value.FlowList.length + 1
      ruleForm.value.FlowList.push(e)
      return
    }
    ruleForm.value.FlowList.splice(optionIndex.value, 1, e)
  }
}

const deleteFlow = (val) => {
  ruleForm.value.FlowList.forEach((item, index) => {
    if (index === val) {
      if (item.CheckFlowID) {
        item.SaveWay = 3
      } else {
        ruleForm.value.FlowList.splice(val, 1)
      }
    }
  })
}
const submitForm = () => {
  emit('myClick', ruleForm.value)
}

const cancelForm = () => {
  emit('myClick')
}
</script>

<style scoped></style>
