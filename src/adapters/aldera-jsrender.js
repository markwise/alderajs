aldera.config.set('template.compile', function (html) {
    var compiled = $.templates(html),
        render = $.proxy(compiled.render, compiled);
    
    return render;
});

