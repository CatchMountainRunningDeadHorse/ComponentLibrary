<template>
  <div style="text-align: center; font-size: 40px; height: 60px">----用户登录----</div>
  <div class="flex justify-center align-items" style="width: 600px; height: calc(100% - 60px)">
    <el-form
      ref="ruleFormRef"
      style="width: 450px; height: 100%"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <div class="column" style="height: 100%">
        <el-form-item prop="account" class="inputBox">
          <el-input
            v-model="ruleForm.account"
            type="text"
            autocomplete="off"
            placeholder="请输入账号"
            :prefix-icon="Avatar"
            style="height: 60%; font-size: 1.5em"
          />
        </el-form-item>
        <el-form-item prop="pass" class="inputBox">
          <el-input
            ref="pwd"
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            style="height: 60%; font-size: 1.5em"
          />
          <el-icon v-if="isSee" @click="showPwd"><View /></el-icon>
          <el-icon v-else @click="showPwd"><Hide /></el-icon>
        </el-form-item>
        <el-form-item class="inputBox">
          <el-button class="btn" type="primary" @click="login(ruleFormRef)">登录</el-button>
        </el-form-item>
        <div style="text-align: end; color: #3f7ce3; font-size: 20px">忘记密码?</div>
      </div>
    </el-form>
  </div>

  <el-dialog v-model="dialogVisible" v-if="dialogVisible" title="选择客户" style="height: 50%">
    <CustSelect :data="CustData" @click="selectedCust"></CustSelect>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User_Login, UserSign_GetData, UserInfo_GetData, GetOBSInfo } from '@/api/query'
import { ElMessage } from 'element-plus'
import CustSelect from '@/views/login/components/CustSelect.vue'
import { Lock, Avatar } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
const ruleForm = ref({
  pass: '',
  account: ''
})
const ruleFormRef = ref()
const pwd = ref()

// 自定义验证规则
const validatePass = (rule, value, callback) => {
  //  密码只能由大小写英文字母或数字开头，且由大小写英文字母_.组成
  const reg = /^[A-Za-z0-9][A-Za-z0-9_.]{5,14}$/
  //   console.log('reg', value.match(reg))
  if (!value.match(reg)) {
    callback(new Error('密码由字母或数字开头，且只能为字母,数字,下划线及（.）'))
  } else {
    callback()
  }
}
const rules = ref({
  account: [{ required: true, trigger: 'change', message: '账号不能为空' }],
  pass: [
    { required: true, trigger: 'change', message: '密码不能为空' },
    { min: 6, max: 15, message: '密码位数只能在6~15之间', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ]
})

let isSee = ref(false)
const showPwd = () => {
  if (isSee.value) {
    pwd.value.input.attributes.type.value = 'password'
    isSee.value = false
  } else {
    pwd.value.input.attributes.type.value = 'text'
    isSee.value = true
  }
}

const CustData = ref([])
const dialogVisible = ref(false)
const login = (e) => {
  e.validate(async (valid) => {
    if (valid) {
      //对服务端进行websocket的连接
      // testSocketService.Instance.connect(ruleForm.value.account)
      //对服务端进行websocket的连接
      // SocketService.Instance.connect()
      const { data, Success } = await User_Login(ruleForm.value)
      if (Success) {
        if (data.code === 0) {
          const info = JSON.parse(data.data)
          localStorage.setItem('UserInfo', JSON.stringify(info.UserData[0]))
          CustData.value = info.CustData.filter((item) => {
            return item.ProdID === 1
          })
          if (CustData.value.length > 1) {
            dialogVisible.value = true
          } else {
            localStorage.setItem('CustGuid', CustData.value[0].CustGuid)
            localStorage.setItem('CustInfo', JSON.stringify(CustData.value[0]))
            loginSuccess()
          }
        } else {
          ElMessage({
            message: JSON.parse(data.data).Msg,
            type: 'error'
          })
        }
      }
    }
  })
}

const router = useRouter()
const loginSuccess = async () => {
  localStorage.setItem('CustList', JSON.stringify(CustData.value))
  const now = new Date()
  const expireTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) // 设置为当天00:00过期
  Cookies.set('isLogin', true, { expires: expireTime })
  router.push('/')
  loginAfter()
}

const loginAfter = () => {
  UserInfo_GetData().then((res) => {
    res.data.forEach((item) => {
      item.checked = false
    })
    localStorage.setItem('UserList', JSON.stringify(res.data))
  })
  UserSign_GetData().then((res) => {
    const jsonData = res.data
    if (jsonData.length) {
      localStorage.setItem('UserSign', `data:image/png;base64,${jsonData[0].UserSign}`)
    } else {
      localStorage.setItem('UserSign', '')
    }
  })

  GetOBSInfo().then((res) => {
    localStorage.setItem('OBSInfo', JSON.stringify(res.data))
  })
}

const selectedCust = (e) => {
  dialogVisible.value = false
  localStorage.setItem('CustGuid', e.CustGuid)
  localStorage.setItem('CustInfo', JSON.stringify(e))
  loginSuccess()
}
</script>

<style scoped>
.demo-ruleForm .inputBox {
  position: relative;
  flex: 0 0 25%;
  margin-bottom: 0;
}
.demo-ruleForm .inputBox input {
  position: relative;
  width: 100%;
  padding: 15px 20px;
  outline: none;
  font-size: 1.25em;
  color: #8f2c24;
  border-radius: 5px;
  background: #fff;
  border: none;
  margin-bottom: 30px;
}
.demo-ruleForm .inputBox i {
  position: absolute;
  right: 15px;
  font-size: 28px;
  color: #9d9d9d;
  cursor: pointer;
}
.demo-ruleForm .inputBox .see {
  display: none;
}
.demo-ruleForm .inputBox .no-see {
  display: block;
}
.demo-ruleForm .inputBox ::placeholder {
  color: #9d9d9d;
}
.demo-ruleForm .inputBox .btn {
  position: relative;
  outline: none;
  font-size: 1.25em;
  color: #fff;
  border-radius: 5px;
  background: #3f7ce3;
  width: 100%;
  height: auto;
  padding: 15px 20px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
.demo-ruleForm .group {
  display: flex;
  justify-content: space-between;
}
.demo-ruleForm .group a {
  font-size: 1.25em;
  color: #8f2c24;
  font-weight: 500;
  text-decoration: none;
}
</style>
