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