describe('aldera', function () {

    it('should be global', function () {
        expect(aldera).toEqual(jasmine.any(Object));
    });
    
    it('should have a version property', function () {
        expect(aldera.version).toBe('0.3.0-alpha.1');
    });
    
    it('should have a config property', function () {
        expect(aldera.config).toEqual(jasmine.any(Object));
    });
    
    it('should have a data property', function () {
        expect(aldera.data).toEqual(jasmine.any(Object));
    });
    
    it('should have a view method', function () {
        expect(aldera.view).toEqual(jasmine.any(Function));
    });
    
    it('should have a views method', function () {
        expect(aldera.views).toEqual(jasmine.any(Function));
    });
    
    it('should have a mixin method', function () {
        expect(aldera.mixin).toEqual(jasmine.any(Function));
    });
    
    it('should have a mixins method', function () {
        expect(aldera.mixins).toEqual(jasmine.any(Function));
    });
    
    it('should have a module method', function () {
        expect(aldera.module).toEqual(jasmine.any(Function));
    });
    
    it('should have a modules method', function () {
        expect(aldera.modules).toEqual(jasmine.any(Function));
    });
    
    it('should have a fn method', function () {
        expect(aldera.fn).toEqual(jasmine.any(Function));
    });
    
    it('should have a fns method', function () {
        expect(aldera.fns).toEqual(jasmine.any(Function));
    });
    
    it('should have a service method', function () {
        expect(aldera.service).toEqual(jasmine.any(Function));
    });
    
    it('should have a services method', function () {
        expect(aldera.services).toEqual(jasmine.any(Function));
    });
});