const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
const fr = require('face-recognition');

const recognizer = fr.FaceRecognizer();

const testImage = fr.loadImage(path.join(__dirname, 'faces/kliment.jpg'));

recognizer.addFaces([testImage], 'kliment');
recognizer.addFaces([testImage], 'kliment2');
const modelState = recognizer.serialize();
console.log(' faces serialized -->', modelState);

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

ipcMain.on('image', (event, arg) => {
    // console.log(arg)  // prints "ping"
    // event.sender.send('asynchronous-reply', 'pong')

    fs.writeFile('./image.png', decodeBase64Image(arg).data, function (err) {
        if (err) throw err;
        try {
            const bestPrediction = recognizer.predictBest(fr.loadImage('./image.png'));
            console.log('best prediction -->', bestPrediction);
        } catch (ex) {
            console.error(ex);
        }
    });
});

ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg)  // prints "ping"
    event.returnValue = 'pong'
});



let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
