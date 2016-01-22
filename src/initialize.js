//
// $initialize
//

var $initialize = function (config) {
    var opts = $isObject(config.opts) ? config.opts : {};
    
    this.el = $createViewElement(config.aspect || this.aspect)
        .addClass(this.defaultTemplateName)
        .attr('data-view', this.constructor.name);
    
    this.data = new $Data(config.data);
    this.addEvents(this.events);
    this.addOutlets(config.outlets || {});
    this.init[0].call(this, opts);
    //next(self.initialize, self, config.opts);
};