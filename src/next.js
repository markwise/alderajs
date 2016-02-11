var $next = (function () {
    
    //
    // A curried function storing the function queue and current index of the
    // next function to be called. The function referenced by the next parameter
    // for each function in q is returned.
    //
    // @param {array} q
    //      The function queue.
    //
    // @param {number} index
    //      The next index in q.
    //
    // @returns {function}
    //
    
    var next = function (q, index, context) {
        return function () {
            var fn = q[index] || function(){},
                args = [].slice.call(arguments);
            
            args.push(next(q, index += 1, context));
            fn.apply(context, args);
        };
    };
    
    
    //
    // Removes items from queue that are not functions.
    //
    // @param {array} q
    //      The function queue.
    //
    
    var clean = function (q) {
        var i = q.length;
        
        while (i--) {
            if (typeof q[i] !== 'function') {
                q.splice(i, 1);
            }
        }
    };
    
    
    //
    // $next(context, q [,arg])
    // A queue of functions called in order top down by calling each functions 
    // next parameter.
    //
    // @param {*} context
    //      The 'this' context to bind each function in q.
    //
    // @param {array} q
    //      The function queue.
    //
    // @param {*} [arg]
    //      Optional arguments passed to the first function in q.
    //
    // -------------------------------------------------------------------------
    //
    // $next(q [,arg])
    // A queue of functions called in order top down by calling each functions 
    // next argument.
    //
    // @param {array} q
    //      The function queue.
    //
    // @param {*} [arg]
    //      Optional arguments passed to the first function in q.
    //
    
    return function (context, q) {
        var args;
        
        //Normalize arguments to account for optional context
        if (Array.isArray(context)) {
            args = [].slice.call(arguments, 1);
            q = context;
            context = void 0;
        } else {
            args = [].slice.call(arguments, 2);
        }
        
        //q should be an array
        if (!Array.isArray(q)) return;
        
        //q should be an array of functions
        clean(q);
        
        //q should not be empty
        if (!q.length) return;
        
        //Call first function in queue
        next(q, 0, context).apply(null, args);
    };
}());
