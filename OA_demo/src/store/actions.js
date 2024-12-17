var baseTokenUrl = 'https://www.yoyangyun.com/Token/'
import axios from 'axios'
// import { GetOBSInfo } from '@/api/query'

function GetRandomNum(Min, Max) {
  var Range = Max - Min
  var Rand = Math.random()
  return Min + Math.round(Rand * Range)
}
export function refreshToken(state) {
  // 这里写你的刷新token的逻辑，例如向服务器发送一个刷新token的请求
  var nowDate = Date.parse(new Date()) / 1000
  var rand = GetRandomNum(1, 9)
  var str = rand.toString() + nowDate * rand
  var url = baseTokenUrl + '?' + str
  return new Promise((resolve) => {
    axios
      .get(url)
      .then((response) => {
        var tokenJson = JSON.parse(response.data.data)
        state.Token = tokenJson // 将新的token保存到state中
        state.commit('Token', tokenJson)
        //localStorage.setItem("Token", response.data.data);

        //生成sessionID
        var nowDate = Date.parse(new Date()) / 1000
        var rand = GetRandomNum(1, 9)
        var newStr = rand.toString() + nowDate * rand
        var appid = tokenJson.AppID
        var sessionID = appid.substring(0, 6) + '-' + newStr + '-' + appid.substring(6)
        state.SessionID = sessionID
        //console.log("SessionID=>", state.SessionID);
        state.commit('SessionID', sessionID)
        resolve(sessionID)
      })
      .catch((error) => {
        console.error('刷新Token失败:', error)
        state.commit('changeNetworkSuccess', false)
      })
  })
}

// export async function Get_OBSInfo({ commit }) {
//   const { data } = await GetOBSInfo()
//   commit('setOBSInfo', data)
// }

export default {
  refreshToken
  // Get_OBSInfo
}
