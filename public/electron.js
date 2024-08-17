const { app, ipcMain, BrowserWindow, dialog } = require('electron'); // electron
const path = require('node:path');
const { writeFileSync, readFileSync } = require('node:fs');


// const isDev = require('electron-is-dev'); // To check if electron is in development mode

let mainWindow;
// Initializing the Electron Window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600, // width of window
    height: 600, // height of window
    webPreferences: {
      // The preload file where we will perform our app communication
      preload: path.join(app.getAppPath(), './public/preload.js'),//isDev 
        // ? path.join(app.getAppPath(), './public/preload.js') // Loading it from the public folder for dev
        // : path.join(app.getAppPath(), './build/preload.js'), // Loading it from the build folder for production
      worldSafeExecuteJavaScript: true, // If you're using Electron 12+, this should be enabled by default and does not need to be added here.
      contextIsolation: true, // Isolating context so our app is not exposed to random javascript executions making it safer.
    },
  });

	// Loading a webpage inside the electron window we just created
  mainWindow.loadURL('http://localhost:3000'
    // isDev
    //   ? 'http://localhost:3000' // Loading localhost if dev mode
    //   : `file://${path.join(__dirname, '../build/index.html')}` // Loading build file if in production
  );

	// Setting Window Icon - Asset file needs to be in the public/images folder.
  // mainWindow.setIcon(path.join(__dirname, 'favicon.ico'));

	// In development mode, if the window has loaded, then load the dev tools.
//   if (isDev) {
//     mainWindow.webContents.on('did-frame-finish-load', () => {
//       mainWindow.webContents.openDevTools({ mode: 'detach' });
//     });
//   }
};

let audioDir =''
let configLocation =''

// When the app is ready to load
app.whenReady().then(async () => {
ipcMain.on('quit-app',(args_=>{
  app.quit();
}))
ipcMain.on('config-dir-set',(args_=>{
 audioDir = dialog.showOpenDialogSync({ properties: ['openDirectory']})
}))
ipcMain.on('load-config',(args)=>{
  let temp = dialog.showOpenDialogSync({ 
    properties: ['openFile']
  })[0]
  readFileSync( temp, (err, data) => {
    if (err) throw err;
    console.log(`test ${data}`);
  }); 
})
ipcMain.on('save-config',(args)=>{
  configLocation = dialog.showOpenDialogSync({ properties: ['openDirectory']})
  writeFileSync(`${configLocation}/config.JSON`, `{
    audioDirectory: '${audioDir}',
    configFileLocation: '${configLocation}'
  }`, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  })
  }); 

  await createWindow(); // Create the mainWindow
})


// Exiting the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activating the app
app.on('activate', () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on('uncaughtException', (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});