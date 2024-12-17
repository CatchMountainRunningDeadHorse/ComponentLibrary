import { reactive, ref } from 'vue'

export function useLoginWay() {
  const isScanCode = ref(false)
  function changeLoginWay() {
    isScanCode.value = !isScanCode.value
  }

  return { isScanCode, changeLoginWay }
}

//使用密码登录
export function usePwdLogin() {
  const ruleForm = reactive({
    pass: '',
    account: ''
  })
  const ruleFormRef = ref()
  const pwd = ref()
  const isSee = ref(false)
  const rules = ref({
    account: [{ required: true, trigger: 'change', message: '账号不能为空' }],
    pass: [
      { required: true, trigger: 'change', message: '密码不能为空' },
      { min: 6, max: 15, message: '密码位数只能在6~15之间', trigger: 'blur' },
      { validator: validatePass, trigger: 'blur' }
    ]
  })

  function validatePass(rule, value, callback) {
    //  密码只能由大小写英文字母或数字开头，且由大小写英文字母_.组成
    const reg = /^[A-Za-z0-9][A-Za-z0-9_.]{5,14}$/
    //   console.log('reg', value.match(reg))
    if (!value.match(reg)) {
      callback(new Error('密码由字母或数字开头，且只能为字母,数字,下划线及（.）'))
    } else {
      callback()
    }
  }

  function isShowPassword() {
    if (isSee.value) {
      pwd.value.input.attributes.type.value = 'password'
      isSee.value = false
    } else {
      pwd.value.input.attributes.type.value = 'text'
      isSee.value = true
    }
  }

  return { ruleForm, ruleFormRef, pwd, rules, isShowPassword, isSee }
}
