<template>
  <el-form
    ref="ruleFormRef"
    :model="Info"
    label-width="auto"
    style="min-width: 600px"
    :rules="rules"
  >
    <el-form-item label="字段名称" prop="FieldName">
      <el-input v-model="Info.FieldName" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="字段类型">
      <el-select v-model="Info.FieldType" placeholder="请选择">
        <el-option
          v-for="it in fieldTypData"
          :key="it.FieldType"
          :label="it.FieldTypeName"
          :value="it.FieldTypeName"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="数据项(一行代表一项)"
      v-if="IsIncludes(Info.FieldType, ['下拉框', '多选框'])"
    >
      <el-input v-model="Info.FieldSelectData" type="textarea" placeholder="请输入内容" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="Info.IsMust" />
    </el-form-item>
    <el-form-item label="是否列表显示">
      <el-switch v-model="Info.IsStatics" />
    </el-form-item>
    <el-form-item label="填写说明">
      <el-input v-model="Info.FieldRem" placeholder="请输入" />
    </el-form-item>
    <div style="padding: 10px 0; font-size: 16px; font-weight: bolder">
      查看权限<span>(仅限指定人员查看该字段)</span>
    </div>
    <div class="flex" style="flex-wrap: wrap">
      <span v-if="arr.length === checkData.length"
        ><el-tag type="info" class="margin-right-l margin-bottom-l">全部可见</el-tag></span
      >
      <span v-else>
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
import { ref, onMounted } from 'vue'
import { IsIncludes } from '@/utils/util'
import checkBox from '@/components/checkBox'
const UserList = ref(JSON.parse(localStorage.getItem('UserList')))

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  type: {}
})

const Info = ref({
  SaveWay: 1,
  id: 0,
  FieldName: '',
  FieldColumn: 'Field',
  FieldType: '单行框',
  FieldSelectData: '',
  IsMust: false,
  IsStatics: false,
  FieldRem: '',
  FieldVisible: '全部可见',
  Sort: 0
})

const ruleFormRef = ref()

const rules = ref({
  FieldName: [{ required: true, message: '请输入字段名称', trigger: 'blur' }]
})
const fieldTypData = ref([
  { FieldType: 1, FieldTypeName: '单行框' },
  { FieldType: 2, FieldTypeName: '多行框' },
  { FieldType: 3, FieldTypeName: '数字框' },
  { FieldType: 4, FieldTypeName: '日期框' },
  { FieldType: 5, FieldTypeName: '下拉框' },
  { FieldType: 6, FieldTypeName: '多选框' },
  { FieldType: 7, FieldTypeName: '日期框(上下午)' },
  { FieldType: 8, FieldTypeName: '选择人员' },
  { FieldType: 9, FieldTypeName: '日期框(时间)' }
])

const checkData = ref([])
let arr = ref([])
onMounted(() => {
  Info.value = Object.keys(props.data).length ? props.data : Info.value
  if (Info.value.FieldVisible === '全部可见') {
    checkData.value = UserList.value.map((item) => {
      item.checked = true
      arr.value.push(item.UserID)
      return { ...item }
    })
  } else {
    arr.value = Info.value.FieldVisible.split(',').map(Number)
    checkData.value = UserList.value.map((item) => {
      if (arr.value.includes(item.UserID)) {
        item.checked = true
      }
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
        Info.value.FieldVisible = e.join()
      }
    })
    arr.value = e
  }
}

const deleteFieldUser = (index) => {
  checkData.value[index].checked = false
  arr.value = arr.value.filter((item) => {
    return item !== checkData.value[index].UserID
  })
  Info.value.FieldVisible = arr.value.join()
}

const emit = defineEmits(['myClick'])
const dialogConfirm = (e) => {
  e.validate((valid) => {
    if (valid) {
      Info.value.IsDetail = props.type === 'main' ? false : true
      emit('myClick', Info.value)
    }
  })
}
const dialogCancel = () => {
  emit('myClick')
}
</script>
<style scoped></style>
