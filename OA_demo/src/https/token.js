import CryptoJS from 'crypto-js'
import { get } from './requests'
import store from '@/store/index'
var baseTokenUrl = 'https://www.yoyangyun.com/Token/'

//获取令牌信息
export function getToken() {
  var nowDate = Date.parse(new Date()) / 1000
  var rand = GetRandomNum(1, 9)
  var str = rand.toString() + nowDate * rand
  var url = baseTokenUrl + '?' + str
  get(url, {}).then((res) => {
    localStorage.setItem('Token', JSON.stringify(res.data))
  })
}

//生成sessionID
export function getSessionID() {
  //checkToken();
  var sessionID = ''
  var nowDate = Date.parse(new Date()) / 1000
  var rand = GetRandomNum(1, 9)
  var newStr = rand.toString() + nowDate * rand
  var access_token = store.getters.accessToken
  if (access_token != null) {
    var token = access_token.AppID
    sessionID = token.substring(0, 6) + '-' + newStr + '-' + token.substring(6)
    return sessionID
  }
  return sessionID
}

//生成随机数
export function GetRandomNum(Min, Max) {
  var Range = Max - Min
  var Rand = Math.random()
  return Min + Math.round(Rand * Range)
}

export function checkToken() {
  //localStorage.removeItem("Token");
  //判断令牌是否有效
  var access_token = store.getters.accessToken
  if (access_token != null) {
    var expired = access_token.ExpiredTime
    //使用的时候判断没有或者过期，重新获取令牌
    var times = Date.parse(new Date(expired)) / 1000
    var nowTimes = Date.parse(new Date()) / 1000
    if (times < nowTimes) {
      console.log('过期啦')
      //重新获取令牌
      getToken()
    } else {
      console.log('有效期内')
    }
  } else {
    console.log('令牌信息为空')
    //首次运行获取令牌
    getToken()
  }
}

//数据加密
export function aesEncrypt(str) {
  //var token = JSON.parse(localStorage.getItem("Token"));
  var access_token = store.getters.accessToken
  var token = access_token
  if (null != token) {
    var srcs = CryptoJS.enc.Utf8.parse(str)
    var encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse(token.AppSecret), {
      iv: CryptoJS.enc.Utf8.parse(token.AppSecretIV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.ciphertext.toString().toUpperCase() //这个是基础的16位16进制的加密返回值
  }
}

//数据解密
export function Decrypt(str) {
  //var token = JSON.parse(localStorage.getItem("Token"));
  var access_token = store.getters.accessToken
  var token = access_token
  if (null != token) {
    var key = JSON.stringify(token.AppSecret).substring(1, 17)
    var iv = JSON.stringify(token.AppSecretIV).substring(1, 17)
    var encryptedHexStr = CryptoJS.enc.Hex.parse(str)
    var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    var decrypt = CryptoJS.AES.decrypt(srcs, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  }
}

//判断字符串是否为json格式
export function isJson(jsonStr) {
  try {
    JSON.parse(jsonStr)
    return true
  } catch (e) {
    return false
  }
}
