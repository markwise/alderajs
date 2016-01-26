//
// $fn
//
// Creates and returns a dynamically named wrapper function.
//
// @param {string} name
//      The function's name.
//
// @param {function} fn
//      The function to call when the wrapper function is called.
//
// @returns {function}
//      The wrapper function is returned.
//

var $fn = function (name, fn) {
    // jshint -W054
    return new Function('fn', [
        'var f = function ', name, '() { fn.apply(this, [].slice.call(arguments)) };',
    
        // As of IE11, the name property is not supported on functions and must
        // be manually set. This property is read-only in supported browsers and
        // will throw an error trying to set it. Name is always undefined in IE 
        // unless it has been set to a different value and a string value in 
        // supported browsers.
        'if (f.name === void 0) f.name = "', name, '";',
        'return f;'
    ].join(''))(fn);
};