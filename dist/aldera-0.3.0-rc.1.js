/*
 * Build Date: Tuesday, February 16th, 2016, 12:13:17 PM
 *
 * aldera.js v0.3.0-rc.1
 * https://github.com/markwise/alderajs
 *
 * Copyright (c) 2016 Mark Wise, contributers
 * Released under the terms of the MIT license
 */

var aldera = (function ($) {
    // jshint -W034
    'use strict';
    
    //
    // Why is the jQuery dollar sign being set to undefined?
    //
    // The dollar sign is being used as an internal convention for root level
    // variable names. Although using the dollar sign for jQuery would work as 
    // expected, it becomes confusing using it in two different contexts. Use 
    // the more explicit jQuery to reference jQuery.
    //
    
    // jshint -W020
    $ = void 0;
    
    
    // An absolute or virtual path that is used for ajax requests and resolving
    // template paths.
    var $root = (jQuery('html').attr('data-root') || '/')
        // Replace backslashes from windows paths with forward slashes
        .replace(/\\/g, '/')
        // Add a trailing slash if it doesn't exist
        .replace(/([^\/])$/, '$1/');
    
    
    // Template cache
    var $templates = {};
    
    
    //
    // iz 
    // Provides a slightly less verbose way to test common object types.
    //
    
    var $isString = function (obj) {
        return typeof obj === 'string';
    };
    
    var $isNumber = function (obj) {
        return typeof obj === 'number';
    };
    
    var $isObject = function (obj) {
        return {}.toString.call(obj) === '[object Object]';
    };
    
    var $isArray = function (obj) {
        return Array.isArray(obj);
    };
    
    var $isFunction = function (obj) {
        return typeof obj === 'function';
    };


    var $next = (function () {
            
        //
        // A curried function storing the function queue, the current index of the
        // next function to be called and the functions context. The function 
        // referenced by the next parameter is returned.
        //
        // @param {array} q
        //      The function queue.
        //
        // @param {number} index
        //      The next index in q.
        //
        // @param {object} context
        //      The functions context.
        //
        // @returns {function}
        //
        
        var next = function (q, index, context) {
            return function () {
                var fn = q[index],
                    args = [].slice.call(arguments);
                
                if (index < q.length - 1) {
                    args.push(next(q, index += 1, context));
                }
                
                fn.apply(context, args);
            };
        };
        
        
        //
        // A function queue that is controlled by calling each functions next
        // parameter. The next parameter is the last parameter and will be defined 
        // if there is another function in the queue to call.
        //
        // @param {array} q
        //      The function queue.
        //
        // @param {object} opts
        //      Options object passed as first argument to first function in queue.
        //
        
        return function (q, opts) {
            if (q.length === 0) return;
            next(q, 0, this)(opts);
        };
    }());
    


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
        $next.call(this, this.init, opts);
    };


    //
    //
    //
    
    var $view = (function () {
    
       
        //
        // @public
        //
        
        var mixin = function (name, opts) {
            var fn = aldera.mixin(name);
            
            if (fn) {
                fn.call(this, $isObject(opts) ? opts : {});
            }
        };
        
        
        ////////////////////////////////////////////////////////////////////////
        // Event API
        ////////////////////////////////////////////////////////////////////////
        
        //
        // @private
        // parseSignature
        //
        // Returns a signature object parsed from a signature string used to add
        // and remove events.
        //
        // @param {string} signature
        //      An event signature containing an event(s) and optional selector(s).
        //
        // @returns {object}
        //      A signature object.
        //
        
        var parseSignature = function (signature) {
            signature = signature.split(/\s+/);
        
            return {
                events: signature[0].split('|'),
                targets: (signature[1] || '').split('|')
            };
        };
        
        
        //
        // @public
        // enableEvents
        //
        // Enables all view events.
        //
    
        var enableEvents = function () {
            this._eventsDisabled = false;
            this.addEvents(this._events);
        };
        
        
        //
        // @public
        // disableEvents
        //
        // Disables all view events. Events can still be added and removed from
        // the events hash when events are disabled. They will be bound (added)
        // and not bound (removed) when enabledEvents is called.
        //
        
        var disableEvents = function () {
            this._eventsDisabled = true;
            this.el.off();
        };
        
        
        //
        // @public
        // removeEvent
        //
        // Removes view element or delegated events.
        //
        // @param {string} signature
        //      An event signature consisting of an event name and an optional
        //      selector separated by a space. If the selector is omitted, the 
        //      event will be removed from the view element. Multiple events and 
        //      multiple selectors can be removed in one event signature using a 
        //      pipe delimitter.
        //
        // ---------------------------------------------------------------------
        //
        // @example
        //      Remove an event from the view element
        //
        //      this.removeEvent('click');
        //
        // @example
        //      Remove multiple events from the view element
        //      
        //      this.removeEvent('mouseover|mouseout');
        //
        // @example
        //      Remove a delegated event from a selector
        //
        //      this.removeEvent('click .a');
        //
        // @example
        //      Remove multiple delegated events from a selector
        //
        //      this.removeEvent('mouseover|mouseout .a');
        //
        // @example
        //      Remove multiple delegated events from multiple selectors
        //
        //      this.removeEvent('mouseover|mouseout .a|.b|.c');
        //
        //
        // Signatures that are removed don't have to match the signature that
        // was added as long as the event is registered with a selector.
        //
        // @example
        //      this.addEvent('click|mouseover|mouseout .a|.b|.c', 'fn');
        //      this.removeEvent('click .b');
        //
        //      Removes the click event from selector .b
        //
        
        var removeEvent = function (signature) {
            var el = this.el,
                events = this._events;
            
            signature = parseSignature(signature);
            
            jQuery.each(signature.events, function (index, event) {
                jQuery.each(signature.targets, function (index, target) {
                    events[(event + ' ' + target).trim()] = void 0;
                    if (!self._eventsDisabled) el.off(event, target);
                });
            });
        };
        
        
        //
        // @public
        // removeEvents
        //
        // Removes a group of events. This method is a pass through to removeEvent.
        //
        // @param {array} signatures
        //      A group of event signatures.
        //
        // ---------------------------------------------------------------------
        //
        // @example
        //      Remove a group of events
        //
        //      this.removeEvents([
        //          'click',
        //          'click .a',
        //          'click .b|.c',
        //          'mouseover|mouseout .d|.e'
        //      ]);
        //
        
        var removeEvents = function (signatures) {
            var self = this;
            
            jQuery.each(signatures, function (index, signature) {
                self.removeEvent(signature);
            });
        };
        
        
        //
        // @public
        // addEvent
        //
        // Adds view element or delegated events.
        //
        // @param {string} signature
        //      An event signature consisting of an event name and an optional 
        //      selector separated by a space. If the selector is omitted, the 
        //      event will be registered on the view element. Multiple events 
        //      and multiple selectors can be added in one event signature using
        //      a pipe delimitter.
        //
        // @param {function|string} fn
        //      An event handler for the event. This can be a function or a
        //      string referencing the name of a view function.
        //
        // ---------------------------------------------------------------------
        //
        // @example
        //      Add an event on the view element
        //
        //      this.addEvent('click', 'fn');
        //
        //      or
        //
        //      this.addEvent('click', function () {});
        //
        // @example
        //      Add multiple events on the view element
        //      
        //      this.addEvent('mouseover|mouseout', 'fn');
        //
        // @example
        //      Delegate an event for a selector
        //
        //      this.addEvent('click .a', 'fn');        
        //
        // @example
        //      Delegate multiple events for a selector
        //      
        //      this.addEvent('mouseover|mouseout .a', 'fn');
        //
        // @example
        //      Delegate multiple events for multiple selectors
        //
        //      this.addEvent('mouseover|mouseout .a|.b|.c', 'fn');
        //
        
        var addEvent = function (signature, fn) {
            var self = this,
                el = this.el,
                events = this._events,
                proxy;
            
            if (fn === void 0) return;
            this.removeEvent(signature);
            signature = parseSignature(signature);
            if ($isString(fn)) fn = this[fn];
            proxy = jQuery.proxy(fn, self);
        
            jQuery.each(signature.events, function (index, event) {
                jQuery.each(signature.targets, function (index, target) {
                    events[(event + ' ' + target).trim()] = fn;
                    if (!self._eventsDisabled) el.on(event, target, proxy);
                });
            });
        };
        
        
        //
        // @public
        // addEvents
        //
        // Adds a group of events. This method is a pass through to addEvent.
        //
        // @param {object} events
        //      A group of events.
        //
        // ---------------------------------------------------------------------
        //
        // @example
        //      Add a group of events
        //
        //      this.addEvents({
        //          'click .a': 'fn1',
        //          'click .b|.c': 'fn2',
        //          'mouseover|mouseout .now|.how|.brown|.cow': function () {}'
        //      });
        //
        
        var addEvents = function (events) {
            var self = this;
            
            jQuery.each(events, function (signature, fn) {
                self.addEvent(signature, fn);
            });
        };
        
        
        ////////////////////////////////////////////////////////////////////////
        // Outlet API
        ////////////////////////////////////////////////////////////////////////
        
        //
        // @private
        // renderOutlet
        //
        // Renders a view outlet.
        //
        // @param {string} id
        //      An outlet id.
        //
        // @param {object} view
        //      A view instance.
        //
    
        var renderOutlet = function (id, view) {
            this.el.find('[data-outlet="' + id + '"]').replaceWith(view.el);
        };
    
        
        //
        // @private
        // renderOutlets
        //
        // Renders a view's outlets.
        //
        
        var renderOutlets = function () {
            var self = this;
        
            jQuery.each(self._outlets, function (id, view) {
                renderOutlet.call(self, id, view);
            });
        };
        
        
        //
        // @public
        // addOutlet
        //
        // Adds a single outlet entry.
        //
        // @param {string} id
        //      An outlet id.
        //
        // @param {object} view
        //      A view instance.
        //
    
        var addOutlet = function (id, view) {
            view.el.attr('data-outlet', id);
            this._outlets[id] = view;
        };
        
        
        //
        // @public
        // addOutlets
        //
        // Adds a group of outlet entries. 
        //
        // @param {object} outlets
        //      A group of outlet (id/view) entries.
        //
        
        var addOutlets = function (outlets) {
            var self = this;
        
            jQuery.each(outlets, function (id, view) {
                self.addOutlet(id, view);
            });
        };
        
        
        //
        // @public
        // replaceOutlet
        //
        // Replaces and renders an outlet entry.
        //
        // @param {string} id
        //      An outlet id.
        //
        // @param {object} view
        //      A view instance.
        //
        
        var replaceOutlet = function (id, view, fn, delay) {
            var self = this;
            
            self.addOutlet(id, view);
            renderOutlet.call(self, id, view);
            
            if (fn) {
                setTimeout(function () {
                    fn.call(self, self.el);
                }, delay || 50);
            }
        };
        
        
        //
        // @public
        // replaceOutlets
        //
        // Replaces and renders a group of outlet entries.
        //
        // @param {object} outlets
        //      A group of outlet id/view entries.
        //
        
        var replaceOutlets = function (outlets, fn, delay) {
            var self = this;
        
            jQuery.each(outlets, function (id, view) {
                self.replaceOutlet(id, view);
            });
            
            if (fn) {
                setTimeout(function () {
                    fn.call(self, self.el);
                }, delay || 50);
            }
        };
        
        
        ////////////////////////////////////////////////////////////////////////
        // Render API
        ////////////////////////////////////////////////////////////////////////
    
        //
        // @private
        // resolveTemplate
        //
        // Resolves a template by first looking for it in the global template
        // cache, otherwise it will be loaded and cached.
        //
        // @param {string} [name]
        //      An optional name of an alternate template to resolve. Name must
        //      have an entry in the template paths configuration object.
        //
        // @returns {object}
        //      Returns a jQuery promise
        //
        
        var resolveTemplate = function (name) {
            var templateName = name || this.defaultTemplateName,
                template = $templates[templateName],
                url;
            
            if (template === void 0) {
                url = aldera.config.get('template.paths.' + templateName);
                
                //Make sure a template has been defined
                if (url === void 0) {
                    throw new Error(templateName + ' is not a defined template path');
                }
                
                template = $templates[templateName] = $loadTemplate(url);
            }
            
            return template;
        };
        
        
        //
        // @public
        // render
        //
        // Renders a view template.
        //
        // @param {string} [name]
        //      An optional name of an alternate template to render. Name must
        //      have an entry in the template paths configuration object.
        //
        // @param {function} [fn]
        //      An optional render callback to be called based on an approximation
        //      of when the template has been rendered. The view element is
        //      passed as the sole argument to the callback as a convenience.
        //
        // @param {number} [delay]
        //      An optional value that overrides the default delay of 50ms.
        //
        
        var render = function (name, fn, delay) {
            var self = this;
            
            //Normalize parameters
            if ($isFunction(name)) {
                delay = fn;
                fn = name;
                name = void 0;
            }
        
            resolveTemplate.call(self, name).done(function (render) {
                var el = self.el;
                
                //We don't want to use jQuery's .html() method here because it
                //removes all data and events associated with the removed nodes.
                el[0].innerHTML = render({data: self.data.toJSON()});
                
                //Render view outlets
                renderOutlets.call(self);
                
                //Call optional render callback
                if (fn) {
                    setTimeout(function () {
                        fn.call(self, el);
                    }, delay || 50);
                }
            });
        };
    
    
        return function () {
            this.addEvent = addEvent;
            this.addEvents = addEvents;
            this.removeEvent = removeEvent;
            this.removeEvents = removeEvents;
            this.disableEvents = disableEvents;
            this.enableEvents = enableEvents;
            this.mixin = mixin;
            this.addOutlet = addOutlet;
            this.addOutlets = addOutlets;
            this.replaceOutlet = replaceOutlet;
            this.replaceOutlets = replaceOutlets;
            this.render = render;
        };
    }());


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
        
        // Mixin default view attributes
        $view.call(proto);
    
        return Fn;
    };


    var $View = function View(name, attrs) {
        this._name = name;
        this._Fn = $createViewConstructor(name, attrs);
    };
    
    (function () {
    
        this.create = function (config) {
            return new this._Fn($isObject(config) ? config : {});
        };
        
        this.remove = function () {
            aldera._views[this._name] = void 0;
        };
        
    }).call($View.prototype);
    


    var $Data = function Data(data) {
        this.reset(data);
    };
    
    (function () {
        
        var getValue = function (path) {
            var keys = path.split(/\./),
                lastIndex = keys.length - 1,
                data = this._data;
            
            jQuery.each(keys, function (i, key) {
                // Matches if key looks like an array
                var match = key.match(/^(\w+)((?:\[\d*\])+)$/),
                    indices;
                
                // Parse as array
                if (match) {
                    data = data[match[1]];
                    
                    if (!$isArray(data)) {
                        data = void 0;
                        // Break out of jQuery.each
                        return false;
                    }
                    
                    indices = match[2].match(/\[\d*\]/g);
                    
                    jQuery.each(indices, function (j, index) {
                        // null if brackets are empty, otherwise a string
                        index = index.match(/\d+/);
                        
                        if (index === null) {
                            if (indices.length - 1 > j || lastIndex > i) data = void 0;
                            // Break out of jQuery.each
                            return false;
                        }
                        
                        if ($isArray(data)) {
                            data = data[+index];
                        } else {
                            data = void 0;
                            // Break out of jQuery.each
                            return false;
                        }
                    });
                    
                    if (data === void 0) {
                        // Break out of jQuery.each
                        return false;
                    }
                
                // Parse as object
                } else {
                    if ($isObject(data)) {
                        data = data[key];
                    } else {
                        data = void 0;
                        // Break out of jQuery.each
                        return false;
                    }
                }
            });
            
            return data;
        };
       
        
        var getValues = function (paths) {
            var self = this,
                values = {};
            
            jQuery.each(paths, function (index, path) {
                values[path] = getValue.call(self, path);
            });
            
            return values;
        };
       
        
        var setValue = function (path, value) {
            var keys = path.split(/\./),
                data = this._data,
                dataIndex,
                dataKey;
            
            jQuery.each(keys, function (i, key) {
                var match = key.match(/^(\w+)((?:\[\d*\])+)$/),
                    indexes,
                    obj;
                
                if ($isArray(data)) {
                    if ($isNumber(dataIndex)) {
                        obj = data[dataIndex];
                        data = $isObject(obj) ? obj : data[dataIndex] = {}; 
                    } else {
                        data.push(data = {});
                    }
                }
                
                if (match) {
                    dataIndex = match[1];
                    indexes = match[2].match(/\[\d*\]/g);
                    
                    jQuery.each(indexes, function (j, index) {
                        var arr;
                        
                        index = index.match(/\d+/);
                        
                        if (dataIndex !== null) {
                            arr = data[dataIndex];
                            data = $isArray(arr) ? arr : data[dataIndex] = [];
                        } else {
                            data.push(data = []);
                        }
                        
                        dataIndex = index ? +index : index;
                    });
                    
                } else {
                    if (keys[i + 1] !== void 0) {
                        obj = data[key];
                        data = $isObject(obj) ? obj : data[key] = {};
                    }
                    
                    dataKey = key;
                }
            });
            
            if ($isArray(data)) {
                if ($isNumber(dataIndex)) {
                    data[dataIndex] = value;
                } else {
                    data.push(value);
                }
            } else {
                data[dataKey] = value;
            }
        };
       
       
        var setValues = function (paths) {
            var self = this;
        
            jQuery.each(paths, function (path, value) {
                setValue.call(self, path, value);
            });
        };
       
       
        this.get = function (path) {
            if ($isString(path)) {
                return getValue.call(this, path);
            } else
            if ($isArray(path)) {
                return getValues.call(this, path);
            }
        };
        
        
        this.set = function (path, value) {
            if ($isString(path)) {
                setValue.call(this, path, value);
            } else
            if ($isObject(path)) {
                setValues.call(this, path);
            }
        };
        
        
        this.reset = function (data) {
            this._data = {};
            if ($isObject(data)) this.set(data);
        };
    
        
        this.toString = function () {
            return JSON.stringify(this._data);
        };
    
        
        this.toJSON = function () {
            return JSON.parse(this.toString());
        };
        
    }).call($Data.prototype);
    


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
        
        
        this.compileTemplates = function (fn) {
            var paths = aldera.config.get('template.paths'),
                templates = [];
    
            jQuery.each(paths, function (key, path) {
                var template;
                
                if (!$templates[key]) {
                    template = $loadTemplate(path);
                    templates.push(template);
                    $templates[key] = template;
                }
            });
    
            jQuery.when.apply(jQuery, templates).done(function () {
                if (fn) fn();
            });
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
        this.root = $root;
        this.version = '0.3.0-rc.1';
    
    }).call($App.prototype);
    


    return new $App();
}($));