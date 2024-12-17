//图形验证码
export interface IimageCode{
    key:String
}
//用户登录
export interface IloginByJson{
    password: String;
    username: String;
    key: String;
    captcha: String;
}

//登录动态验证码
export interface IloginCaptcha{
    mobile: String;
}

//手机验证码登录
export interface IloginByMobile{
    mobile: String;
    captcha: String;
}





