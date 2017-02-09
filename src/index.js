const {app, Menu, Tray, ipcMain: ipc } = require('electron');
const path = require('path');
const exec = require('child_process').exec;
const commands = require('./commands/' + process.platform);


const mb = require('menubar')({
    dir: __dirname,
    transparent: true,
    title: "Zomnifer",
    icon: path.join(__dirname, '../Icon.png')
});


/**
 * The app is ready, I just set some things here so that it feels more Zomniferified
 */
mb.on('ready', function ready () {
  console.log([
    '\n======================\n',
    ' Welcome to Zomnifer!',
    '\n======================\n'
  ].join(''));

  // window size & decoration
  mb.setOption('width', 500);
  mb.setOption('height', 330);

  mb.setOption('minWidth', 500);
  mb.setOption('minHeight', 330);
  
  mb.setOption('tooltip', 'Zomnifer');
  mb.setOption('showDowkIcon', false);
  mb.setOption('icon', path.join(__dirname, '../Icon.png'))

  // yes you can quit the app too ...
  var trayMenu = Menu.buildFromTemplate([{label: 'Quit Zomnifer', role: 'quit'}]);
  mb.tray.setContextMenu(trayMenu);

})



/**
 * 
 * This is short but this is what all the app has been done for! :)
 * 
 */
ipc.on('SHUTDOWN', exec.bind(this, commands.shutdown));
ipc.on('SLEEP'   , exec.bind(this, commands.sleep));