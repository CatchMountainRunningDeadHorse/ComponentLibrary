<template>
  <div style="height: 100%">
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
              v-model.number="ruleForm.account"
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
            <el-icon v-if="isSee" @click="isShowPassword"><View /></el-icon>
            <el-icon v-else @click="isShowPassword"><Hide /></el-icon>
          </el-form-item>
          <el-form-item class="inputBox">
            <el-button class="btn" type="primary" @click="login(ruleFormRef)">登录</el-button>
          </el-form-item>
          <div style="text-align: end; color: #3f7ce3; font-size: 20px">忘记密码?</div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Lock, Avatar } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import { usePwdLogin } from '../hooks'
import { useUserRoutersStore } from '@/stores/store'
import { genarateRouter } from '@/utils/util'
const { ruleForm, ruleFormRef, pwd, rules, isSee, isShowPassword } = usePwdLogin()
const setRouter = useUserRoutersStore()
const router = useRouter()
const login = (e) => {
  if (!e) return
  e.validate(async (valid) => {
    if (valid) {
      setRouter.routePamars.uid = ruleForm.account
      const now = new Date()
      const expireTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) // 设置为当天00:00过期
      Cookies.set('isLogin', true, { expires: expireTime })

      // await setRouter.setUserRouters()
      // const newRoutes = genarateRouter(setRouter.routePamars.userRouters)
      // localStorage.setItem('customRoutes', JSON.stringify(newRoutes))
      // newRoutes.forEach((item) => {
      //   router.addRoute(item)
      // })
      console.log('55555555555555555')

      router.push('/')
    }
  })
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
