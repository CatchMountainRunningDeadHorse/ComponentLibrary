<template>
  <div class="padding-l">
    <el-table ref="multipleTableRef" :data="formTypeData" style="width: 100%">
      <el-table-column align="center" label="序号" width="120">
        <template #default="scope">序号{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" label="分类名称">
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.FlowTypeName"
            :disabled="scope.row.disabled"
            placeholder="请输入"
            @blur="onBlur(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template #default="scope">
          <div class="flex justify-around align-items" style="font-size: 14px">
            <div class="flex align-items" @click="handleEdit(scope.$index, scope.row)">
              <el-icon color="#DFB731" size="18"><EditPen /></el-icon>
              <span class="padding-left">修改</span>
            </div>
            <div class="flex align-items" @click="handleDelete(scope.$index, scope.row)">
              <el-icon color="#D53C2A" size="18"><CircleCloseFilled /></el-icon>
              <span class="padding-left">删除</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="tableData" style="width: 100%" :show-header="false" v-if="showAddTable">
      <el-table-column width="120" align="center">
        <template #default>新增分类</template>
      </el-table-column>
      <el-table-column align="center">
        <template #default="scope">
          <el-input v-model.trim="scope.row.FlowTypeName" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column width="240" align="center">
        <template #default="scope">
          <el-button @click="cancelAdd(scope.row)">取消</el-button>
          <el-button type="success" @click="confirmAdd(scope.row)">确认</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="padding flex justify-center align-items bd-radius-s"
      style="background-color: #ebebeb"
      @click="addForm"
      v-else
    >
      <el-icon color="#2AB448" size="18"><CirclePlusFilled /></el-icon>
      <span class="padding-left-s">新增</span>
    </div>
    <div class="flex justify-end padding-top">
      <el-button type="primary" @click="onClose()">关闭</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ElTable } from 'element-plus'
import { FormType_Save } from '@/api/update'
import { getFlowType } from '@/api/query'
import { ElMessage, ElMessageBox } from 'element-plus'

const multipleTableRef = ref()
const tableData = ref([
  {
    FlowTypeID: 0,
    FlowTypeName: '',
    SaveWay: 1
  }
])
const formTypeData = ref([])
onMounted(async () => {
  const { data } = await getFlowType()
  data.forEach((item) => {
    item.disabled = true
  })
  formTypeData.value = data
})

const showAddTable = ref(false)
const addForm = () => {
  showAddTable.value = true
}

const handleEdit = (index) => {
  formTypeData.value[index].disabled = false
}
const onBlur = async (index, row) => {
  if (row.FlowTypeName === '') {
    ElMessage({
      type: 'info',
      message: '名称不能为空'
    })
    return
  }
  row.SaveWay = 2
  ElMessageBox.confirm(`确认要修改‘序号${index + 1}’的分类名称吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const dict = {}
      dict.ContentHead = JSON.stringify(row)
      const { data, Success } = await FormType_Save(dict)
      if (Success) {
        ElMessage({
          type: 'success',
          message: '修改成功'
        })
        data.forEach((item) => {
          item.disabled = true
        })
        formTypeData.value = data
      } else {
        ElMessage({
          type: 'error',
          message: '修改失败'
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}
const handleDelete = (index, row) => {
  console.log(index, row)
  row.SaveWay = 3
  ElMessageBox.confirm(`确认要删除‘序号${index + 1}’的分类吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const dict = {}
      dict.ContentHead = JSON.stringify(row)
      const { data, Success } = await FormType_Save(dict)
      if (Success) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        data.forEach((item) => {
          item.disabled = true
        })
        formTypeData.value = data
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败'
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}

const cancelAdd = async () => {
  showAddTable.value = false
  tableData.value = [
    {
      FlowTypeID: 0,
      FlowTypeName: '',
      SaveWay: 1
    }
  ]
}
const confirmAdd = async (row) => {
  if (row.FlowTypeName === '') {
    ElMessage({
      type: 'info',
      message: '名称不能为空'
    })
    return
  }
  const dict = {}
  dict.ContentHead = JSON.stringify(row)
  const { data, Success } = await FormType_Save(dict)
  if (Success) {
    ElMessage({
      type: 'success',
      message: '新增成功'
    })
    data.forEach((item) => {
      item.disabled = true
    })
    formTypeData.value = data
    showAddTable.value = false
  } else {
    ElMessage({
      type: 'error',
      message: '新增失败'
    })
  }
  tableData.value = [
    {
      FlowTypeID: 0,
      FlowTypeName: '',
      SaveWay: 1
    }
  ]
}
const emits = defineEmits(['myClick'])
const onClose = () => {
  emits('myClick')
}
</script>
<style scoped>
:deep .el-table th.el-table__cell {
  background-color: transparent;
}
:deep .el-table__header-wrapper {
  --el-table-tr-bg-color: #c6d5ef;
  --el-table-header-text-color: #000;
  border-radius: 4px;
}
</style>
