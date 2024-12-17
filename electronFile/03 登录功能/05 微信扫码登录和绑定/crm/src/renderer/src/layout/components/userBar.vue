<template>
    <div class="user-bar">
        <!--用户信息-->
        <el-dropdown
            class="user panel-item"
            trigger="click"
            @command="handleUser"
        >   
            <div class="user-avatar">
                <el-avatar :src="userInfo.avatar"/>
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </div>
            
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="cut">切换角色</el-dropdown-item>
                    <el-dropdown-item command="uc" divided>帐号信息</el-dropdown-item>
                    <el-dropdown-item command="clearCache">清除缓存</el-dropdown-item>
                    <el-dropdown-item command="out" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
                
        </el-dropdown>

        <!--聊天通信-->
        <div class="panel-item">聊天通信</div>

        <!--搜索-->
        <div class="panel-item">搜索</div>

        <!--最小化-->
        <div class="panel-item" @click="minWindow">
            <el-icon><Minus /></el-icon>
        </div>

        <!--最大化-->
        <div class="panel-item" @click="screen">
            <el-icon><FullScreen /></el-icon>
        </div>

        <div class="panel-item" @click="close">
            <el-icon><Close /></el-icon>
        </div>


        <!-- 切换角色 dialog -->
        <el-dialog
            v-model="dialogVisible"
            title="切换角色"
            width="300px"
        >
            <div>
                <el-avatar :src="userInfo.avatar"/>
                <p>您当前身份</p>
                <p>{{ role.roleName }}</p>

                <el-dropdown>
                    <button>选择角色</button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item 
                                v-for="item in roles" 
                                :key="item"
                                @click="changeRole(item)"
                            >
                                {{ item.roleName }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

            </div>
        </el-dialog>

    </div>
</template>

<script setup>
//用户仓库
import { storeToRefs } from 'pinia'
import { useGlobalUserStore } from '@store/UserGlobalStore'
const userStore = useGlobalUserStore();
const { userInfo , roles , role , currentRolePerm , roleIndex } = storeToRefs( userStore );
//菜单仓库
import { useGlobalMenuStore } from '@store/MenuGolbalStore'
let menuStore = useGlobalMenuStore();
//路由
import { useRouter } from 'vue-router'
const router = useRouter();

//vue
import { ref } from 'vue';

//dialog
let dialogVisible = ref(false);

//下拉菜单
const handleUser = ( command )=>{

    //切换角色
    if( command=='cut' ){
        if(  roles.value.length <= 1 ){
            return ElMessage.warning('本用户没有其他权限了~');
        }
        dialogVisible.value = true;

    }
    //退出登录
    if( command == 'out' ){
        ElMessageBox.confirm('是否退出登录','提示',{
            type:'warning',
            confirmButtonText:'退出'
        }).then(()=>{

            router.replace('/login')

        }).catch(()=>{

        })
    }
}

/*
    全屏
    兼容：谷歌、火狐...
*/
import tool from '@utils/tool'
const screen = ()=>{
    let element = document.documentElement;
    tool.screen( element );
}

//缩小
const minWindow = ()=>{
    window.electron.ipcRenderer.invoke('renderer-to-main',{
        name: 'min-window',
        event: 'event',
        data: null
    })
}

//关闭窗口
const close = ()=>{
    window.electron.ipcRenderer.invoke('renderer-to-main',{
        name: 'close-window',
        event: 'event',
        data: null
    })
}


//切换角色
const changeRole = ( item )=>{
    //修改角色权限编码
    currentRolePerm.value = item.rolePerm;
    //修改当前角色权限
    role.value = item;
    //使用第几个权限
    const idx = getRoleIndex( roles , item.id );
    roleIndex.value = idx;
    //发起请求
    router.go(0);
}

//确定是切换到哪个权限
const getRoleIndex = ( roles , id )=>{
    return roles.value.findIndex(item=> item.id == id );
}
</script>


<style scoped>
.user-bar{
    display: flex;
    align-items: center;
    margin-right:15px;
}
.panel-item{
    padding:0 15px;
}
.user-avatar{
    display: flex;
    align-items: center;
}
</style>