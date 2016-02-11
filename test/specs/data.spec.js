describe('Data', function () {
    var data = aldera.data;

    it('should be an instance of Data', function () {
        expect(data.constructor.name).toBe('Data');
        expect(data.reset).toEqual(jasmine.any(Function));
        expect(data.set).toEqual(jasmine.any(Function));
        expect(data.get).toEqual(jasmine.any(Function));
        expect(data.toString).toEqual(jasmine.any(Function));
        expect(data.toJSON).toEqual(jasmine.any(Function));
    });
    
    
    describe('reset', function () {
    
        afterEach(function () {
            data.reset();
        });
        
        it('should reset data to an empty object', function () {
            data.set({
                red: '#ff0000',
                green: '#00ff00',
                blue: '#0000ff'
            });
            
            expect(data.toString()).toBe('{"red":"#ff0000","green":"#00ff00","blue":"#0000ff"}');
            data.reset();
            expect(data.toString()).toBe('{}');
        });
        
        it('should set initial values', function () {
            data.reset({
                red: '#ff0000',
                green: '#00ff00',
                blue: '#0000ff'
            });
            
            expect(data.toString()).toBe('{"red":"#ff0000","green":"#00ff00","blue":"#0000ff"}');
        });
    });
    
    
    describe('set', function () {
    
        afterEach(function () {
            data.reset();
        });
    
        it('should set a path/value', function () {
            data.set('red', '#ff0000');
            data.set('green', '#00ff00');
            data.set('blue', '#0000ff');
            expect(data.toString()).toBe('{"red":"#ff0000","green":"#00ff00","blue":"#0000ff"}');
            
            data.set('red', '255,0,0');
            data.set('green', '0,255,0');
            data.set('blue', '0,0,255');
            expect(data.toString()).toBe('{"red":"255,0,0","green":"0,255,0","blue":"0,0,255"}');
        });
        
        it('should create objects that cannot be resolved in path and set a path/value', function () {
            data.set('colors', {red: '#ff0000'});
            data.set('colors.green', '#00ff00');
            data.set('colors.blue', '#0000ff');
            expect(data.toString()).toBe('{"colors":{"red":"#ff0000","green":"#00ff00","blue":"#0000ff"}}');
            
            data.reset();
            data.set('colors', {red: {hex: ''}});
            data.set('colors.red.hex', '#ff0000');
            data.set('colors.red.rgb', '255,0,0');
            data.set('colors.green.hex', '#00ff00');
            data.set('colors.green.rgb', '0,255,0');
            data.set('colors.blue.hex', '#0000ff');
            data.set('colors.blue.rgb', '0,0,255');
            expect(data.toString()).toBe('{"colors":{"red":{"hex":"#ff0000","rgb":"255,0,0"},"green":{"hex":"#00ff00","rgb":"0,255,0"},"blue":{"hex":"#0000ff","rgb":"0,0,255"}}}');
            
            data.reset();
            data.set('one.fish.two.fish.red.fish.blue.fish', null);
            expect(data.toString()).toBe('{"one":{"fish":{"two":{"fish":{"red":{"fish":{"blue":{"fish":null}}}}}}}}');
        });   
    
        it('should create arrays that cannot be resolved in path and set a path/value', function () {
            data.set('colors[]', 'red');
            data.set('colors[]', 'green');
            data.set('colors[]', 'blue');
            expect(data.toString()).toBe('{"colors":["red","green","blue"]}');
            
            data.reset();
            data.set('colors[][]', 'red');
            data.set('colors[][]', 'green');
            data.set('colors[][]', 'blue');
            expect(data.toString()).toBe('{"colors":[["red"],["green"],["blue"]]}');
        
            data.reset();
            data.set('colors[][][]', 'red');
            data.set('colors[][][]', 'green');
            data.set('colors[][][]', 'blue');
            expect(data.toString()).toBe('{"colors":[[["red"]],[["green"]],[["blue"]]]}');
            
            data.reset();
            data.set('colors[]', 'red');
            data.set('colors[][]', 'green');
            data.set('colors[][][]', 'blue');
            expect(data.toString()).toBe('{"colors":["red",["green"],[["blue"]]]}');
        
            data.reset();
            data.set('colors', ['red']);
            data.set('colors[]', 'green');
            data.set('colors[]', 'blue');
            expect(data.toString()).toBe('{"colors":["red","green","blue"]}');
        });
        
        it('should create arrays that cannot be resolved in path and set a path/value by index', function () {
            data.set('colors[0]', 'red');
            expect(data.toString()).toBe('{"colors":["red"]}');
            
            data.reset();
            data.set('colors[1]', 'red');
            expect(data.toString()).toBe('{"colors":[null,"red"]}');
        
            data.reset();
            data.set('colors', ['red', 'orange', 'blue']);
            data.set('colors[1]', 'green');
            expect(data.toString()).toBe('{"colors":["red","green","blue"]}');
            
            data.reset();
            data.set('colors[0]', 'red');
            data.set('colors[1]', 'green');
            data.set('colors[2]', 'blue');
            expect(data.toString()).toBe('{"colors":["red","green","blue"]}');
            
            data.reset();
            data.set('colors[0]', 'red');
            data.set('colors[0]', 'green');
            data.set('colors[0]', 'blue');
            expect(data.toString()).toBe('{"colors":["blue"]}');
            
            data.reset();
            data.set('colors[0]', 'red');
            data.set('colors[]', 'green');
            data.set('colors[0]', 'blue');
            expect(data.toString()).toBe('{"colors":["blue","green"]}');
            
            data.reset();
            data.set('colors[0][0]', 'red');
            data.set('colors[1][0]', 'green');
            data.set('colors[2][0]', 'blue');
            expect(data.toString()).toBe('{"colors":[["red"],["green"],["blue"]]}');
            
            data.reset();
            data.set('colors[0][0]', 'red');
            data.set('colors[][]', 'green');
            data.set('colors[2][0]', 'blue');
            expect(data.toString()).toBe('{"colors":[["red"],["green"],["blue"]]}');
        
            data.reset();
            data.set('colors', ['red', ['blue']]);
            data.set('colors[1][0]', 'green');
            data.set('colors[1][]', 'blue');
            expect(data.toString()).toBe('{"colors":["red",["green","blue"]]}');
            
            data.reset();
            data.set('colors[0][0][]', 'red');
            data.set('colors[1][][0]', 'green');
            data.set('colors[2][0][]', 'blue');
            expect(data.toString()).toBe('{"colors":[[["red"]],[["green"]],[["blue"]]]}');
            
            data.reset();
            data.set('colors[0]', 'red');
            data.set('colors[1][0]', 'green');
            data.set('colors[2][][0]', 'blue');
            expect(data.toString()).toBe('{"colors":["red",["green"],[["blue"]]]}');
        
            data.reset();
            data.set('colors[1][1]', 'red');
            data.set('colors[2][2]', 'green');
            data.set('colors[3][3]', 'blue');
            expect(data.toString()).toBe('{"colors":[null,[null,"red"],[null,null,"green"],[null,null,null,"blue"]]}');
        
            data.reset();
            data.set('colors[1][1]', 'red');
            data.set('colors[0]', 'green');
            data.set('colors[1][0]', 'blue');
            expect(data.toString()).toBe('{"colors":["green",["blue","red"]]}');
        });
        
        it('should create objects/arrays that cannot be resolved in path and set a path/value', function () {
            data.set('a[].b[].c[].d[].e[].f[].g[]', null);
            expect(data.toString()).toBe('{"a":[{"b":[{"c":[{"d":[{"e":[{"f":[{"g":[null]}]}]}]}]}]}]}');
            
            data.reset();
            data.set('a[].b.c[].d.e[].f.g[]', null);
            expect(data.toString()).toBe('{"a":[{"b":{"c":[{"d":{"e":[{"f":{"g":[null]}}]}}]}}]}');
            
            data.reset();
            data.set('a[].b[].c[].d.e[].f[].g[]', null);
            expect(data.toString()).toBe('{"a":[{"b":[{"c":[{"d":{"e":[{"f":[{"g":[null]}]}]}}]}]}]}');
            
            data.reset();
            data.set('a.b[].c.d[].e.f[].g.h[]', null);
            expect(data.toString()).toBe('{"a":{"b":[{"c":{"d":[{"e":{"f":[{"g":{"h":[null]}}]}}]}}]}}');
            
            data.reset();
            data.set('a[1][0].b.c[1][0].d.e[1][0].f.g[1][0]', null);
            expect(data.toString()).toBe('{"a":[null,[{"b":{"c":[null,[{"d":{"e":[null,[{"f":{"g":[null,[null]]}}]]}}]]}}]]}');
            
            data.reset();
            data.set('a[1][0][].b.c[][0][].e.f.g', null);
            expect(data.toString()).toBe('{"a":[null,[[{"b":{"c":[[[{"e":{"f":{"g":null}}}]]]}}]]]}');
        });
        
        it('should set a group of path/values', function () {
            data.set({
                'colors[].red.hex': '#ff0000',
                'colors[0].red.rgb': '255,0,0',
                'colors[].green.hex': '#00ff00',
                'colors[1].green.rgb': '0,255,0',
                'colors[].blue.hex': '#0000ff',
                'colors[2].blue.rgb': '0,0,255'
            });
            expect(data.toString()).toBe('{"colors":[{"red":{"hex":"#ff0000","rgb":"255,0,0"}},{"green":{"hex":"#00ff00","rgb":"0,255,0"}},{"blue":{"hex":"#0000ff","rgb":"0,0,255"}}]}');
        });
    });
    

    describe('get', function () {
        
        afterEach(function () {
            data.reset();
        });
        
        it('should return undefined', function () {
            expect(data.get()).toBe(void 0);
            expect(data.get('a')).toBe(void 0);
            expect(data.get('a.b')).toBe(void 0);
            expect(data.get('a[]')).toBe(void 0);
        });
        
        it('should get a value', function () {
            data.set({
                red: '#ff0000',
                green: '#00ff00',
                blue: '#0000ff'
            });
            expect(data.get('red')).toBe('#ff0000');
            expect(data.get('green')).toBe('#00ff00');
            expect(data.get('blue')).toBe('#0000ff');
        });
        
        it('should get a value from an object path reference', function () {
            data.set('a', {b: {c: {}}});
            expect(JSON.stringify(data.get('a'))).toBe('{"b":{"c":{}}}');
            expect(JSON.stringify(data.get('a.b'))).toBe('{"c":{}}');
            expect(JSON.stringify(data.get('a.b.c'))).toBe('{}');
        });
        
        it('should get a value from an array path reference', function () {
            data.set('colors', ['red', 'green', 'blue']);
            expect(JSON.stringify(data.get('colors'))).toBe('["red","green","blue"]');
            expect(JSON.stringify(data.get('colors[]'))).toBe('["red","green","blue"]');
            expect(data.get('colors[0]')).toEqual('red');
            expect(data.get('colors[1]')).toEqual('green');
            expect(data.get('colors[2]')).toEqual('blue');
            expect(data.get('colors[0][0]')).toBe(void 0);
            
            data.reset();
            data.set('colors', [['red'], ['green'], ['blue']]);
            expect(JSON.stringify(data.get('colors'))).toBe('[["red"],["green"],["blue"]]');
            expect(JSON.stringify(data.get('colors[]'))).toBe('[["red"],["green"],["blue"]]');
            expect(JSON.stringify(data.get('colors[0]'))).toBe('["red"]');
            expect(JSON.stringify(data.get('colors[1]'))).toBe('["green"]');
            expect(JSON.stringify(data.get('colors[2]'))).toBe('["blue"]');
            expect(JSON.stringify(data.get('colors[0][]'))).toBe('["red"]');
            expect(JSON.stringify(data.get('colors[1][]'))).toBe('["green"]');
            expect(JSON.stringify(data.get('colors[2][]'))).toBe('["blue"]');
            expect(data.get('colors[0][0]')).toEqual('red');
            expect(data.get('colors[1][0]')).toEqual('green');
            expect(data.get('colors[2][0]')).toEqual('blue');
        });
        
        it('should get a value from a complex path reference', function () {
            data.set('a', [{b: [{c: [{d: []}]}]}]);
            expect(JSON.stringify(data.get('a'))).toBe('[{"b":[{"c":[{"d":[]}]}]}]');
            expect(JSON.stringify(data.get('a[]'))).toBe('[{"b":[{"c":[{"d":[]}]}]}]');
            expect(JSON.stringify(data.get('a[].b'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0]'))).toBe('{"b":[{"c":[{"d":[]}]}]}');
            expect(JSON.stringify(data.get('a[0].b'))).toBe('[{"c":[{"d":[]}]}]');
            expect(JSON.stringify(data.get('a[0].b[]'))).toBe('[{"c":[{"d":[]}]}]');
            expect(JSON.stringify(data.get('a[0].b[].c'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0].b[0]'))).toBe('{"c":[{"d":[]}]}');
            expect(JSON.stringify(data.get('a[0].b[0].c'))).toBe('[{"d":[]}]');
            expect(JSON.stringify(data.get('a[0].b[0].c[]'))).toBe('[{"d":[]}]');
            expect(JSON.stringify(data.get('a[0].b[0].c[].d'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0].b[0].c[0]'))).toBe('{"d":[]}');
            expect(JSON.stringify(data.get('a[0].b[0].c[0].d'))).toBe('[]');
            expect(JSON.stringify(data.get('a[0].b[0].c[0].d[]'))).toBe('[]');
            expect(JSON.stringify(data.get('a[0].b[0].c[0].d[0]'))).toBe(void 0);
    
            data.reset();
            data.set('a', {b: [{c: {d: []}}]});
            expect(JSON.stringify(data.get('a'))).toBe('{"b":[{"c":{"d":[]}}]}');
            expect(JSON.stringify(data.get('a.b'))).toBe('[{"c":{"d":[]}}]');
            expect(JSON.stringify(data.get('a.b[]'))).toBe('[{"c":{"d":[]}}]');
            expect(JSON.stringify(data.get('a.b[].c'))).toBe(void 0);
            expect(JSON.stringify(data.get('a.b[0]'))).toBe('{"c":{"d":[]}}');
            expect(JSON.stringify(data.get('a.b[0].c'))).toBe('{"d":[]}');
            expect(JSON.stringify(data.get('a.b[0].c.d'))).toBe('[]');
            expect(JSON.stringify(data.get('a.b[0].c.d[]'))).toBe('[]');
            expect(JSON.stringify(data.get('a.b[0].c.d[0]'))).toBe(void 0);
        
            data.reset();
            data.set('a', [[void 0, {b: [[void 0, [void 0, void 0, {c: [[void 0, {d: [[void 0, []]]}]]}]]]}]]);
            expect(JSON.stringify(data.get('a'))).toBe('[[null,{"b":[[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]]}]]');
            expect(JSON.stringify(data.get('a[]'))).toBe('[[null,{"b":[[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]]}]]');
            expect(JSON.stringify(data.get('a[0]'))).toBe('[null,{"b":[[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]]}]');
            expect(JSON.stringify(data.get('a[0][]'))).toBe('[null,{"b":[[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]]}]');
            expect(JSON.stringify(data.get('a[0][0]'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0][1]'))).toBe('{"b":[[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]]}');
            expect(JSON.stringify(data.get('a[0][1].b'))).toBe('[[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]]');
            expect(JSON.stringify(data.get('a[0][1].b[]'))).toBe('[[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]]');
            expect(JSON.stringify(data.get('a[0][1].b[0]'))).toBe('[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]');
            expect(JSON.stringify(data.get('a[0][1].b[0][]'))).toBe('[null,[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]]');
            expect(JSON.stringify(data.get('a[0][1].b[0][0]'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0][1].b[0][1]'))).toBe('[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][]'))).toBe('[null,null,{"c":[[null,{"d":[[null,[]]]}]]}]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][0]'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0][1].b[0][1][1]'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2]'))).toBe('{"c":[[null,{"d":[[null,[]]]}]]}');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c'))).toBe('[[null,{"d":[[null,[]]]}]]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[]'))).toBe('[[null,{"d":[[null,[]]]}]]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0]'))).toBe('[null,{"d":[[null,[]]]}]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][]'))).toBe('[null,{"d":[[null,[]]]}]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][0]'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][1]'))).toBe('{"d":[[null,[]]]}');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][1].d'))).toBe('[[null,[]]]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][1].d[]'))).toBe('[[null,[]]]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][1].d[0]'))).toBe('[null,[]]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][1].d[0][]'))).toBe('[null,[]]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][1].d[0][0]'))).toBe(void 0);
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][1].d[0][1]'))).toBe('[]');
            expect(JSON.stringify(data.get('a[0][1].b[0][1][2].c[0][1].d[0][1][]'))).toBe('[]');
        });
        
        it('should get a group of path/values', function () {
            data.set({
                colors: {
                    red: '#ff0000',
                    green: '#00ff00',
                    blue: '#0000ff'
                },
                fruits: [
                    'apples',
                    'oranges',
                    'bananas'
                ]
            });
            
            var paths = [
                'colors.red',
                'colors.green',
                'colors.blue',
                'fruits[1]'
            ];
            
            expect(JSON.stringify(data.get(paths))).toBe('{"colors.red":"#ff0000","colors.green":"#00ff00","colors.blue":"#0000ff","fruits[1]":"oranges"}');
        });
    });
    
    
    describe('toString', function () {
    
        it('should return a valid JSON string', function () {
            data.set({
                red: ['#ff0000', void 0],
                green: void 0,
                blue: function () {}
            });
            
            expect(data.toString()).toBe('{"red":["#ff0000",null]}');
            data.reset();
        });
    });
   
    
    describe('toJSON', function () {
        
        it('should return a valid JSON object', function () {
            data.set({
                red: ['#ff0000', void 0],
                green: void 0,
                blue: function () {}
            });
        
            expect(JSON.stringify(data.toJSON())).toBe('{"red":["#ff0000",null]}');
            data.reset();
        });
    });
});
