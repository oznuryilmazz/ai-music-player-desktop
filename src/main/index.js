import { app, BrowserWindow, session } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import { supabase } from '../renderer/services/supabase/client'
import AutoLaunch from 'auto-launch'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()

    mainWindow.webContents.openDevTools()
  })

  if (is.dev && import.meta.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(import.meta.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setTokenToCookie(token) {
  session.defaultSession.cookies
    .set({
      url: 'https://zuisuhuepvqscswcocqi.supabase.co',
      name: 'supabase-auth-token',
      value: token,
      path: '/',
      httpOnly: true,
      secure: true
    })
    .then(() => {
      console.log('Token successfully set to cookie')
    })
    .catch((error) => {
      console.error('Failed to set token to cookie:', error)
    })
}

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    console.log('User signed in:', session)
    setTokenToCookie(session.access_token)
  } else {
    console.log('User signed out')
    session.defaultSession.cookies.remove(
      'https://zuisuhuepvqscswcocqi.supabase.co',
      'supabase-auth-token'
    )
  }
})

const appAutoLauncher = new AutoLaunch({
  name: 'AI Music Player',
  path: process.execPath
})

appAutoLauncher
  .isEnabled()
  .then((isEnabled) => {
    if (!isEnabled) {
      appAutoLauncher.enable()
    }
  })
  .catch((error) => {
    console.error('Failed to enable auto-launch:', error)
  })

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.example.aimusicplayer')

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
