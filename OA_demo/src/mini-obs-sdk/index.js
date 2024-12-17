import ObsClient from 'esdk-obs-browserjs'
import store from '@/store/index'
//OBS客户端初始化
// 创建ObsClient实例
var obsClient = new ObsClient({
  // 认证用的ak和sk硬编码到代码中或者明文存储都有很大的安全风险，建议在配置文件或者环境变量中密文存放，使用时解密，确保安全；本示例以ak和sk保存在环境变量中为例，运行本示例前请先在本地环境中设置环境变量AccessKeyID和SecretAccessKey。
  // 前端本身没有process对象，可以使用webpack类打包工具定义环境变量，就可以在代码中运行了。
  // 您可以登录访问管理控制台获取访问密钥AK/SK，获取方式请参见https://support.huaweicloud.com/intl/zh-cn/usermanual-ca/ca_01_0003.html
  access_key_id: store.state.OBSInfo.AK,
  secret_access_key: store.state.OBSInfo.SK,
  // 这里以中国-香港为例，其他地区请按实际情况填写
  server: store.state.OBSInfo.EndPoint
})

export default obsClient

// obsClient.putObject(
//     {
//       Bucket: store.state.OBSInfo.BucketName,
//       Key: 'objectname',
//       SourceFile: document.getElementById('input-file').files[0]
//     },
//     function (err, result) {
//       if (err) {
//         console.error('Error-->' + err)
//       } else {
//         console.log('Status-->' + result.CommonMsg.Status)
//       }
//     }
//   )
