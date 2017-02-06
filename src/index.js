const mb = require('menubar')({
    dir: __dirname,
    showDockIcon: false,
});

mb.on('ready', function ready () {
  console.log('app is ready');
  // your app code here
  mb.setOption('width', 620);
  mb.setOption('minWidth', 570);
  mb.setOption('height', 525);
  mb.setOption('minHeight', 510);
  
  mb.setOption('tooltip', 'Zomnifer');  

})

