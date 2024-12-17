<template>
  <div v-if="!isLogin">
    <el-form ref="ruleFormRef" :rules="rules" :model="formInfo" class="demo-form-inline">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formInfo.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formInfo.password" placeholder="请输入密码" clearable />
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(ruleFormRef)">登录</el-button>
    </el-form-item>
  </div>
  <div v-else>
    <span>用户ID：</span>
    <el-input type="number" v-model="input" style="width: 150px" placeholder="请输入用户ID" />
    <el-button type="success" @click="loadCustomerInfo">加载用户信息</el-button>
    <h1>客户信息</h1>
    <div v-if="customerInfo">
      <p>客户ID：{{ customerInfo.id }}</p>
      <p>客户姓名：{{ customerInfo.name }}</p>
      <p>客户年龄：{{ customerInfo.age }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
const formInfo = reactive({
  username: '',
  password: ''
})
const input = ref('')
const customerInfo = ref(null)

const ruleFormRef = ref()

const rules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 5, message: '用户名最少5位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 5, message: '密码最少5位', trigger: 'blur' }
  ]
})

const isLogin = ref(false)

const onSubmit = async (req) => {
  if (!req) return
  await req.validate(async (valid, fields) => {
    if (valid) {
      const { data } = await axios.post('http://localhost:5050/auth/login', formInfo)
      if (data.code === 0) {
        const { access_token, refresh_token } = data.data

        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        isLogin.value = true
      }
    } else {
      console.log('fail', fields)
    }
  })
}

onMounted(() => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    isLogin.value = true
  }
})

const loadCustomerInfo = async () => {
  console.log(parseInt(input.value))
  const { data } = await axios({
    url: 'http://localhost:8100/api/customer',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    },
    data: {
      userId: parseInt(input.value)
    }
  })

  if (data.code === 0) {
    customerInfo.value = data.data
    return
  }
  if (data.code === 1) {
    console.log(data.msg)
    return
  }

  if (data.code === 2) {
    refreshToken((data) => {
      if (data.code === 2) {
        isLogin.value = false
        return
      }
      const { access_token, refresh_token } = data.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      loadCustomerInfo()
    })
  }
}

async function refreshToken(callback) {
  const { data } = await axios({
    url: 'http://localhost:5050/auth/refresh',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('refresh_token')
    }
  })
  callback(data)
}
</script>
