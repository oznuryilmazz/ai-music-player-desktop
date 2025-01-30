import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  downloadSong: (song) => ipcRenderer.invoke('download-song', song),
  saveTimeline: (timeline) => ipcRenderer.invoke('save-timeline', timeline),
  loadTimeline: () => ipcRenderer.invoke('load-timeline')
}

if (import.meta.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
