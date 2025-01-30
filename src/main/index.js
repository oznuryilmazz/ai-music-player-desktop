import { app, BrowserWindow, ipcMain, session } from 'electron'
import path, { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import { supabase } from '../renderer/services/supabase/client'
import AutoLaunch from 'auto-launch'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import fs from 'fs'
import axios from 'axios'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = true

const musicCachePath = path.join(app.getPath('userData'), 'music_cache')
const jsonPath = path.join(musicCachePath, 'music_timeline.json')

if (!fs.existsSync(musicCachePath)) {
  fs.mkdirSync(musicCachePath, { recursive: true })
}

function checkForUpdates() {
  console.log('🔍 Güncellemeler kontrol ediliyor...')
  autoUpdater
    .checkForUpdates()
    .then((updateInfo) => {
      console.log('✅ Güncelleme bilgisi:', updateInfo)
    })
    .catch((error) => {
      console.error('❌ Güncelleme kontrolü sırasında hata:', error)
    })
}

autoUpdater.on('update-available', (info) => {
  console.log('🆕 Yeni güncelleme bulundu:', info.version)
  const mainWindow = BrowserWindow.getAllWindows()[0]
  mainWindow.webContents.send('update-available', info)
})

autoUpdater.on('update-not-available', () => {
  console.log('✅ Güncel sürüm kullanıyorsunuz, yeni güncelleme yok.')
})

autoUpdater.on('error', (error) => {
  console.error('❌ Güncelleme hatası:', error)
})

autoUpdater.on('update-downloaded', async () => {
  console.log('✅ Güncelleme indirildi, kullanıcıya bildirim gönderildi.')

  const mainWindow = BrowserWindow.getAllWindows()[0]

  setImmediate(async () => {
    const response = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Güncelleme Mevcut',
      message: 'Yeni bir güncelleme indirildi. Şimdi yüklemek ister misiniz?',
      buttons: ['Evet', 'Hayır'],
      defaultId: 0,
      cancelId: 1
    })

    if (response.response === 0) {
      console.log('🚀 Güncelleme yükleniyor...')
      autoUpdater.quitAndInstall()
    } else {
      console.log('❌ Kullanıcı güncellemeyi yüklemeyi reddetti.')
    }
  })
})

ipcMain.on('check-for-updates', () => {
  checkForUpdates()
})

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

    // mainWindow.webContents.openDevTools()
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

  checkForUpdates()

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.handle('download-song', async (event, song) => {
  const filePath = path.join(musicCachePath, `${song.id}.mp3`)

  // Eğer şarkı zaten varsa, indirme
  if (fs.existsSync(filePath)) {
    console.log(`Şarkı zaten var: ${filePath}`)
    return filePath
  }

  console.log(`Şarkı indiriliyor: ${song.url}`)

  try {
    const response = await axios({
      method: 'GET',
      url: song.url,
      responseType: 'stream'
    })

    const writer = fs.createWriteStream(filePath)
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath))
      writer.on('error', reject)
    })
  } catch (error) {
    console.error(`Şarkı indirilemedi: ${song.name}`, error)
    return null
  }
})

ipcMain.handle('save-timeline', async (event, timeline) => {
  fs.writeFileSync(jsonPath, JSON.stringify(timeline, null, 2), 'utf-8')
})

ipcMain.handle('load-timeline', async () => {
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  }
  return []
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
