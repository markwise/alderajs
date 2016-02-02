var $App = function App() {
    var self = this;
    
    self.config = new $Data();
    self.data = new $Data();
    
    // Stores
    self._views = {};
    self._mixins = {};
    self._modules = {};
    self._fns = {};
    self._services = {};
    
    // Initialize default views
    jQuery(function () {
        jQuery('[data-view]').each(function () {
            var el = jQuery(this),
                name = el.attr('data-view'),
                
                // If config is not defined, it's set to an empty string. This 
                // will be true if the optional data-config attribute doesn't 
                // exist. If it's defined, trim any whitespace so we know that 
                // config is an actual value.
                config = (el.attr('data-config') || '').trim(),
                view;
    
            if (config.length) {
                
                //Protect against malformed data that eval cannot parse
                try {
                    
                    // Why are we using eval here? Eval is needed to parse
                    // data-config and convert it into an object. We cannot
                    // use JSON.parse as data-config may be a reference to a 
                    // global variable that needs to be evaluated. JSON.parse 
                    // will also throw an error if the data it's trying to 
                    // parse is not valid JSON. This can and will most likely 
                    // be true if data is just being typed into data-config 
                    // or template data is being fed to it dynamically.
                    //
                    // JSON.parse and JSON.stringify are just an added level 
                    // of security to first convert the evaluated data into
                    // properly formatted JSON and then parse it back into a
                    // consumable object.
                    //
                    // The statement (1, eval)(...) executes eval in the 
                    // global scope. This allows eval to reference the value
                    // of data-config if it's a global variable.
                    // http://perfectionkills.com/global-eval-what-are-the-options/
                    
                    // jshint -W067
                    config = JSON.parse(JSON.stringify((1, eval)('(' + config + ')')));
                } catch(e) {
                    throw new Error('data-config for ' + name + ' is malformed');
                }
                
                //Config should be a view configuration object
                if (!$isObject(config)) {
                    throw new Error('data-config for ' + name + ' should be a view configuration object');
                }
            }
                            
            view = self.view(name);
            
            //Make sure the view is defined
            if (!view) {
                throw new Error(name + ' is not a defined view');
            }
            
            el.replaceWith(view.create(config).el);
        });
    });
};

(function () {

    var list = function (type) {
        return function () {
            var store = this['_' + type + 's'],
                a = [];
            
            jQuery.each(store, function (key, value) {
                if (value) a.push(key);
            });
            
            console.log(a.join(', '));
        };
    };
    
    
    var store = function (type) { 
        return function (name, fn) {
            var store = this['_' + type + 's'],
                val = store[name];
    
            if (fn) {
                if (val) {
                    console.warn('The ' + type + ' "' + name + '" is already defined. Use aldera.' + type + 's() to log all ' + type + 's.');
                } else {
                    if (type === 'view') {
                        store[name] = new $View(name, fn);
                    } else
                    if (type === 'service') {
                        store[name] = fn($root);
                    } else {
                        store[name] = fn();
                    }
                }
            
                //Return the application instance for chaining
                return this;
            } else {
                return val;
            }
        };
    };
    
    
    this.view = store('view');
    this.views = list('view');
    this.mixin = store('mixin');
    this.mixins = list('mixin');
    this.module = store('module');
    this.modules = list('module');
    this.fn = store('fn');
    this.fns = list('fn');
    this.service = store('service');
    this.services = list('service');
    this.version = '@version';

}).call($App.prototype);
