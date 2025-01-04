import { app, BrowserWindow, session } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import { supabase } from '../renderer/services/supabase/client'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (is.dev && import.meta.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(import.meta.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Token'ı Çerezlere Setle
function setTokenToCookie(token) {
  session.defaultSession.cookies
    .set({
      url: 'https://zuisuhuepvqscswcocqi.supabase.co', // Supabase URL'nizi yazın
      name: 'supabase-auth-token',
      value: token,
      path: '/',
      httpOnly: true, // Tarayıcıda erişilemez yapar (isteğe bağlı)
      secure: true // HTTPS gerektirir
    })
    .then(() => {
      console.log('Token successfully set to cookie')
    })
    .catch((error) => {
      console.error('Failed to set token to cookie:', error)
    })
}

// Supabase Oturum Yönetimi
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

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

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
