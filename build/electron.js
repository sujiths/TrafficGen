const isDev = false // require('electron-is-dev');
const  path = require('path');
const {app, BrowserWindow} = require('electron')      

let win;

function createWindow () {   
  // Create the browser window.     
win = new BrowserWindow({width: 1366, height: 768, title: "Traffic Generator"}) 

console.log(`${path.join(__dirname, '../build/index.html')}`);

// and load the index.html of the app.
win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);    
}      

let pythonProcess = null;

const startPythonServer = () => {
    pythonProcess = require('child_process').spawn('python', [path.join(app.getAppPath(), '..', 'pyserver/Main.py')]);
    pythonProcess.stdout.on('data',function(data){
	    console.log("data: ",data.toString('utf8'));
	    });
}

const stopPythonServer = () => {
    if(pythonProcess != null)
        pythonProcess.kill();
    pythonProcess = null;   
}

app.on('ready', startPythonServer)
app.on('will-quit', stopPythonServer)

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit();
});
