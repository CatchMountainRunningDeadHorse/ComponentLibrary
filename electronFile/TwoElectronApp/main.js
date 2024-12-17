const {app,BrowserWindow,ipcMain } = require('electron')
const path = require('path');

function createWindow(){
    let mainWin = new BrowserWindow({
        x:100,   //窗口在屏幕x轴方向的起始位置
        y:100,   //窗口在屏幕y轴方向的起始位置
        show:false,  //默认情况下创建一个窗口对象之后就会显示，设置false之后，就不会显示了
        width:600,
        height:400,
        // maxHeight:600,
        // maxWidth:1000,
        // minHeight:200,
        // minWidth:300,
        // resizable:false,// 固定应用尺寸，不允许自由缩放
        // icon:'logo.ico',//图标，写图片的路径
        // frame:false,  //用于自定义menu，设置为false可以将默认的菜单栏隐藏
        // transparent:true,//设置窗体为透明
        // autoHideMenuBar:true,
        // title:'',//自定义当前应用的显示标题
        webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, // 启用 Node.js 集成
            contextIsolation:true, // 允许访问 require
        }
    })
    mainWin.loadFile('index.html')
    mainWin.on('ready-to-show',()=>{
        mainWin.show()
    })

    mainWin.on('closed',()=>{
        console.log('mainWin is closed');
        mainWin = null
    })
}

let newWindow;
// 打开新窗口
ipcMain.on('open-new-window', () => {
    if (!newWindow) {  // 检查是否已经存在一个窗口实例
        newWindow = new BrowserWindow({
        width: 400,
        height: 300,
        show:false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true, // 启用 Node.js 集成

        }
        });
    
        newWindow.loadFile('list.html');
        newWindow.on('ready-to-show',()=>{
            newWindow.show()
        })
        newWindow.on('closed',()=>{
            console.log('newWindow is closed');
            newWindow = null
        })
    }
});

//当app启动之后，执行窗口创建等操作
app.whenReady().then(createWindow)

app.on('window-all-closed',()=>{
    console.log('all window is closed');
    if (process.platform !== 'darwin') app.quit();
})
