import axios from './axios'

const TIMEOUT = 10000 // 超时时间
const RETRY_TIME = 3 // 重试次数

// 执行请求的方法
function request(config, retry = 0) {
  const { timeout = TIMEOUT } = config
  return axios({
    ...config,
    timeout
  })
    .then((res) => {
      return Promise.resolve(res)
    })
    .catch((error) => {
      if (retry >= RETRY_TIME) {
        // 重试次数超过了限制
        return Promise.reject(error)
      }
      retry++
      // 使用 Promise.reject 手动抛出异常，让 Promise.all 并发请求的方法中的 catch 捕获该异常，从而实现重试机制
      return Promise.reject(error)
    })
}

// 封装 get 请求方法
export function get(url, params = {}, type = 'buss') {
  return request({
    url,
    params,
    method: 'get',
    urlType: type
  })
}

// 封装 post 请求方法
export function post(url, data = {}, type = 'buss') {
  return request({
    url,
    data,
    method: 'post',
    urlType: type
  })
}

// 封装 put 请求方法
export function put(url, data = {}, type = 'buss') {
  return request({
    url,
    data,
    method: 'put',
    urlType: type
  })
}

// 封装 delete 请求方法
export function del(url, params = {}, type = 'buss') {
  return request({
    url,
    params,
    method: 'delete',
    urlType: type
  })
}

export function getLoginModules(
  RequestType,
  SessionID,
  ProdCode,
  ModuleName,
  CommandName,
  CommandWay,
  SQLParam
) {
  return {
    RequestType: RequestType,
    SessionID: SessionID,
    ModuleName: ModuleName,
    CommandName: CommandName,
    CommandWay: CommandWay,
    ProdCode: ProdCode,
    IsWeb: 1,
    SQLParam: SQLParam
  }
}

export function getModules(
  SessionID,
  CustGuid,
  ProdCode,
  AccountNo,
  ModuleName,
  MethodName,
  CommandType,
  CommandText,
  SQLParam,
  PageSize,
  PageIndex,
  PagingMode,
  DataSetNums
) {
  let ParamList = {}
  ParamList.SessionID = SessionID
  ParamList.CustGuid = CustGuid
  ParamList.ProdCode = ProdCode
  if (AccountNo != '') {
    ParamList.AccountNo = AccountNo
  }
  ParamList.ModuleName = ModuleName
  ParamList.MethodName = MethodName
  if (CommandType > 0) {
    ParamList.CommandType = CommandType
  }
  if (CommandText != '') {
    ParamList.CommandText = CommandText
  }
  ParamList.OtherParam = SQLParam
  if (PageSize > 0) {
    ParamList.PageSize = PageSize
    ParamList.PageIndex = PageIndex
  }
  if (PagingMode != '') {
    ParamList.PagingMode = PagingMode
  }
  if (DataSetNums > 0) {
    ParamList.DataSetNums = DataSetNums
  }
  return ParamList
}
