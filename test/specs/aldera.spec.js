describe('aldera', function () {

    it('should be an application instance', function () {
        expect(aldera.constructor.name).toBe('App');
        expect(aldera.version).toEqual(jasmine.any(String));
        expect(aldera.root).toEqual(jasmine.any(String));
        expect(aldera.config).toEqual(jasmine.any(Object));
        expect(aldera.data).toEqual(jasmine.any(Object));
        expect(aldera.view).toEqual(jasmine.any(Function));
        expect(aldera.views).toEqual(jasmine.any(Function));
        expect(aldera.mixin).toEqual(jasmine.any(Function));
        expect(aldera.mixins).toEqual(jasmine.any(Function));
        expect(aldera.module).toEqual(jasmine.any(Function));
        expect(aldera.modules).toEqual(jasmine.any(Function));
        expect(aldera.fn).toEqual(jasmine.any(Function));
        expect(aldera.fns).toEqual(jasmine.any(Function));
        expect(aldera.service).toEqual(jasmine.any(Function));
        expect(aldera.services).toEqual(jasmine.any(Function));
        expect(aldera.compileTemplates).toEqual(jasmine.any(Function));
    });


    describe('view', function () {
        
        afterEach(function () {
            aldera.view('A').remove();
        });

        it('should define a view using an object definition', function () {
            var app, a;
            expect(aldera.view('A')).toBe(void 0);
            app = aldera.view('A', {});
            a = aldera.view('A');
            expect(app).toBe(aldera);
            expect(a.constructor.name).toBe('View');
            expect(a.create).toEqual(jasmine.any(Function));
        });
        
        it('should define a view using a function definition', function () {
            var app, a;
            expect(aldera.view('A')).toBe(void 0);
            app = aldera.view('A', function () {return {}});
            a = aldera.view('A');
            expect(app).toBe(aldera);
            expect(a.constructor.name).toBe('View');
            expect(a.create).toEqual(jasmine.any(Function));
        });
    });
    
    
    describe('mixin', function () {
        
        it('should define a mixin', function () {
            var app;
            expect(aldera.mixin('test')).toBe(void 0);
            app = aldera.mixin('test', function () {return function () {}});
            expect(app).toBe(aldera);
            expect(aldera.mixin('test')).toEqual(jasmine.any(Function));
            // This is for testing only and should never be done
            aldera._mixins = {};
        });
    });
    
    
    describe('module', function () {
    
        it('should define a module', function () {
            var app;
            expect(aldera.module('test')).toBe(void 0);
            app = aldera.module('test', function () {return {}});
            expect(app).toBe(aldera);
            expect(aldera.module('test')).toEqual(jasmine.any(Object));
            // This is for testing only and should never be done
            aldera._modules = {};
        });
    });
    
    
    describe('fn', function () {
    
        it('should define a function', function () {
            var app;
            expect(aldera.fn('test')).toBe(void 0);
            app = aldera.fn('test', function () {return function () {}});
            expect(app).toBe(aldera);
            expect(aldera.fn('test')).toEqual(jasmine.any(Function));
            // This is for testing only and should never be done
            aldera._fns = {};
        });
    });
    
    
    describe('service', function () {
        
        it('should define a service', function () {
            var app;
            expect(aldera.service('test')).toBe(void 0);
            
            app = aldera.service('test', function (root) {
                expect(root).toBe(aldera.root);
                return {};
            });
            
            expect(app).toBe(aldera);
            expect(aldera.service('test')).toEqual(jasmine.any(Object));
            // This is for testing only and should never be done
            aldera._services = {};
        });
    });
});
