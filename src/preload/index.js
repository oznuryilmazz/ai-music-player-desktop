import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {}

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
