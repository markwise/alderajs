//
// @constructor
// $Data
//

var $Data = (function () {
    var getValue = function (model, path) {
        var keys = path.split(/\./),
            data = model,
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
    
    var getValues = function (model, paths) {
        var values = {};
        
        jQuery.each(paths, function (index, path) {
            values[path] = getValue(model, path);
        });
        
        return values;
    };
    
    var setValue = function (model, path, value) {
        var keys = path.split(/\./),
            data = model,
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
    
    var setValues = function (model, paths) {
        jQuery.each(paths, function (path, value) {
            setValue(model, path, value);
        });
    };
   
    
    var Fn = function Data(data) {
        var self = this;
        
        self.model = {};
        
        if ($isObject(data)) {
            self.set(data);
        }
    };

    Fn.prototype = {


        get: function (path) {
            var self = this,
                value;
            
            if ($isString(path)) {
                value = getValue(self.model, path);
            } else
            if ($isArray(path)) {
                value = getValues(self.model, path);
            }
            
            return value;
        },
    
        
        set: function (path, value) {
            var self = this;
    
            if ($isString(path)) {
                setValue(self.model, path, value);
            } else
            if ($isObject(path)) {
                setValues(self.model, path);
            }
        },

        
        toJSON: function () {
            return jQuery.extend(true, {}, this.model);
        }
    };

    return Fn;
}());