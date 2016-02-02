$('html').attr('data-root', '/base/test/');
$('body').append('<i data-view="Test"></i>');

window.__karma__.start = (function (fn) {
    return function () {
        $(function () {
            fn.apply(null, [].slice.call(arguments));
        });
    };
}(window.__karma__.start));