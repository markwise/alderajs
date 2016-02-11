var $initialize = function (config) {
    var opts = $isObject(config.opts) ? config.opts : {};
    
    this._events = {};
    this._outlets = {};
    
    this.el = $createViewElement(config.aspect || this.aspect)
        .addClass(this.defaultTemplateName)
        .attr('data-view', this.constructor.name);
    
    this.data = new $Data(config.data);
    this.addEvents(this.events);
    this.addOutlets(config.outlets || {});
    $next(this, this.init, opts);
};