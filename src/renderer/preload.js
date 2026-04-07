const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vocalflow', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (s) => ipcRenderer.invoke('save-settings', s),
  getUsage: () => ipcRenderer.invoke('get-usage'),
  fetchGrokStatus: (key) => ipcRenderer.invoke('fetch-grok-status', key),
  fetchDeepgramModels: (key) => ipcRenderer.invoke('fetch-deepgram-models', key),
  fetchGrokModels: (key) => ipcRenderer.invoke('fetch-grok-models', key),
  sendAudioChunk: (buffer) => ipcRenderer.send('audio-chunk', buffer),
  
  // Safely wrap IPC event listeners by stripping the IpcRendererEvent
  // object so that the renderer process only gets the necessary arguments.
  onStartRecording: (cb) => ipcRenderer.on('start-recording', (_event, ...args) => cb(...args)),
  onStopRecording: (cb) => ipcRenderer.on('stop-recording', (_event, ...args) => cb(...args))
});
