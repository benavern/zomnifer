window.$ = function(sel) {
    return document.querySelector(sel);
}

window.$$ = function(sel) {
    return [].slice.call(document.querySelectorAll(sel));
}


$$('header a').forEach(function(navLink) {
    navLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        navigate(navLink.getAttribute('href'));
    })

})


function hideAll() {
    $$('section.route.active').forEach(function(section) {
        section.classList.remove('active');
    })

    $$('header a.active').forEach(function(navLink) {
        navLink.classList.remove('active');
    })

}

function navigate(sel) {
    hideAll();
    $('section' + sel).classList.add('active');
    $('header a[href="' + sel + '"]').classList.add('active');

}

navigate('#off');


$$('section.route').forEach( function(section){
    // stopwatch
    section.querySelectorAll('.stopwatch .stopwatch--item').forEach(function(item) {
        var display  = item.querySelector('.display');
        var plus  = item.querySelector('.plus');
        var less  = item.querySelector('.less');
        var value = +display.innerText;

        plus.addEventListener('click', function(e) {
            e.preventDefault();
            value = (item.classList.contains('sec') && value >= 59) ? 0 : value + 1;
            display.innerText = (value >= 10) ? ""+value : "0"+value
        })

        less.addEventListener('click', function(e) {
            e.preventDefault();
            value = (value <= 0) ? 0 : value - 1;
            display.innerText = (value >= 10) ? ""+value : "0"+value
        })
    })

    // start / stop

    section.querySelectorAll('.btn-wrapper .btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var action = this.classList.contains('start') ? 'start' : 'stop';
            var value = section.querySelector('.stopwatch').innerText;
            value = value.split(':').map(function(x) {return +x})
            value = (60*value[0]+value[1])*1000;
            alert(action + ' in ' + value + 'ms');
        })
    })

})