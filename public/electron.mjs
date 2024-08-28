import{ app, ipcMain, BrowserWindow, dialog } from 'electron'; // electron
import path from 'node:path';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import isDev from 'electron-is-dev'; // To check if electron is in development mode

import Store from 'electron-store';

const store = new Store();

let audioDir = store.get('audioDir') ? store.get('audioDir') : '/'
let configLocation =''
let mediaFileArray=[]
let mainWindow;
// Initializing the Electron Window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600, // width of window
    height: 600, // height of window
    webPreferences: {
      webSecurity: false, // Required for loading sounds, comment out if not using sounds
      // The preload file where we will perform our app communication
      preload: path.join(app.getAppPath(), './public/preload.js'),//isDev 
        // ? path.join(app.getAppPath(), './public/preload.js') // Loading it from the public folder for dev
        // : path.join(app.getAppPath(), './build/preload.js'), // Loading it from the build folder for production
      worldSafeExecuteJavaScript: true, // If you're using Electron 12+, this should be enabled by default and does not need to be added here.
      contextIsolation: true, // Isolating context so our app is not exposed to random javascript executions making it safer.
    },
  });

	// Loading a webpage inside the electron window we just created
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000' // Loading localhost if dev mode
      : `file://${path.join(__dirname, '../build/index.html')}` // Loading build file if in production
  );

	// Setting Window Icon - Asset file needs to be in the public/images folder.
  // mainWindow.setIcon(path.join(__dirname, 'favicon.ico'));

	// In development mode, if the window has loaded, then load the dev tools.
  if (isDev) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  }

};



// When the app is ready to load
app.whenReady().then(async (event) => {



  ipcMain.on('quit-app',(args_=>{
    app.quit();
  }))

  ipcMain.on('config-dir-set',(args_=>{
    audioDir = dialog.showOpenDialogSync({ properties: ['openDirectory']})
  }))

ipcMain.on('load-config',(event, arg)=>{
  let dataObj = JSON.parse(readFileSync(dialog.showOpenDialogSync({ 
    properties: ['openFile']
  })[0], 'utf8'));

  if(dataObj){
    audioDir = dataObj.audioDirectory
    configLocation = dataObj.configFileLocation
  }

  mediaFileArray = readdirSync(audioDir).map(fileName => {
    return path.join(audioDir, fileName);
  });

  let dirContents = readdirSync(audioDir).filter((item)=>(item.includes('.mp3'))).map((item)=>{ return ('file://' + audioDir + "/" + item) });
  event.sender.send('media-array-recieve', dirContents)
})

ipcMain.on('save-config',(args)=>{
  configLocation = dialog.showOpenDialogSync({ properties: ['openDirectory']})
  writeFileSync(`${configLocation}/config.JSON`, `{
    "audioDirectory": "${audioDir}",
    "configFileLocation": "${configLocation}",
    "displayMode":"dev"
  }`, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
    })
  }); 

ipcMain.on('request-audio', (event, arg)=>{
  let dirContents = readdirSync(audioDir).filter((item)=>(item.includes('.mp3'))).map((item)=>{ return ('file://' + audioDir + "/" + item) });
  event.sender.send('media-array-recieve', dirContents)
})

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
  console.log(mainWindow)
  if (!mainWindow) {
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