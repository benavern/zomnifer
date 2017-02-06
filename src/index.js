const mb = require('menubar')({
    dir: __dirname,
    showDockIcon: false,
});

mb.on('ready', function ready () {
  console.log('app is ready');
  // your app code here
  mb.setOption('width', 610);
  mb.setOption('minWidth', 550);
  mb.setOption('height', 460);
  mb.setOption('minHeight', 400);
  
  mb.setOption('tooltip', 'Zomnifer');  

})

