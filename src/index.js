const {app, Menu, Tray} = require('electron');
const path = require('path');

const mb = require('menubar')({
    dir: __dirname,
    transparent: true,
    title: "Zomnifer",
    icon: path.join(__dirname, '../Icon.png')
});

var trayMenuTemplate =[
  {
    label: 'Quit Zomnifer',
    role: 'quit'
  }
]

mb.on('ready', function ready () {
  console.log([
    '\n======================\n',
    ' Welcome to Zomnifer!',
    '\n======================\n'
  ].join(''));

  // your app code here
  mb.setOption('width', 490);
  mb.setOption('height', 360);

  mb.setOption('minWidth', 490);
  mb.setOption('minHeight', 360);
  
  mb.setOption('tooltip', 'Zomnifer');
  mb.setOption('showDowkIcon', false);
  mb.setOption('icon', path.join(__dirname, '../Icon.png'))

  var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);

  mb.tray.setContextMenu(trayMenu);



})

