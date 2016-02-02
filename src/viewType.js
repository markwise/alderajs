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
