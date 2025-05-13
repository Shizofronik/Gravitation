//require - import module
const {app, BrowserWindow} = require('electron') 
const path = require('path')

const createWindow = () => {
    const window = new BrowserWindow({
        show: false,
        icon: path.join(__dirname, 'icon.png')
    })

    window.maximize()
    //Не забыть 
    //⁡⁢⁣⁡⁢⁣⁣window.setMenuBarVisibility(false)⁡
    window.loadFile('./src/index.html')
}

app.whenReady().then(() => createWindow())
app.on('window-all-closed', () => app.quit())