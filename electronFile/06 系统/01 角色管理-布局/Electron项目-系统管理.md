# 一、角色管理

1.1 布局

```
<template>
    <div style="height: 100%;">
        <el-container>
            <el-main>
                <el-tabs type="border-card">
                    <el-tab-pane label="角色列表">
                        <!--form-->
                        <el-card class="card-container">
                            <el-form>
                                <el-row :gutter="15">
                                    <el-col :span="8">
                                        <el-form-item label="角色名称" >
                                            <el-input placeholder="请输入角色编码"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="角色编码">
                                            <el-input placeholder="请输入角色编码"></el-input>
                                        </el-form-item></el-col>
                                    <el-col :span="9">
                                        <el-form-item label="状态">
                                            <el-select placeholder="请选择启动状态">
                                                <el-option>启用</el-option>
                                                <el-option>禁用</el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item>
                                            <el-button icon="search" type="primary">搜索</el-button>
                                            <el-button icon="refreshLeft">重置</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-card>
                        <!--table-->
                        <el-card>
                            <div class="toolbar">
                                <el-button icon="plus" type="primary">新增</el-button>
                            </div>
                            <el-table :data="tableData" border>
                                <el-table-column type="selection"></el-table-column>
                                <el-table-column prop='roleName' align="center" label="角色名称"></el-table-column>
                                <el-table-column prop='rolePerm' align="center" label="权限字符"></el-table-column>
                                <el-table-column label="是否启用" align="center">
                                    <el-tag>是</el-tag>
                                </el-table-column>
                                <el-table-column prop='createTime' align="center" label="创建时间"></el-table-column>
                                <el-table-column label="操作" align="center" width="220" fixed="right">
                                    <template #default="{ row }">
                                        <div class="sys-table-main-actions">
                                            <el-link icon="edit" type="primary" :underline="false">编辑</el-link>
                                            <el-link icon="delete" type="danger" :underline="false" style="margin: 0 8px">删除</el-link>
                                            <router-link class="el-link el-link--error" type="success" to="/">分配用户</router-link>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane label="回收站">回收站</el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
const tableData = [
    {
        roleName:'名称',
        rolePerm:'字符',
        createTime:'创建时间'
    },
    {
        roleName:'名称',
        rolePerm:'字符',
        createTime:'创建时间'
    },
    {
        roleName:'名称',
        rolePerm:'字符',
        createTime:'创建时间'
    }
]
</script>

<style scoped>
.card-container,.toolbar{
    margin-bottom:15px;
}
</style>
```

