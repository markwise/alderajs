//
// $store
//
// An $App mixin that creates a key value store for each of the five
// application storage types that include: views, mixins, modules, fns and 
// services. Note, that $store is specific to $App and is not designed to be 
// a generic storage utility.
//
// Two methods are created as a result of calling $store. One that adds and
// retrieves a value from a store, and one that logs a stores keys to the
// console.
//
// Once a key has been added to a store, the key becomes immutable. If an
// attempt is made to change a key's value, a warning will be logged to
// the console.
//

var $store = (function () {

    //
    // list
    //
    // Logs a comma separated list of store keys to the console. 
    //
    // @param {object} obj
    //      One of the five application storage types.
    //
    
    var list = function (obj) {
        console.log(Object.keys(obj).join(', '));
    };
    
    
    //
    // store
    //
    // Adds a new entry to the store if not defined. If an entry with the 
    // the same name is defined, it's not overwritten, but a warning is 
    // logged to the console.
    //
    // @param {string} name
    //      The entries name.
    //
    // @param {(object|function)} attrs
    //      
    //
    // @returns {object}
    //      The application instance is returned for chaining.
    //
    // ---------------------------------------------------------------------
    //
    // store
    //
    // Returns the entries value or undefined.
    //
    // @param {string} name
    //      The entries name.
    //
    // @returns {(object|undefined)}
    // 
    
    var store = function (obj, type, name, fn) {
        var val = obj[name];
    
        if (fn) {
            if (val) {
                console.warn('The ' + type + ' "' + name + '" is already defined. Use aldera.' + type + 's() to log all ' + type + 's.');
            } else {
                if (type === 'view') {
                    obj[name] = new $ViewType(name, fn);
                } else {
                    obj[name] = fn($root);
                }
            }
            
            //Return the application instance for chaining
            return this;
        } else {
            return val;
        }
    };

    
    //
    // @param {string} type
    //      The name of the hash type to create.
    //
    
    return function (type) {
        var obj = {};
        
        this[type] = function (name, fn) {
            return store.call(this, obj, type, name, fn);
        };
        
        this[type + 's'] = function () {
            list(obj);
        };
    };
}());