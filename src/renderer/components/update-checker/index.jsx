import { useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material'

const { ipcRenderer } = window.electron

export default function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    ipcRenderer.on('update-available', () => {
      setUpdateAvailable(true)
    })

    return () => {
      ipcRenderer.removeAllListeners('update-available')
    }
  }, [])

  const handleCheckForUpdates = () => {
    ipcRenderer.send('check-for-updates')
  }

  return (
    <div>
      <Button variant="contained" onClick={handleCheckForUpdates}>
        Güncellemeleri Kontrol Etakjslkajdlkasjd
      </Button>
      <Dialog open={updateAvailable} onClose={() => setUpdateAvailable(false)}>
        <DialogTitle>Yeni Güncelleme Mevcut!</DialogTitle>
        <DialogActions>
          <Button onClick={() => setUpdateAvailable(false)}>İptal</Button>
          <Button onClick={() => ipcRenderer.send('update-download')}>Güncellemeyi İndir</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
