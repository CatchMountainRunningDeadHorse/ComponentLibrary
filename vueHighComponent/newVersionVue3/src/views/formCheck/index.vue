<template>
  <div class="container">
    <h1>计算机开发从业者信息表</h1>
    <form id="userForm">
      <div class="form-element">
        <p class="warn"></p>
        <label for="realname">真实姓名</label>
        <input required type="text" id="realname" name="realname" placeholder="真实姓名" />
        <i class="fa fa-check"></i>
      </div>
      <div class="form-element">
        <p class="warn"></p>
        <label for="idnumber">证件号码</label>
        <input type="text" id="idnumber" name="idnumber" placeholder="证件号码" />
        <i class="fa fa-check"></i>
      </div>
      <div class="form-element">
        <p class="warn"></p>
        <label for="">性别</label>
        女 <input required type="radio" name="gender" value="female" /> 男
        <input type="radio" name="gender" value="male" />
        <i class="fa fa-check"></i>
      </div>
      <div class="form-element">
        <p class="warn"></p>
        <label for="occupation">职业</label>
        <select required name="occupation">
          <option value="">请选择</option>
          <option value="frontend">前端</option>
          <option value="backend">后端</option>
          <option value="network">网络</option>
          <option value="operation">运维</option>
        </select>
        <i class="fa fa-check"></i>
      </div>

      <div class="form-element">
        <p class="warn"></p>
        <label for="occupation">语言学习</label>
        Java <input type="checkbox" name="learning" value="java" /> html
        <input type="checkbox" name="learning" value="html" /> javascript
        <input type="checkbox" name="learning" value="javascript" />
        <i class="fa fa-check"></i>
      </div>
      <div class="form-element">
        <p class="warn"></p>
        <label for="intro">自我介绍</label>
        <textarea name="intro" id="intro" placeholder="自我介绍"></textarea>
        <i class="fa fa-check"></i>
      </div>
      <div class="form-element">
        <button type="submit" id="submitBtn" disabled>提交信息</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { createForm } from './formCheck.js'
onMounted(() => {
  createForm({
    realname: {
      value: '',
      mark: '全部是中文且不大于10个字',
      regular: (value) => /[\u4e00-\u9fa5]/.test(value) && value.length <= 10,
      listener: (info) => console.log(info)
    },
    idnumber: {
      value: '',
      mark: '8为数字',
      regular: (value) => /^\d+$/.test(value) && value.length === 8
    },
    gender: {
      value: '',
      mark: '必须选择性别',
      regular: (value) => ['female', 'male'].includes(value)
    },
    occupation: {
      value: '',
      mark: '必须选择职业',
      regular: (value) => ['frontend', 'backend', 'network', 'operation'].includes(value)
    },
    learning: {
      value: [],
      mark: '至少选择一个学习语言',
      regular: (value) =>
        value.every((el) => ['java', 'html', 'javascript'].includes(el)) && value.length > 0
    },
    intro: {
      value: '',
      mark: '至少填写10个字',
      regular: (value) => value.length >= 10
    },
    confirm: '#submitBtn',
    submit: (info) => {
      console.log(info)
    }
  })
})
</script>

<style scoped lang="scss">
.container {
  width: 500px;
  margin: 0 auto;

  h1 {
    font-weight: normal;
  }

  .form-element {
    padding: 15px 0;
    .warn {
      color: red;
      font-size: 14px;
    }
    .warn {
      color: red;
      font-size: 14px;
    }
    label {
      display: inline-block;
      width: 100px;
      &:has(+ input[required], + select[required])::after {
        content: '*';
        color: #f40;
      }
    }
    .fa {
      display: none;
      color: green;
    }
  }
}
</style>