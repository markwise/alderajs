//
// @constructor
// $Data
//

var $Data = function Data(data) {
    this.reset(data);
};

(function () {
    
    var getValue = function (path) {
        var keys = path.split(/\./),
            data = this._data,
            dataIndex,
            dataKey,
            value;
        
        jQuery.each(keys, function (i, key) {
            var match = key.match(/^(\w+)((?:\[\d*\])+)$/),
                indexes,
                obj;
            
            if ($isArray(data)) {
                if ($isNumber(dataIndex)) {
                    obj = data[dataIndex];
                }
                
                if ($isObject(obj)) {
                    data = obj;
                } else {
                    data = void 0;
                    return false;
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
                    }
                    
                    if ($isArray(arr)) {
                        data = arr;
                    } else {
                        data = void 0;
                        return false;
                    }
                    
                    dataIndex = index ? +index : index;
                });
                
                if (data === void 0) {
                    return false;
                }
                
            } else {
                if (keys[i + 1] !== void 0) {
                    obj = data[key];
                    
                    if ($isObject(obj)) {
                        data = obj;
                    } else {
                        data = void 0;
                        return false;
                    }
                }
                
                dataKey = key;
            }
        });
    
        if ($isObject(data)) {
            value = data[dataKey];
        } else
        if ($isArray(data)) {
            value = $isNumber(dataIndex) ? data[dataIndex] : data;
        }
        
        return value;
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
