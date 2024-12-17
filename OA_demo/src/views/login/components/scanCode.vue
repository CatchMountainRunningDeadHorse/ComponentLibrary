<template>
  <!-- <div> -->
  <div style="text-align: center; font-size: 40px; height: 60px">----微信登录----</div>
  <div class="flex justify-center align-items" style="width: 600px; height: calc(100% - 60px)">
    <div class="column justify-center" style="height: 100%">
      <div v-if="!isOverdue" class="column justify-center" style="height: 75%">
        <img src="/static/img/010.png" class="illustration" alt="Illustration" v-if="isScanCode" />
        <img :src="qrCodeUrl" class="illustration" alt="Illustration" v-else />
      </div>
      <div v-else style="height: 75%" class="column justify-center">
        <img src="/static/img/009.png" class="illustration" @click="refershCode" />
      </div>
      <div style="height: 25%">
        <div style="text-align: center; color: #333333" v-if="!isScanCode">
          <el-checkbox v-model="isAvoidScanCode" label="15天内免扫码登录" />
        </div>
        <div style="text-align: center; color: #333333" v-else>
          <div style="color: #aaa">在微信中选择账号登录</div>
          <div style="color: #5fa1f2" @click="refershCode">重新扫码</div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserSign_GetData,
  UserInfo_GetData,
  WebLogin_CodeGenerator,
  WebLogin_GetCodeStatus,
  Custom_GetByProdID,
  GetOBSInfo
} from '@/api/query'
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode'
import Cookies from 'js-cookie'
const qrCodeUrl = ref('/static/img/009.png')
const Code = ref()
onMounted(() => {
  getQRCode()
})
const getQRCode = async () => {
  const { data } = await WebLogin_CodeGenerator()
  // 使用函数生成二维码
  Code.value = data.Code
  await generateQRCode(`https://www.yoyangyun.com/login?Code=${data.Code}&SystemID=1&ProdID=1`)
  GetCodeStatus()
}
const UserData = ref()
const GetCodeStatus = () => {
  WebLogin_GetCodeStatus({ Code: Code.value }).then((res) => {
    if (res.Success) {
      if (res.data.length) {
        UserData.value = res.data[0]
        pollStatus(res.data[0].Status, res.data[0].ExpireMins)
      } else {
        ElMessage({
          message: '获取二维码状态失败',
          type: 'error'
        })
      }
    } else {
      ElMessage({
        message: '获取二维码状态失败',
        type: 'error'
      })
    }
  })
}

const router = useRouter()
const isScanCode = ref(false)
const isOverdue = ref(false) //是否过期
let count1 = 0,
  count2 = 0
const timer = ref(0)
const pollStatus = async (Status, ExpireMins) => {
  count1++
  if (Status === 0 && ExpireMins > 0) {
    timer.value = setTimeout(() => {
      GetCodeStatus()
    }, count1 * 500)
  } else if (Status === 1) {
    count2++
    isScanCode.value = true
    timer.value = setTimeout(() => {
      GetCodeStatus()
    }, count2 * 500)
  } else if (Status === 2) {
    console.log('已登录')
    localStorage.setItem(
      'UserInfo',
      JSON.stringify({ UserID: UserData.value.UserID, UserName: UserData.value.UserName })
    )
    localStorage.setItem('CustGuid', UserData.value.CustGuid)
    localStorage.setItem(
      'CustInfo',
      JSON.stringify({
        CustID: UserData.value.CustID,
        CustName: UserData.value.CustName,
        CustGuid: UserData.value.CustGuid
      })
    )
    const { data } = await Custom_GetByProdID({ UserID: UserData.value.UserID, ProdID: 1 })
    localStorage.setItem('CustList', JSON.stringify(data))
    loginSuccess()
  } else if (Status === 0 && ExpireMins <= 0) {
    console.log('已过期')
    isOverdue.value = true
  }
}
const generateQRCode = async (text) => {
  try {
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.3,
      margin: 1
    }
    const qrImage = await QRCode.toDataURL(text, opts)
    // console.log(qrImage)
    // 可以在这里将qrImage插入到HTML中的某个元素，比如一个<img>标签
    qrCodeUrl.value = qrImage
  } catch (error) {
    console.error(error)
    ElMessage({
      message: error,
      type: 'error'
    })
  }
}

const loginSuccess = async () => {
  const now = new Date()
  let days = 0
  if (isAvoidScanCode.value) {
    days = 15
  }
  now.setDate(now.getDate() + days)
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

const isAvoidScanCode = ref(false)
// const AvoidScanCode = (e) => {
//   console.log('22222222222222222222', e, isAvoidScanCode.value)
// }
const refershCode = async () => {
  isOverdue.value = false
  isScanCode.value = false
  count1 = 0
  count2 = 0
  getQRCode()
}

onUnmounted(() => {
  clearTimeout(timer.value)
})
</script>

<style scoped>
.illustration {
  width: 200px;
  height: 200px;
}
</style>
