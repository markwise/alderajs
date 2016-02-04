//
// Loads a view's template and compiles it into a render function that
// is passed to the resolved template promise.
//
// @param {string} url
//      The url of the template file to load. The url must exist in the
//      template paths configuration object.
//
// @returns {object}
//      Returns a jQuery promise.
//

var $loadTemplate = function (url) {
    var deferred = jQuery.Deferred();

    jQuery.get($root + url).done(function (html) {
        var compile = aldera.config.get('template.compile');
        deferred.resolve(compile(html));
    });
    
    return deferred.promise();
};
