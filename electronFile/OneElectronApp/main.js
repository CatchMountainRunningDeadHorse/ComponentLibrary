const {app,BrowserWindow} = require('electron')

function createWindow(){
    let mainWin = new BrowserWindow({
        width:600,
        height:400
    })
    
    mainWin.loadFile('index.html')

    mainWin.webContents.on('did-finish-load',()=>{
        console.log('33333------>did-finish-load');
        
    })

    mainWin.webContents.on('dom-ready',()=>{
        console.log('22222------>dom-ready');
        
    })

    mainWin.on('close',()=>{
        console.log('88888----->close~~~~~~');
        mainWin = null
    })
}

//当app启动之后，执行窗口创建等操作
app.on('ready',()=>{
    console.log('11111----->ready');
    createWindow()
})

// app.whenReady().then(()=>{
//     createWindow()
// })

app.on('window-all-closed',()=>{
    console.log('44444------>window-all-closed');
    app.quit()
})

app.on('before-quit',()=>{
    console.log('55555------>before-quit');
})
app.on('will-quit',()=>{
    console.log('66666------>will-quit');
})
app.on('quit',()=>{
    console.log('77777------>quit');
})