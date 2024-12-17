import { post, getModules } from '@/https/requests'
import { getSessionID } from '@/https/token'
import store from '@/store/index'

export function BasicForm_Save(data) {
  const CustGuid = localStorage.getItem('CustGuid')
  const ProdCode = store.state.ProdCode
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Form',
    'BasicForm_Save',
    0,
    '',
    {},
    0,
    0,
    '',
    4
  )
  const url = '/' + ProdCode + '?module=' + JSON.stringify(eParam)
  return post(url, JSON.stringify(data))
}

export function FormType_Save(data) {
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Basic',
    'FormType_Save',
    0,
    '',
    {},
    0,
    0,
    '',
    1
  )
  const url = '/' + ProdCode + '?module=' + JSON.stringify(eParam)
  return post(url, JSON.stringify(data))
}

export function Apply_Save(data) {
  const ProdCode = store.state.ProdCode
  const CustGuid = localStorage.getItem('CustGuid')
  const SessionID = getSessionID()
  const eParam = getModules(
    SessionID,
    CustGuid,
    ProdCode,
    '',
    'DWork_Apply',
    'Apply_Save',
    0,
    '',
    {},
    0,
    0,
    '',
    5
  )
  const url = '/' + ProdCode + '?module=' + JSON.stringify(eParam)
  return post(url, JSON.stringify(data))
}

export default {
  BasicForm_Save,
  FormType_Save,
  Apply_Save
}
