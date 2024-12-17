<script setup>
import { reactive, ref,watch } from 'vue'
import AmPmDate from './components/AmPmDate.vue';
const ruleFormRef = ref(null)
const form = reactive({
  // heading: '',
  dateTime:''
})
// const checkAge = (rule, value, callback) => {
//   if (!value) {
//     return callback(new Error('请输入朝向'))
//   }
//   const regex = /\d+(\.\d{1,2})?/;
//   const ruselt = value.match(regex)
//   console.log('11111111111111111', rule);

//   if (ruselt[0] < 0 || ruselt[0] > 360) {
//     callback(new Error('请输入0到360之间的数字'))
//   } else {
//     callback()
//   }
// }
const checkTime = (rule, value, callback) => {
  if (!value) {
    console.log('1111111111111',value);
    return callback(new Error('请输入朝向'))
  }
  console.log('222222222222222222',value);
  
  callback()
}
const rules = reactive({
  // heading: [{ validator: checkAge, trigger: 'blur' }],
  dateTime:[{ required: true,validator: checkTime }]
})

watch(()=>form.dateTime,()=>{
  form.dateTime = form.dateTime
})
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!',form)
    } else {
      console.log('error submit!',form)
    }
  })
}


const num = ref(null)
</script>

<template>
  <!-- <router-view v-slot="{ Component }">
    <transition>
      <component :is="Component" />
    </transition>
  </router-view> -->

  <div>
    <p>当前选中的日期: {{ form.dateTime }}</p>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto" style="max-width: 600px">
      <!-- <el-form-item label="请输入朝向" prop="heading">
        <el-input v-model="form.heading" />
      </el-form-item> -->
      <el-form-item label="请选择时间" prop="dateTime">
        <AmPmDate v-model="form.dateTime"></AmPmDate>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          Submit
        </el-button>
      </el-form-item>
    </el-form>
    <el-input-number v-model="num" :min="0" :max="360" :precision="2"/>
  </div>
</template>

<style scoped></style>
