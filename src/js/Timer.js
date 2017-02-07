var $ = require('./zquery').$;
var $$ = require('./zquery').$$;

/**
 * Timer functionnality
 */
module.exports = function() {
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
};