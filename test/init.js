$('html').attr('data-root', '/base/test/');
$('body').append('<i data-view="Test"></i>');

window.__karma__.start = (function (fn) {
    return function () {
        var args = [].slice.call(arguments);
    
        $(function () {
            aldera.compileTemplates(function () {
                fn.apply(null, args);
            });
        });
    };
}(window.__karma__.start));
