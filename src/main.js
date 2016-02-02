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
    
    var $isBoolean = function (obj) {
        return typeof obj === 'boolean';
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


    // @scripts


    return new $App();
}($));