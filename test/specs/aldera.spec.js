describe('aldera', function () {

    it('should be an app instance', function () {
        expect(aldera.constructor.name).toBe('App');
        expect(aldera.version).toEqual(jasmine.any(String));
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
    });
});
