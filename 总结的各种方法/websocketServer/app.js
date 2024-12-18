const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (client) => {
    console.log('有客户端连接成功了');
    client.on('message', msg => {
        const jsonString = msg.toString('utf8'); // 将Buffer转换为字符串
        const jsonObject = JSON.parse(jsonString); // 将字符串转换为JSON对象

        console.log('客户端发送数据给服务端了', jsonObject);
    })

    setInterval(() => {
        const timestamp = new Date().getTime()
        const data = {
            // data: {
                "command": "data_report",
                "timestamp": timestamp, // 时间戳，精确到毫秒
                "data": {
                    "gps_alt": 0, //高程
                    "gps_lat": 31.776161, //纬度
                    "gps_lon": 117.3473662, //经度
                    "heading": 0, //朝向（与正北方向夹角，顺时针）
                    "gps_status": "1",// gps状态（gps在04、05、4B状态时为正常，其它状态为异常）：0-异常，1-正常
                    "velocity": 0 //速度
                }
            // }
        }
        client.send(JSON.stringify(data))
    }, 2000)
})