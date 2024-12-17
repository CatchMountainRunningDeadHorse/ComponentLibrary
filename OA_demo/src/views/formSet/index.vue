<template>
  <div class="padding-left-l padding-right-l" style="background-color: #eaf0f3; width: 100%">
    <div style="position: sticky; top: 0px; z-index: 99">
      <div class="padding" style="background-color: #eaf0f3"></div>
      <div style="background-color: #fff; padding: 14px 20px" class="flex align-items">
        <span class="padding-right-xl">表单模块</span>
        <SvgIcon iconName="icon-xiexian" size="20px" style="padding-right: 50px"></SvgIcon>
        <span
          class="padding-right-xl"
          style="color: #666666"
          v-for="item in FormData"
          :key="item.FlowTypeID"
          >{{ item.FlowTypeName }}</span
        >
        <div class="flex align-items" @click="manageForm">
          <SvgIcon iconName="icon-shezhi" className="padding-right" color="#5FB772"></SvgIcon>
          <span>管理</span>
        </div>
      </div>
    </div>
    <div style="background-color: #fff" v-for="(item, ix) in FormData" :key="item.FlowTypeID">
      <div class="padding" style="background-color: #eaf0f3"></div>
      <el-tabs v-model="item.FlowTypeID" class="demo-tabs">
        <el-tab-pane :name="item.FlowTypeID">
          <template #label>
            <div class="custom-tabs-label flex align-items">
              <SvgIcon
                :iconName="icons[ix % icons.length].icon"
                className="padding-right"
                :color="icons[ix % icons.length].color"
              ></SvgIcon>
              <span>{{ item.FlowTypeName }}</span>
            </div>
          </template>
          <div class="flex padding-bottom padding-left-l" style="flex-wrap: wrap">
            <div
              style="position: relative"
              class="margin-right align-items flex box-card bs-box margin-bottom padding-left-l padding-right-l"
              v-for="(elem, index) in item.children"
              :key="elem.FlowID"
              @click="addForm('edit', elem)"
              :class="elem.IsStop ? 'bgCover' : ''"
            >
              <div style="position: absolute; float: right; top: 0; right: 0; z-index: 999">
                <menuPopup :data="elem" :menuPopup="elem.IsStop ? menuPopups2 : menuPopups1">
                  <el-icon><MoreFilled /></el-icon>
                </menuPopup>
              </div>

              <el-image
                style="width: 32px; height: 32px"
                :src="`/static/img/${imgs[index % imgs.length]}.png`"
              />
              <span class="text-text margin-left">{{ elem.FlowName }}</span>
            </div>
            <div
              class="add-card flex align-items justify-center margin-right margin-bottom"
              @click="addForm('add')"
            >
              <el-icon size="40px"><Plus /></el-icon>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog v-model="showFormSet" v-if="showFormSet" title="表单设置" width="60%">
      <addFormSet :data="formSetData" @myClick="handleClick"></addFormSet>
    </el-dialog>
    <el-dialog v-model="showFormManage" v-if="showFormManage" title="表单管理" width="60%">
      <formManage :data="formSetData" @myClick="handleManageClick"></formManage>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BasicForm_HisData, BasicForm_IsBan, BasicForm_Delete } from '@/api/query'
import { dataClassify } from '@/utils/util'
import menuPopup from '@/components/menuPopup'
import addFormSet from './components/addFormSet'
import formManage from './components/formManage'
import { ElMessage, ElMessageBox } from 'element-plus'

const imgs = ref(['001', '002', '003', '004'])

const icons = ref([
  { icon: 'icon-daohang_jiaqinyun', color: '#2A80E2' },
  { icon: 'icon-hangzhengguanli', color: '#412AE2' },
  { icon: 'icon-caiwu', color: '#E22A2A' },
  { icon: 'icon-daichujipiao', color: '#2265D8' }
])

const menuPopups1 = ref([
  {
    label: '删除',
    disable: false,
    click: (row) => {
      return deleteForm(row)
    }
  },
  {
    label: '禁用',
    disable: false,
    click: (row) => {
      return shutOff(row)
    }
  }
])
const menuPopups2 = ref([
  {
    label: '删除',
    disable: false,
    click: (row) => {
      return deleteForm(row)
    }
  },
  {
    label: '启用',
    disable: false,
    click: (row) => {
      return switchOn(row)
    }
  }
])

onMounted(async () => {
  getFormData()
})

const FormData = ref([])
const getFormData = async () => {
  let { data } = await BasicForm_HisData()
  const dsf = dataClassify(
    data,
    ['FlowTypeID'],
    ['FlowTypeName', 'FlowTypeID', 'FlowTypeSort', 'FlowType']
  )
  console.log('11111111111111111111111111', data)
  FormData.value = dsf
}

const showFormSet = ref(false)
const formSetData = ref({})
const addForm = (type, parmas) => {
  if (type === 'add') {
    formSetData.value = {}
  } else {
    formSetData.value = parmas
  }
  showFormSet.value = true
}
const handleClick = (e) => {
  if (e === '确认') {
    getFormData()
  }
  showFormSet.value = false
}

const deleteForm = (e) => {
  ElMessageBox.confirm(`确认要删除‘${e.FlowName}’吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data, Success } = await BasicForm_Delete(e)
      if (Success) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        if (data.length) {
          const dsf = dataClassify(
            data,
            ['FlowTypeID'],
            ['FlowTypeName', 'FlowTypeID', 'FlowTypeSort', 'FlowType']
          )
          FormData.value = dsf
        }
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
const shutOff = (e) => {
  ElMessageBox.confirm(`确认要禁用‘${e.FlowName}’吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data, Success } = await BasicForm_IsBan({ FlowID: e.FlowID, IsStop: true })
      if (Success) {
        ElMessage({
          type: 'success',
          message: '禁用成功'
        })
        if (data.length) {
          const dsf = dataClassify(
            data,
            ['FlowTypeID'],
            ['FlowTypeName', 'FlowTypeID', 'FlowTypeSort', 'FlowType']
          )
          FormData.value = dsf
        }
      } else {
        ElMessage({
          type: 'error',
          message: '禁用失败'
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '禁用取消'
      })
    })
}
const switchOn = (e) => {
  ElMessageBox.confirm(`确认要启用‘${e.FlowName}’吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data, Success } = await BasicForm_IsBan({ FlowID: e.FlowID, IsStop: false })
      if (Success) {
        ElMessage({
          type: 'success',
          message: '启用成功'
        })
        if (data.length) {
          const dsf = dataClassify(
            data,
            ['FlowTypeID'],
            ['FlowTypeName', 'FlowTypeID', 'FlowTypeSort', 'FlowType']
          )
          FormData.value = dsf
        }
      } else {
        ElMessage({
          type: 'error',
          message: '启用失败'
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '启用取消'
      })
    })
}

const showFormManage = ref()
const manageForm = () => {
  showFormManage.value = true
}
const handleManageClick = () => {
  showFormManage.value = false
}
</script>

<style scoped>
.demo-tabs :deep .el-tabs__content {
  overflow: visible;
}
:deep .el-tabs__item {
  padding: 0 20px !important;
}
.custom-tabs-label {
  color: #333333;
}
.box-card {
  /* width: 220px; */
  height: 64px;
  background: #e4eaf3;
  border-radius: 6px 6px 6px 6px;
}
.add-card {
  width: 64px;
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
:deep .el-tabs__active-bar {
  background-color: transparent;
}

.bgCover {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #e4eaf3;
  opacity: 0.5;
  z-index: 100;
}
</style>
