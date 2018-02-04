const {ipcRenderer} = require('electron');
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // prints "pong"
});

ipcRenderer.send('asynchronous-message', 'ping');

let player = document.querySelector('video');
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let handleSuccess = (stream) => {
    player.srcObject = stream;
    canvas.height = canvas.width * (player.offsetHeight / player.offsetWidth);
};

navigator.mediaDevices.getUserMedia({video: true})
    .then(handleSuccess);


setInterval(() => {
    ctx.drawImage(player, 0, 0, canvas.width, canvas.height);
    ipcRenderer.send('image', canvas.toDataURL());
}, 200);

module.exports = {
    a: 'test'
}