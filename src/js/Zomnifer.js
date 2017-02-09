var $ = require('./zquery').$;
var $$ = require('./zquery').$$;
var Timer = require('./Timer')();
var shell = window.require('electron').shell;
var ipc = window.require('electron').ipcRenderer;

/**
 * General behavior of the application
 * 
 */
module.exports = function() {
    var _message = '';
    // 3 different actions
    var _actions = {
        '#shutdown': {
            title: 'Switch off',
            action: ipc.send.bind(null, 'SHUTDOWN')
        },
        '#sleep': {
            title: 'Sleep',
            action: ipc.send.bind(null, 'SLEEP')
        },
        '#message': {
            title: 'Message',
            action: function() { // bind doesn't use the _message updated ...
                ipc.send('MESSAGE', _message)
            } 
        }
    }

    // timer shortcut
    var _timer = null;

    // textArea element used for the message action
    var _textArea = $('section#app textarea');

    // the action that will be fired
    var _activeState = null;

    // is the timer started ?
    var _isCounting = false;


    /** 
     * Hide the unnecessary sections & unactivate menu items
     */
    var _hideRoutes = function(sel) {
        if(sel == '#welcome') {
            $('section.route#welcome').classList.add('active');
            $('section.route#app').classList.remove('active');
        }
        else{
            $('section.route#welcome').classList.remove('active');
            $('section.route#app').classList.add('active');
        }

        $$('header a.active').forEach(function(navLink) {
            navLink.classList.remove('active');
        })

    }

    // update message on input tiped
    var _updateMessage = function()  {
        _message = _textArea.value;
        console.log('[MESSAGE]', _message);
    }

    return {
        /**
         * Show a specific section & activate corresponding menu item
         */
        navigate : function(sel) {
            if(!_isCounting) {
                _activeState = sel;
                _hideRoutes(sel);
                if(sel == '#welcome') {
                    $('section#welcome').classList.add('active');
                }
                else{
                    $('section#app').classList.add('active');
                    $('section#app h1').innerText = _actions[_activeState].title;

                }
                $('header a[href="' + sel + '"]').classList.add('active');

                _textArea.style.display = (_activeState == '#message') ? 'block' : 'none';
            }
            else {
                alert('You can\'t change mode when stopwatch is active');
            }
        },

        /**
         * Start timer
         */
        start: function() {
            var app = this;
            _isCounting = true;
            _textArea.readOnly =  true;
            $$('header a:not(.active)').forEach(function(navLink) {
                navLink.style.display = 'none';
            })
            _timer.start(function() {
                try {
                    _actions[_activeState].action();
                }
                catch(e) {
                    console.log('[ERROR]', e);
                }
                app.stop();
            });
        },

        /**
         * Stop timer
         */
        stop: function() {
            _textArea.readOnly =  false;
            $$('header a:not(.active)').forEach(function(navLink) {
                navLink.style.display = 'inline-block';
            })
            _isCounting = false;
            _timer.stop()
        },

    

        /**
         * Initialises the app
         */
        init : function() {
            var app = this;

            // init router
            $$('header a').forEach(function(navLink) {
                navLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    app.navigate(navLink.getAttribute('href'));
                })
            })

            // start / stop
            $('.btn-wrapper .btn.start').addEventListener('click', app.start.bind(app));
            $('.btn-wrapper .btn.stop').addEventListener('click', app.stop.bind(app));

            // external links
            $$('a[href^="http"]').forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    shell.openExternal(link.href);
                });
            });

            // message update
            _textArea.addEventListener('input', _updateMessage);

            // init timer
            _timer = Timer.init();

            // init app
            this.navigate('#shutdown');

        }
    }
};