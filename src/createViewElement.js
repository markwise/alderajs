//
// $createViewElement
//

var $createViewElement = (function () {

    //
    // parseTypeSelector
    //
    // Tries to parses a CSS type selector from the selector parameter. Returns 
    // <div> if there is no match.
    //
    // @param {string} selector
    //      A CSS selector.
    //
    // @returns {string}
    //      Returns a type selector wrapped in <>.
    //

    var parseTypeSelector = function (selector) {
        var match = selector.match(/^\w+/);
        return '<' + (match ? match[0] : 'div') + '>';
    };


    //
    // parseClassSelector
    //
    // Tries to parses a CSS class selector from the selector parameter. Returns
    // undefined if there is no match.
    //
    // @param {string} selector
    //      A CSS selector.
    //
    // @returns {string}
    //      Returns a space separated list of class names.
    //

    var parseClassSelector = function (selector) {
        var match = selector.match(/\.[\w:-]+/g);
        return match ? match.join(' ').replace(/\./g, '') : void 0;
    };


    //
    // $createViewElement
    //
    // Creates and returns a jQuery wrapped HTML element.
    //
    // @param {string} selector
    //      A CSS selector containing an optional type selector and/or 
    //      class selector(s). Other selector types are ignored.
    //
    // @returns {object}
    //      A jQuery object is returned.
    //

    return function (selector) {
        if (!$isString(selector)) {
            selector = '';
        }
    
        return jQuery(parseTypeSelector(selector)).addClass(parseClassSelector(selector));
    };
}());