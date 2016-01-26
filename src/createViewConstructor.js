//
// $createViewConstructor
// Creates a view's constructor function.
//
// @param {string} name
//      The view constructor's name.
//
// @param {(object|function)} attrs
//      An object of attributes or a function that must return an object of
//      attributes used to extend the view's prototype.
// 
// @returns {function}
//      The view constructor is returned.     
//

var $createViewConstructor = function (name, attrs) {
    var Fn = $fn(name, $initialize),
        proto = Fn.prototype,
        init;
    
    if ($isFunction(attrs)) {
        attrs = attrs();
    }
    
    jQuery.extend(proto, attrs);
    proto.defaultTemplateName = name[0].toLowerCase() + name.substr(1);
    init = proto.init;
    
    // Add default init method that simply renders the view's template
    if (init === void 0) {
        init = function () {
            this.render();
        };
    }
    
    // Normalize init as an array
    if (!$isArray(init)) {
        proto.init = [init];
    }
    
    // Make sure an events object exists
    if(!proto.events) {
        proto.events = {};
    }
    
    // Mixin default view attributes
    $view.call(proto);

    return Fn;
};