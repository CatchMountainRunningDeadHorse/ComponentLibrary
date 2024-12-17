import { get, getModules } from '@/https/requests'
import { getSessionID } from '@/https/token'
import store from '@/store/index'

export function getFormList() {
  const params = {}
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Form',
    'BasicForm_GetData',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function getCheckData(data) {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const params = {
    CheckMan: UserInfo.UserID,
    FlowID: data.FlowID,
    ApplyStatus: data.ApplyStatus,
    BeginDate: data.BeginDate || '2024-01-01',
    EndDate: data.EndDate || '2024-04-26',
    Index: data.Index || 0,
    KeyWords: data.KeyWords
  }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_GetMyCheckData',
    0,
    '',
    params,
    data.pageSize,
    data.currentPage,
    'AUTO',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function Apply_GetBasicInfo(data) {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const params = {
    UserID: UserInfo.UserID,
    FlowID: data.FlowID
  }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_GetBasicInfo',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function BasicForm_HisData() {
  const params = {}
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Form',
    'BasicForm_HisData',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function getMyApplyData(data) {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const params = {
    ApplyMan: UserInfo.UserID,
    IsAll: data.IsAll,
    FlowID: data.FlowID,
    ApplyStatus: data.ApplyStatus,
    BeginDate: data.BeginDate,
    EndDate: data.EndDate,
    KeyWords: data.KeyWords
  }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_GetMyApplyData',
    0,
    '',
    params,
    data.pageSize,
    data.currentPage,
    'AUTO',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function getSendApplyData(data) {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const params = {
    SendMan: UserInfo.UserID,
    FlowID: data.FlowID,
    ApplyStatus: data.ApplyStatus,
    BeginDate: data.BeginDate,
    EndDate: data.EndDate,
    KeyWords: data.KeyWords
  }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_GetSendApplyData',
    0,
    '',
    params,
    data.pageSize,
    data.currentPage,
    'AUTO',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function getFlowType() {
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Basic',
    'FormType_GetData',
    0,
    '',
    {},
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function getBasicFormData(data) {
  const params = {
    FlowID: data.FlowID
  }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Form',
    'GetBasicFormByID',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function Apply_GetApplyDetail(data) {
  const params = {
    FlowID: data.FlowID,
    ApplyID: data.ApplyID
  }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_GetApplyDetail',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}
export function GetOBSInfo() {
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'SystemFile',
    'GetOBSInfo',
    0,
    '',
    {},
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function BasicForm_IsBan(data) {
  const params = { FlowID: data.FlowID, IsStop: data.IsStop }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Form',
    'BasicForm_IsBan',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export function BasicForm_Delete(data) {
  const params = { FlowID: data.FlowID }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Form',
    'BasicForm_Delete',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//流程审批 催审
export function NoticeCheck_PushMsg(data) {
  const CustGuid = localStorage.getItem('CustGuid')
  const params = {
    FlowID: data.FlowID,
    ApplyID: data.ApplyID,
    CustGuid: CustGuid,
    PushManJson: data.PushManJson
  }
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'NoticeCheck_PushMsg',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//流程审批 申请单撤回
export function Apply_CancelCheck(data) {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const params = {
    FlowID: data.FlowID,
    ApplyID: data.ApplyID,
    ApplyMan: UserInfo.UserID,
    ApplyStatus: 4 //撤回
  }
  const CustGuid = localStorage.getItem('CustGuid')
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_CancelCheck',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//流程审批 删除
export function Apply_Delete(data) {
  const params = {
    ApplyID: data.ApplyID
  }
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_Delete',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//已通过后撤回
export function Apply_CancelPassCheck(data) {
  const CustGuid = localStorage.getItem('CustGuid')
  const UserInfo = localStorage.getItem('UserInfo')
  const params = {
    FlowID: data.FlowID,
    ApplyID: data.ApplyID,
    ApplyMan: UserInfo.UserID,
    ApplyStatus: 5, //已通过撤回中
    CustGuid: CustGuid
  }
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_CancelPassCheck',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//登录
export function User_Login(data) {
  const params = {
    UserNo: data.account,
    PassWord: data.pass
  }
  const CustGuid = localStorage.getItem('CustGuid') || ''
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_UserInfo',
    'User_Login',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//获取用户签名信息
export function UserSign_GetData() {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const CustGuid = localStorage.getItem('CustGuid')
  const params = {
    UserID: UserInfo.UserID,
    CustGuid: CustGuid
  }
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_User',
    'UserSign_GetData',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//获取客户用户信息列表
export function UserInfo_GetData() {
  const CustGuid = localStorage.getItem('CustGuid')
  const params = {
    CustGuid: CustGuid
  }
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Form',
    'UserInfo_GetData',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//流程审批 通过/驳回
export function Apply_DoCancelPassFlow(data) {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const CustGuid = localStorage.getItem('CustGuid')
  const params = {
    FlowID: data.FlowID,
    ApplyID: data.ApplyID,
    CheckResult: data.CheckResult,
    CheckManID: UserInfo.UserID,
    CustGuid: CustGuid.toLocaleUpperCase()
  }
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_DoCancelPassFlow',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//流程审批 同意/拒绝
export function Apply_DoCheckFlow(data) {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const CustGuid = localStorage.getItem('CustGuid')
  const params = {
    FlowID: data.FlowID,
    ApplyID: data.ApplyID,
    CheckFlowID: data.CheckFlowID,
    CheckLevel: data.CheckLevel,
    CheckResult: data.CheckResult,
    CheckDetail: data.CheckDetail,
    CheckManID: UserInfo.UserID,
    CustGuid: CustGuid.toLocaleUpperCase(),
    CheckSignID: data.CheckSignID
  }
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_DoCheckFlow',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//流程审批 转交
export function Apply_TakeOverFlow(data) {
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
  const CustGuid = localStorage.getItem('CustGuid')
  const params = {
    ApplyID: data.ApplyID,
    CheckFlowID: data.CheckFlowID,
    CheckLevel: data.CheckLevel,
    CheckMan: UserInfo.UserID,
    TakeOverMan: data.TakeOverMan,
    CustGuid: CustGuid
  }
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_TakeOverFlow',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//生成登录Code
export function WebLogin_CodeGenerator() {
  const CustGuid = localStorage.getItem('CustGuid')
  const ProdCode = store.state.ProdCode
  const params = {
    SystemID: 1,
    ProdID: 1
  }
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_WebLogin',
    'WebLogin_CodeGenerator',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//根据Code获取登录状态
export function WebLogin_GetCodeStatus(data) {
  const params = {
    Code: data.Code
  }
  const CustGuid = localStorage.getItem('CustGuid')
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_WebLogin',
    'WebLogin_GetCodeStatus',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//刷新二维码状态
export function WebLogin_UpdateCodeStatus(data) {
  const params = {
    Status: data.Status,
    Code: data.Code
  }
  const CustGuid = localStorage.getItem('CustGuid')
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_WebLogin',
    'WebLogin_UpdateCodeStatus',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//导出PDF文件
export function GeneratePdf(data) {
  const CustGuid = localStorage.getItem('CustGuid')
  const params = {
    FlowID: data.FlowID,
    ApplyID: data.ApplyID,
    CustGuid: CustGuid
  }
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'PdfExport',
    'GeneratePdf',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

//获取登录人的团队信息
export function Custom_GetByProdID(data) {
  const params = {
    UserID: data.UserID,
    ProdID: data.ProdID
  }
  const CustGuid = localStorage.getItem('CustGuid') || ''
  const ProdCode = 'MainDB'
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_UserInfo',
    'Custom_GetByProdID',
    0,
    '',
    params,
    0,
    0,
    '',
    0
  )
  return get('/' + ProdCode + '/', { module: JSON.stringify(eParam) })
}

export default {
  getFormList,
  getCheckData,
  Apply_GetBasicInfo,
  BasicForm_HisData,
  getMyApplyData,
  getSendApplyData,
  getFlowType,
  getBasicFormData,
  Apply_GetApplyDetail,
  GetOBSInfo,
  BasicForm_IsBan,
  NoticeCheck_PushMsg,
  Apply_CancelCheck,
  Apply_Delete,
  Apply_CancelPassCheck,
  User_Login,
  UserSign_GetData,
  UserInfo_GetData,
  Apply_DoCancelPassFlow,
  Apply_DoCheckFlow,
  WebLogin_CodeGenerator,
  WebLogin_GetCodeStatus,
  WebLogin_UpdateCodeStatus,
  Apply_TakeOverFlow,
  GeneratePdf,
  Custom_GetByProdID
}
