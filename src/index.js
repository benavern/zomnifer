const mb = require('menubar')({
    dir: __dirname,
    showDockIcon: false,
});

mb.on('ready', function ready () {
  console.log('app is ready');
  // your app code here
})

