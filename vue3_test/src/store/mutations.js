export default{
    setAuth(state,auth){
        state.hasAuth = auth
    },
    setUserRouters(state,userRouters){
        state.userRouters = userRouters
    },
    changeTheme(state){
      if(state.theme === 'chalk'){
        state.theme = 'vintage'
      }else{
        state.theme = 'chalk'
      }
    },
    setFullScreen(state,payLoad){
      state.isFullScreen = payLoad
    }
}