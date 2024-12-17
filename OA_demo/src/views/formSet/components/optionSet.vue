<template>
  <el-form
    ref="ruleFormRef"
    :model="FlowInfo"
    label-width="auto"
    style="min-width: 600px"
    :rules="rules"
  >
    <el-form-item label="流程名称" prop="CheckFlowName">
      <el-input v-model="FlowInfo.CheckFlowName" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="审批类型">
      <el-select v-model="FlowInfo.CheckWay" placeholder="请选择" @change="selectCheckWay">
        <el-option
          v-for="it in checkWayData"
          :key="it.CheckWay"
          :label="it.CheckWayName"
          :value="it.CheckWay"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="流程类型">
      <el-select v-model="FlowInfo.CheckType" placeholder="请选择" @change="selectCheckType">
        <el-option
          v-for="it in checkTypeData"
          :key="it.CheckType"
          :label="it.CheckTypeName"
          :value="it.CheckType"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="是否可编辑">
      <el-switch v-model="FlowInfo.IsEditable" />
    </el-form-item>
    <el-form-item label="是否推送申请人">
      <el-switch v-model="FlowInfo.IsSendable" />
    </el-form-item>

    <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">
      审批人员 <el-form-item prop="CheckManList"></el-form-item>
    </div>
    <div class="flex" style="flex-wrap: wrap">
      <span>
        <span v-for="(item, index) in checkData" :key="item.UserID">
          <el-tag
            v-if="item.checked"
            type="info"
            class="margin-right-l margin-bottom-l"
            :closable="true"
            @close="deleteFieldUser(index)"
          >
            {{ item.UserName }}
          </el-tag>
        </span>
      </span>
      <el-tag type="info" class="margin-right-l margin-bottom-l" @click="addUser"> +用户 </el-tag>
    </div>
    <el-form-item>
      <el-button @click="dialogCancel(ruleFormRef)">取消</el-button>
      <el-button type="primary" @click="dialogConfirm(ruleFormRef)"> 确认 </el-button>
    </el-form-item>
  </el-form>
  <el-dialog v-model="showCheckBox" v-if="showCheckBox" title="选择用户" width="500">
    <checkBox :data="checkData" @myClick="CustomClick"></checkBox>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import checkBox from '@/components/checkBox'
const UserList = ref(JSON.parse(localStorage.getItem('UserList')))

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const FlowInfo = ref({
  SaveWay: 1,
  FlowID: 0,
  CheckFlowID: 0,
  CheckFlowName: '流程',
  CheckLevel: 1,
  CheckWay: 1,
  CheckWayName: '会签',
  IsCondition: 1,
  CheckType: 1,
  CheckTypeName: '审批流程',
  FlowField: [],
  CheckManList: [],
  CheckDept: [],
  IsEditable: false,
  IsSendable: false
})

const checkWayData = ref([
  {
    CheckWay: 1,
    CheckWayName: '会签'
  },
  {
    CheckWay: 2,
    CheckWayName: '或签'
  }
])

const checkTypeData = ref([
  {
    CheckType: 1,
    CheckTypeName: '审批流程'
  },
  {
    CheckType: 2,
    CheckTypeName: '抄送流程'
  }
])

const ruleFormRef = ref()

const rules = ref({
  CheckFlowName: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  CheckManList: [{ required: true, message: '审批人员必选' }]
})

const checkData = ref([])
FlowInfo.value.FlowID = inject('FlowID')
onMounted(() => {
  FlowInfo.value = Object.keys(props.data).length ? props.data : FlowInfo.value
  if (FlowInfo.value.CheckManList.length) {
    checkData.value = UserList.value.map((item) => {
      if (FlowInfo.value.CheckManList.includes(item.UserID)) {
        item.checked = true
      }
      return { ...item }
    })
  } else {
    checkData.value = UserList.value.map((item) => {
      return { ...item }
    })
  }
})

const showCheckBox = ref(false)
const addUser = () => {
  showCheckBox.value = true
}

const CustomClick = (e) => {
  showCheckBox.value = false
  if (e) {
    checkData.value.forEach((item) => {
      item.checked = false
      if (e.includes(item.UserID)) {
        item.checked = true
        FlowInfo.value.CheckManList = e
      }
    })
  }
}

const selectCheckWay = (val) => {
  FlowInfo.value.CheckWayName = checkWayData.value.find((item) => {
    return item.CheckWay === val
  }).CheckWayName
}

const selectCheckType = (val) => {
  FlowInfo.value.IsCondition = val
  FlowInfo.value.CheckTypeName = checkTypeData.value.find((item) => {
    return item.CheckType === val
  }).CheckTypeName
}

const deleteFieldUser = (index) => {
  checkData.value[index].checked = false
  FlowInfo.value.CheckManList = FlowInfo.value.CheckManList.filter((item) => {
    return item !== checkData.value[index].UserID
  })
}

const emit = defineEmits(['myClick'])
const dialogConfirm = (e) => {
  e.validate((valid) => {
    if (valid) {
      emit('myClick', FlowInfo.value)
    }
  })
}
const dialogCancel = () => {
  emit('myClick')
}
</script>
<style scoped>
.dialog-footer {
  margin: 20px 0;
  justify-content: end;
}
</style>
