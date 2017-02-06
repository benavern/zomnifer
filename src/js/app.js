window.$ = function(sel) {
    return document.querySelector(sel);
}

window.$$ = function(sel) {
    return [].slice.call(document.querySelectorAll(sel));
}

/**
 * Timer functionnality
 */
var Timer = (function() {
    // value with separated values
    var _value = {
        minutes : 0,
        seconds: 0
    }
    // computed value in seconds
    var _computedValue = 0;
    // used for the setInterval 
    var _timer = null;

    // the timer elements 
    var elements = {
        minutes : {
            plus : $('.stopwatch .stopwatch--item.min .plus'),
            less: $('.stopwatch .stopwatch--item.min .less'),
            display: $('.stopwatch .stopwatch--item.min .display')
        },
        seconds : {
            plus : $('.stopwatch .stopwatch--item.sec .plus'),
            less: $('.stopwatch .stopwatch--item.sec .less'),
            display: $('.stopwatch .stopwatch--item.sec .display')
        },
    }

    /**
     * Calculate the computed value of the updated _value
     * display the new value on the timer element
     */
    var _compute = function() {
        _computedValue = _value.seconds + (60 * _value.minutes);
        elements.minutes.display.innerText = (_value.minutes >= 10) ? ""+_value.minutes : "0"+_value.minutes;
        elements.seconds.display.innerText = (_value.seconds >= 10) ? ""+_value.seconds : "0"+_value.seconds;
        console.log('[COUNT]', _value, _computedValue)
    }

    return {
        // getters & setters
        setSeconds : function(x) {
            _value.seconds = x;
            _compute();
            return this;
        },

        setMinutes : function(x) {
            _value.minutes = x;
            _compute();
        },
        
        getValue : function(computed) {
            return (!!computed) ? _computedValue : _value;
        },

        getSeconds : function() {
            return _value.seconds;
        },

        getMinutes : function() {
            return _value.minutes;
        },

        // increment & decrement methods
        decrementSeconds: function() {
            var appTimer = this;
            if(_value.seconds <= 0 && _value.minutes > 0) {
                appTimer.setMinutes(_value.minutes - 1);
                appTimer.setSeconds(59);
            }
            else {
                appTimer.setSeconds((_value.seconds <= 0) ? 0 : _value.seconds - 1);
            }
        },

        incrementSeconds: function() {
            var appTimer = this;
            if(_value.seconds >= 59) {
                appTimer.setMinutes(_value.minutes + 1);
                appTimer.setSeconds(0);
            }
            else {
                appTimer.setSeconds(_value.seconds + 1);
            }
        },
        
        decrementMinutes: function() {
            var appTimer = this;
            appTimer.setMinutes((_value.minutes <= 0 ) ? 0 : _value.minutes - 1);
        },

        incrementMinutes: function() {
            var appTimer = this;
            appTimer.setMinutes(_value.minutes + 1);
        },

        // start timer and call stop + callback when finished
        start : function(callback) {
            var appTimer = this;
            _timer = setInterval(function() {

                if(_computedValue > 0) {
                    console.log('[TIME LEFT]', _computedValue);
                    appTimer.decrementSeconds.call(appTimer);
                }
                else {
                    appTimer.stop();
                    console.log('[END OF TIME]', _computedValue);
                    callback();
                }
            }, 1000);
            return this;
        },

        // stop timer
        stop : function() {
            clearInterval(_timer);
            return this;
        },

        // init timer with the buttons listeners
        init : function() {
            var appTimer = this;
            elements.minutes.plus.addEventListener('click', appTimer.incrementMinutes.bind(appTimer));
            elements.minutes.less.addEventListener('click', appTimer.decrementMinutes.bind(appTimer));
            elements.seconds.plus.addEventListener('click', appTimer.incrementSeconds.bind(appTimer));
            elements.seconds.less.addEventListener('click', appTimer.decrementSeconds.bind(appTimer));

            return this;
        }
    }
})();


/**
 * General behavior of the application
 * 
 */
var Zomnifer = (function() {

    // 3 different actions
    var _actions = {
        '#off': {
            title: 'Switch off',
            action: function() {
                alert('SWITCH OFF');
            }
        },
        '#sleep': {
            title: 'Sleep',
            action: function() {
                alert('SLEEP');
            }
        },
        '#message': {
            title: 'Message',
            message: '',
            action: function() {
                alert(this.message);
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
        _actions['#message'].message = _textArea.value;
        console.log('[MESSAGE]', _actions['#message'].message);
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
            _textArea.setAttribute('readonly', true);
            $$('header a:not(.active)').forEach(function(navLink) {
                navLink.style.display = 'none';
            })
            _timer.start(function() {
                _actions[_activeState].action()
                app.stop();
            });
        },

        /**
         * Stop timer
         */
        stop: function() {
            _textArea.setAttribute('readonly', false);
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

            // message update
            _textArea.addEventListener('input', _updateMessage);

            // init timer
            _timer = Timer.init();

            // init app
            this.navigate('#welcome');

        }
    }
})();

Zomnifer.init();