import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('electronAPI', {
  runBossAutoDeliver: () => ipcRenderer.invoke('run-boss-auto-deliver'),
})
