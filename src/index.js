const {app, Menu, Tray, ipcMain: ipc, BrowserWindow } = require('electron');
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
  mb.setOption('icon', path.join(__dirname, '../Icon.png'));

  // yes you can quit the app too ...
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show Zomnifer',
      click: () => mb.showWindow()
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit Zomnifer',
      role: 'quit'
    },
  ]);
  mb.tray.setContextMenu(trayMenu);

})



/**
 * 
 * This is short but is what all the app has been done for! :)
 * 
 */

let messageWindow = null;

ipc.on('SHUTDOWN', () => exec(commands.shutdown, log));
ipc.on('SLEEP'   , () => exec(commands.sleep, log));
ipc.on('RESTART' , () => exec(commands.restart, log));
ipc.on('MESSAGE' , (e, mess) => {
  messageWindow = new BrowserWindow({
    width: 400, 
    height: 300,
  })

  console.log('[MESSAGE]', mess);
  messageWindow.setMenu(null);
  messageWindow.loadURL(`file://${ __dirname }/message.html?message=${ encodeURIComponent(mess) }`)
  messageWindow.on('closed', () => {
    messageWindow = null
  })
});

function log(err, stdout, stderr) {
  if(err) {
    console.log('[ERROR]', err);
    return;
  }
  console.log('[STDOUT]', stdout);
  console.log('[STDERR]', stderr);
}
