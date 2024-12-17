const mutations = {
  Token(state, tokenJson) {
    state.Token = tokenJson
  },
  SessionID(state, sessionID) {
    state.SessionID = sessionID
  },
  changeNetworkSuccess(state, val) {
    //改变状态
    state.networkSuccess = val
  },
  // setOBSInfo(state, val) {
  //   state.OBSInfo = val
  // },
  setSearchInfo(state, val) {
    console.log('1111111111111111111', val)
    state.SearchInfo.BeginDate = val.BeginDate || state.SearchOption.BeginDate
    state.SearchInfo.EndDate = val.EndDate || state.SearchOption.EndDate
    state.SearchInfo.FlowID = val.FlowID || state.SearchOption.FlowID
    state.SearchInfo.Index = val.Index || state.SearchOption.Index
    state.SearchInfo.pageSize = val.pageSize || state.SearchOption.pageSize
    state.SearchInfo.currentPage = val.currentPage || state.SearchOption.currentPage
    state.SearchInfo.KeyWords = val.KeyWords || state.SearchOption.KeyWords
    state.SearchInfo.ApplyStatus = val.ApplyStatus || state.SearchOption.ApplyStatus
  },
  changeTheme(state) {
    if (state.theme === 'chalk') {
      state.theme = 'vintage'
    } else {
      state.theme = 'chalk'
    }
  }
}

export default mutations
