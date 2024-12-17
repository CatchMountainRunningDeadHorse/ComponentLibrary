import { formatDate, oneMonthBefore } from '@/utils/util'
export default {
  Token: null,
  SessionID: '',
  networkSuccess: true, //是否断网
  // OBSInfo: {}, //ObsClient实例信息
  SearchInfo: {
    BeginDate: formatDate(oneMonthBefore(new Date())),
    EndDate: formatDate(new Date()),
    FlowID: 0,
    Index: 0,
    ApplyStatus: 1,
    pageSize: 20,
    currentPage: 1,
    KeyWords: ''
  },
  SearchOption: {
    BeginDate: formatDate(oneMonthBefore(new Date())),
    EndDate: formatDate(new Date()),
    FlowID: 0,
    Index: 0,
    ApplyStatus: 1,
    pageSize: 20,
    currentPage: 1,
    KeyWords: ''
  },
  ProdCode: '27',
  theme: 'chalk'
}
