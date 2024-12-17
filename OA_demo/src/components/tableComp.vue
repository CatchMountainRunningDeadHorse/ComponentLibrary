<template>
  <el-table
    ref="tables"
    align="center"
    style="width: 100%; overflow-y: auto"
    :data="tableData"
    :row-class-name="tableRowClassName"
    :max-height="hg + 'px'"
    border
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    @row-dblclick="handleSelectionDblclick"
    @row-contextmenu="rowContextMenu"
  >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column type="index" width="100" label="序号">
      <template #default="{ $index }">
        {{ (queryForm.currentPage - 1) * queryForm.pageSize + $index + 1 }}
      </template>
    </el-table-column>

    <el-table-column
      v-for="(item, index) in option.columns"
      :key="index"
      :prop="item.field"
      :label="item.label"
      :min-width="item.minWidth"
      align="center"
      :formatter="
        item.type === 'date'
          ? (row) => {
              return sub(row.ApplyDate, 0, 19)
            }
          : (row) => {
              return row[item.field]
            }
      "
    >
      <template #default="scope" v-if="item.field === 'ApplyStatuStr'">
        <el-tag v-if="scope.row.ApplyStatus === 2" type="success">{{
          scope.row.ApplyStatuStr
        }}</el-tag>
        <el-tag v-else-if="scope.row.ApplyStatus === 3" type="danger">{{
          scope.row.ApplyStatuStr
        }}</el-tag>
        <el-tag v-else-if="scope.row.ApplyStatus === 0" type="warning">{{
          scope.row.ApplyStatuStr
        }}</el-tag>
        <el-tag v-else type="info">{{ scope.row.ApplyStatuStr }}</el-tag>
      </template>
    </el-table-column>
    <!--操作栏-->
    <el-table-column align="center" fixed="right" label="操作" :width="150">
      <template v-slot="scope">
        <div v-if="option.rowButtons.length <= 2">
          <template v-for="(item, index) in option.rowButtons" :key="index">
            <el-button type="primary" size="small" link @click="item.click(scope.row)">{{
              item.label
            }}</el-button>
          </template>
        </div>
        <div v-else style="display: flex; align-items: center; justify-content: space-around">
          <el-button
            type="primary"
            link
            size="small"
            @click="option.rowButtons[0].click(scope.row)"
            >{{ option.rowButtons[0].label }}</el-button
          >
          <el-dropdown class="elDropDown">
            <span class="el-dropdown-link"> 更多 </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item class="column">
                  <template
                    v-for="(item, index) in option.rowButtons.filter((el, index) => index > 0)"
                    :key="index"
                  >
                    <el-button
                      type="primary"
                      size="small"
                      link
                      class="elButton"
                      @click="item.click(scope.row)"
                      >{{ item.label }}</el-button
                    >
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { sub } from '@/utils/util'
const props = defineProps({
  option: {
    type: Object,
    default: ref([])
  },
  tableData: {
    type: Object,
    default: ref([])
  },
  queryForm: {
    type: Object,
    default: ref({})
  },
  hg: {
    default: '500'
  }
})
// 是否显示
const isHide = (item, row) => {
  if (typeof item.isHide === 'function') {
    return item.isHide(row)
  } else {
    return !item.isHide
  }
}

const tableRowClassName = () => {}
const handleSelectionChange = () => {}
const handleSortChange = () => {}
const handleSelectionDblclick = () => {}
const rowContextMenu = () => {}
</script>

<style>
.elDropDown {
  --el-text-color-regular: #409eff;
  --el-font-size-base: 12px;
}

.column .elButton {
  margin-left: 0;
  padding: 10px 0;
}
</style>
