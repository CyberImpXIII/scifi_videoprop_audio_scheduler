const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Invoke Methods
  testInvoke: (args) => ipcRenderer.invoke('test-invoke', args),
  // Send Methods
  testSend: (args) => ipcRenderer.send('test-send', args),
  //quit app
  quitApp: (args)=> ipcRenderer.send('quit-app', args),
  // Receive Methods
  mediaArrayReceive: (callback) => ipcRenderer.on('media-array-recieve', (event, data) => { callback(data) }),
  dataObjectReceive: (callback) => ipcRenderer.on('data-object-recieve', (event, data) => { callback(data) }),
  configDirSet:(args)=> ipcRenderer.send('config-dir-set', args),
  loadConfig:(args)=>{ ipcRenderer.send('load-config', args) },
  saveConfig:(args)=>{ ipcRenderer.send('save-config', args) },
  requestAudio:(args)=>{ ipcRenderer.send('request-audio', args) }
});