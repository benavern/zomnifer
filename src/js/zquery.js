module.exports = {
    $:  function(sel) {
        return document.querySelector(sel);
    },
    $$: function(sel) {
        return [].slice.call(document.querySelectorAll(sel));
    }
}