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