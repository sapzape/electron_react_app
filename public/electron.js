const { app, BrowserWindow } = require('electron')
const webdriver = require('selenium-webdriver')
const chromedriver = require('chromedriver')

const path = require('path')
const isDev = require('electron-is-dev')

app.commandLine.appendSwitch('remote-debugging-port', '8315')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1460,
        height: 840,
        webPreferences: { nodeIntegration: true, webviewTag: true }
    })

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }
    chromedriver.start()
    
    const driver = new webdriver.Builder()
    // The "9515" is the port opened by chrome driver.
    .usingServer('http://localhost:9515')
    .withCapabilities({
      chromeOptions: {
        // connect to the served electron DevTools
        debuggerAddress: 'localhost:8315',
        windowTypes: ['webview'],
      },
    })
    .forBrowser('electron')
    .build()

    mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})