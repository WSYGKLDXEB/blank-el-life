'use strict'
import { app, protocol, BrowserWindow, ipcMain, dialog, screen } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

let win
let contents

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 711,
    height: 400,
    resizable: false, // 禁止用户调整窗口大小
    // transparent: true,
    // backgroundColor: '#00000000', // 设置登录页圆角
    // minWidth: 1200,
    // minHeight: 675,
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

  win.show()
  contents = win.webContents
  const electron = require('electron')
  /* 获取electron窗体的菜单栏 */
  const Menu = electron.Menu
  /* 隐藏electron创听的菜单栏 */
  Menu.setApplicationMenu(null)

  // 设置窗口等比缩放
  win.setAspectRatio(16 / 9)
  console.log(win.getBounds())
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
    console.log(newBounds)
  })
  // -------------------------------------------------
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
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
        // console.log(e.response)
        if (e.response === 1) {
          win.close()
        }
      })
    // win.close()
  }
})
// 窗口放大
ipcMain.on('expand-app', () => {
  // contents.send('isExpand', win.isNormal())
  if (win.isNormal()) {
    return win.maximize()
  }
  win.unmaximize()
})
// 窗口最小化
ipcMain.on('min-app', () => {
  win.minimize()
})
// 窗口是否可变换大小
ipcMain.on('resizable-app', (e, bol) => {
  console.log('变换', win.isResizable(), bol)
  if (bol) {
    return win.setResizable(bol)
  }
  const resizable = win.isResizable()
  console.log('变换后', win.isResizable())
  win.setResizable(!resizable)
  console.log('变换后', win.isResizable())
})
// 设置窗口大小
ipcMain.on('resize-app', () => {
  // 设置窗口等比缩放
  win.setAspectRatio(16 / 9)
  console.log('大小', win.isResizable())
  if (win.isResizable()) {
    // 设置窗口等比缩放
    win.setAspectRatio(16 / 9)
    win.setSize(711, 400)
    return
  }

  const bounds = win.getBounds()
  const desktop = screen.getPrimaryDisplay()
  // console.log(desktop.bounds.width - bounds.width, desktop.bounds.height - bounds.height)
  bounds.x = Math.floor((desktop.bounds.width - 1200) / 2)
  bounds.y = Math.floor((desktop.bounds.height - 675) / 2)
  bounds.width = 1200
  bounds.height = 675
  win.setMaximumSize(1200, 675)
  // win.setSize(1200, 675)
  win.setBounds(bounds)
  // console.log(win.getBounds(), screen.getPrimaryDisplay())
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
  createWindow()
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
