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
    var _value = {
        minutes : 0,
        seconds: 0
    }

    var _computedValue = 0;
    var _timer = null;

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

 
    var _compute = function() {
        _computedValue = _value.seconds + (60 * _value.minutes);
        elements.minutes.display.innerText = (_value.minutes >= 10) ? ""+_value.minutes : "0"+_value.minutes;
        elements.seconds.display.innerText = (_value.seconds >= 10) ? ""+_value.seconds : "0"+_value.seconds;
        console.log(_value, _computedValue)
    }

    return {
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

        decrement: function() {
            var appTimer = this;
            if(_value.seconds <= 0 && _value.minutes > 0) {
                appTimer.setMinutes(_value.minutes - 1);
                appTimer.setSeconds(59);
            }
            else {
                appTimer.setSeconds((_value.seconds <= 0) ? 0 : _value.seconds - 1);
            }
        },

        start : function() {
            var appTimer = this;
            _timer = setInterval(appTimer.decrement.bind(appTimer), 1000);
            return this;
        },

        stop : function() {
            clearInterval(_timer);
            return this;
        },

        init : function() {
            var appTimer = this;
            elements.minutes.plus.addEventListener('click', function(e) {
                e.preventDefault();
                appTimer.setMinutes(_value.minutes + 1);
            })
            elements.minutes.less.addEventListener('click', function(e) {
                e.preventDefault();
                appTimer.setMinutes((_value.minutes <= 0 ) ? 0 : _value.minutes - 1);
            })
            elements.seconds.plus.addEventListener('click', function(e) {
                e.preventDefault();
                if(_value.seconds >= 59) {
                    appTimer.setMinutes(_value.minutes + 1);
                    appTimer.setSeconds(0);
                }
                else {
                    appTimer.setSeconds(_value.seconds + 1);
                }
            })
            elements.seconds.less.addEventListener('click', function(e) {
                e.preventDefault();
                if(_value.seconds <= 0 && _value.minutes > 0) {
                    appTimer.setMinutes(_value.minutes - 1);
                    appTimer.setSeconds(59);
                }
                else {
                    appTimer.setSeconds((_value.seconds <= 0) ? 0 : _value.seconds - 1);
                }
            })

            return this;
        }
    }
})();


/**
 * General behavior of the application
 * 
 */
var Zomnifer = (function() {

    var _actions = {
        '#off': {
            title: 'Switch off'
        },
        '#sleep': {
            title: 'Sleep'
        },
        '#message': {
            title: 'Message'
        }
    }

    var _timer = null;

    var _textArea = $('section#app textarea');

    var activeState = null;
    var isCounting = false;


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

    return {
    /**
     * Show a specific section & activate corresponding menu item
     */
        navigate : function(sel) {
            if(!isCounting) {
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

        start: function() {
            isCounting = true;
            _timer.start();
        },

        stop: function() {
            isCounting = false;            
            _timer.stop()
        },

    

        /**
         * Initialises the app
         */
        init : function() {
            var app = this;

            // router
            $$('header a').forEach(function(navLink) {
                navLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    app.navigate(navLink.getAttribute('href'));
                })
            })

            $('.btn-wrapper .btn.start').addEventListener('click', app.start)
            $('.btn-wrapper .btn.stop').addEventListener('click', app.stop)

            this.navigate('#welcome');

            _timer = Timer.init();
        }
    }
})();

Zomnifer.init();