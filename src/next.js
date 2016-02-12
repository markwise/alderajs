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
