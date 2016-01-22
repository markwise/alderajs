//
// @constructor
// $ViewType
//

var $ViewType = function ViewType(name, attrs) {
    this.$$View = $createViewConstructor(name, attrs);
};
    
(function () {

    //
    // create
    //

    this.create = function (config) {
        return new this.$$View($isObject(config) ? config : {});
    };
    
}).call($ViewType.prototype);