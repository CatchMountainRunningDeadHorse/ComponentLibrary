const CONFIG = {
    //请求路径
    API_URL:import.meta.env.MODE =='development' ? '/api' : import.meta.env.RENDERER_VUE_APP_API_BASEURL,
    //Aes 秘钥
    AES_KEY:'bGvnMc62sh5RV6zP',
    //Aes 偏移量
    AES_OFF:"1eZ43DLcYtV2xb3Y",
    //cookie过期时间
    EXPIRES_TIME:24 * 60 * 60 * 1000,
    //admin权限信息
    PERMISSIONS:"*:*:*",
    //网页title
    APP_TITLE:import.meta.env.RENDERER_VUE_APP_TITLE,
    //国际化
    LANG:[
        {name:'中文',value:'zh-cn'},
        {name:'英文',value:'en'}    
    ]
}
export default CONFIG;