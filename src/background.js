'use strict'
import { app, protocol, BrowserWindow, ipcMain, dialog, screen } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import slash from 'slash'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
// protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true, stream: true } }])
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

let win
let login
let contents
let identity // 身份 => token
const isFullScreen = false // 记录视频是否全屏
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    width: 1200,
    height: 675,
    // resizable: false, // 禁止用户调整窗口大小
    // transparent: true,
    // backgroundColor: '#00000000', // 设置登录页圆角
    minWidth: 1200,
    minHeight: 675,
    // maxWidth: 1200,
    // maxHeight: 675,
    // fullscreen: true, 600// 全屏窗口 =>如果设置了width、heigh、x、y,系统会忽略这些属性，仍然是全屏显示
    webPreferences: {
      webSecurity: false, // 实现跨域
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    },
    frame: false
  })

  protocol.interceptFileProtocol(
    'file',
    (req, callback) => {
      const url = req.url.substr(8)
      callback(slash(decodeURI(url)))
    },
    (error) => {
      if (error) {
        console.error('Failed to register protocol')
      }
    }
  )
  // win.show()
  contents = win.webContents
  const electron = require('electron')
  /* 获取electron窗体的菜单栏 */
  const Menu = electron.Menu
  /* 隐藏electron创听的菜单栏 */
  Menu.setApplicationMenu(null)

  // 设置窗口等比缩放
  win.setAspectRatio(16 / 9)
  // console.log(win.getBounds())
  // -------------------------------------------------
  // 发送身份
  win.once('ready-to-show', () => {
    contents.send('identity', identity)
    win.show()
  })

  // -------------------------------------------------
  // 窗口最大化时触发
  win.on('maximize', () => {
    contents.send('isExpand', win.isNormal())
  })
  // 当窗口从最大化状态退出时触发
  win.on('unmaximize', () => {
    contents.send('isExpand', win.isNormal())
  })
  // 调整窗口大小前触发
  win.on('will-resize', (e, newBounds) => {
    console.log('will-resize', newBounds)
  })
  win.on('resize', (e, newBounds) => {
    console.log('resize', newBounds)
  })
  // -------------------------------------------------
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/exhibit')
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html#/exhibit')
    // win.loadFile('./index.html', {
    //   hash: 'exhibit'
    // })
    // win.webContents.openDevTools()
  }
}

// 登录框
async function createLogin() {
  login = new BrowserWindow({
    show: false,
    width: 711,
    height: 400,
    resizable: false, // 禁止用户调整窗口大小
    // transparent: true,
    // backgroundColor: '#00000000', // 设置登录页圆角
    // fullscreen: true, 600// 全屏窗口 =>如果设置了width、heigh、x、y,系统会忽略这些属性，仍然是全屏显示
    webPreferences: {
      webSecurity: false, // 实现跨域
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    },
    frame: false
  })
  // login.show()
  const electron = require('electron')
  /* 获取electron窗体的菜单栏 */
  const Menu = electron.Menu
  /* 隐藏electron创听的菜单栏 */
  Menu.setApplicationMenu(null)
  contents = login.webContents
  // 设置窗口等比缩放
  login.setAspectRatio(16 / 9)
  // console.log(win.getBounds())
  // -------------------------------------------------
  login.once('ready-to-show', () => {
    login.show()
  })
  // -------------------------------------------------
  // -------------------------------------------------
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    console.log(process.env.WEBPACK_DEV_SERVER_URL)
    // Load the url of the dev server if in development mode
    await login.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/login')
    if (!process.env.IS_TEST) login.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    login.loadURL('app://./index.html#/login')
  }
}
// -------------------------------------------------
// 窗口自动居中显示
function bounds(obj) {
  const bounds = win.getBounds()
  // console.log(bounds)
  const desktop = screen.getPrimaryDisplay()
  bounds.x = Math.floor((desktop.bounds.width - bounds.width) / 2)
  bounds.y = Math.floor((desktop.bounds.height - bounds.height) / 2)
  // win.setMinimumSize(1200, 675)
  // win.setSize(1200, 675)

  obj.setBounds(bounds)
}
// -------------------------------------------------
// 关闭窗口
ipcMain.on('close-app', () => {
  if (win) {
    dialog
      .showMessageBox({
        message: '确定关闭窗口！',
        title: '关闭',
        buttons: ['取消', '确定'],
        type: 'info'
      })
      .then((e) => {
        if (e.response === 1) {
          win.close()
        }
      })
    // win.close()
  }
  if (login) {
    dialog
      .showMessageBox({
        message: '确定关闭窗口！',
        title: '关闭',
        buttons: ['取消', '确定'],
        type: 'info'
      })
      .then((e) => {
        if (e.response === 1) {
          login.close()
        }
      })
    // win.close()
  }
})
// 窗口放大
ipcMain.on('expand-app', () => {
  contents.send('isExpand', win.isNormal())
  if (win.isNormal()) {
    return win.maximize()
  }
  win.unmaximize()
})
// 窗口全屏
ipcMain.on('fullScreen-app', () => {
  contents.send('isFullScreen', win.isFullScreen())
  win.setFullScreen(!win.isFullScreen())
})
// 窗口最小化
ipcMain.on('min-app', () => {
  if (win) {
    win.minimize()
  }
  if (login) {
    login.minimize()
  }
})
// 窗口是否可变换大小
ipcMain.on('resizable-app', (e, bol) => {
  if (bol) {
    return win.setResizable(bol)
  }
  const resizable = win.isResizable()
  win.setResizable(!resizable)
})
// 设置窗口大小
ipcMain.on('resize-app', () => {
  // 设置窗口等比缩放
  win.setAspectRatio(16 / 9)
  if (win.isResizable()) {
    // 设置窗口等比缩放
    // win.setSize(1200, 675)
    // return
  }
})
// 创建登录框
ipcMain.on('login-app', () => {
  // if (win) {
  //   win.hide()
  // }

  // if (login) {
  //   return login.show()
  // }
  win.close()
  win = null
  createLogin()

  // bounds(login)
  login.setMaximumSize(711, 400)
  login.setMinimumSize(711, 400)
  login.setSize(711, 400)
})
// 创建主窗口
ipcMain.on('window-app', (e, obj) => {
  identity = obj
  // if (login) {
  //   login.hide()
  // }

  // if (win) {
  //   return win.show()
  // }
  login.close()
  login = null
  createWindow()
  bounds(win)
})
// -------------------------------------------------
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // createWindow()
  createLogin()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
