export default class testSocketService{

    static instance = null
    static get Instance(){
        if(!this.instance){
            this.instance = new testSocketService()
        }
        return this.instance
    }

    //和服务端连接的socket对象
    ws = null

    //存储回调函数
    callBackMapping = {}
    //标识是否连接成功
    connected = false
    //记录重试发送的次数
    sendRetryCount = 0
    //记录重连次数
    connectRetryCount = 0

    // 定义连接服务器的方法
    connect (clientId) {
        console.log('thfbjknkjhkj',clientId);
        if(!window.WebSocket){
            return console.log('你的浏览器不支持websocket');
        }
        this.ws = new WebSocket('ws://localhost:9999',clientId)
        this.ws.onopen = () => {
            console.log('连接服务端成功了...');
            this.connected = true
            this.connectRetryCount = 0
        }
        this.ws.onclose = () => {
            console.log('连接服务器失败');
            this.connected = false
            this.connectRetryCount++
            setTimeout(() => {
                this.connect()
            }, 500 * this.connectRetryCount);
        }
        this.ws.onmessage = msg => {
            console.log('从服务端获取到了数据test_socket',msg);
            //真正服务端发送过来的原始数据是在msg中的data字段
            // console.log(msg.data);
            const recvData = JSON.parse(msg.data)
            const socketType = recvData.socketType
            console.log('你是大V贾兵是大V开几把1',recvData.message);
            //判断回调函数是否存在
            if(this.callBackMapping[socketType]){
                const realData = recvData.message
                this.callBackMapping[socketType].call(this,realData)
            }
        }
        // 通信发生错误时触发
        this.ws.onerror = (evt) => {
            this.ws = new WebSocket('ws://localhost:9999',clientId)
            console.log('通信发生错误后重连成功了');
        }
    }
    //回调函数的注册
    registerCallBack(socketType,callBack){
        this.callBackMapping[socketType] = callBack
    }
    //取消某一个回调函数
    unRegisterCallBack(socketType){
        this.callBackMapping[socketType] = null
    }
    //定义一个发送数据的方法
    send(data){
        if(this.connected){  //判断此时此刻是否连接成功
            this.sendRetryCount = 0
            this.ws.send(JSON.stringify(data))
        }else{
            this.sendRetryCount++
            setTimeout(() => {
                this.send(data)
            }, this.sendRetryCount * 500);
        }
    }
}