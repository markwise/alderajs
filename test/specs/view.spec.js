describe('aldera.view', function () {

    it('should define a view', function () {
        expect(aldera.view('A')).toBe(void 0);
        aldera.view('A', {});
        expect(aldera.view('A').constructor.name).toBe('View');
        expect(aldera.view('A').create).toEqual(jasmine.any(Function));
        aldera.view('A').remove();
    });
    
    it('should create a view instance', function () {
        var a;
        
        aldera.view('A', {});
        a = aldera.view('A').create();
        expect(a.constructor.name).toBe('A');
        expect(a.data).toEqual(jasmine.any(Object));
        expect(a.addEvent).toEqual(jasmine.any(Function));
        expect(a.addEvents).toEqual(jasmine.any(Function));
        expect(a.removeEvent).toEqual(jasmine.any(Function));
        expect(a.removeEvents).toEqual(jasmine.any(Function));
        expect(a.disableEvents).toEqual(jasmine.any(Function));
        expect(a.enableEvents).toEqual(jasmine.any(Function));
        expect(a.mixin).toEqual(jasmine.any(Function));
        expect(a.addOutlet).toEqual(jasmine.any(Function));
        expect(a.addOutlets).toEqual(jasmine.any(Function));
        expect(a.replaceOutlet).toEqual(jasmine.any(Function));
        expect(a.replaceOutlets).toEqual(jasmine.any(Function));
        expect(a.render).toEqual(jasmine.any(Function));
        aldera.view('A').remove();
    });
    

    describe('aspect', function () {
        var a;
        
        afterEach(function () {
            a = void 0;
            aldera.view('A').remove();
        });
    
        it('should default to a <div> element', function () {
            aldera.view('A', {});
            a = aldera.view('A').create();
            expect(a.el).toEqual('div');
        });
        
        it('should have the view name as a class', function () {
            aldera.view('A', {});
            a = aldera.view('A').create();
            expect(a.el).toEqual('div.a');
        });
    
        it('should define the view element type', function () {
            aldera.view('A', {
                aspect: 'span'
            });
            
            a = aldera.view('A').create();
            expect(a.el).toEqual('span.a');
        });
        
        it('should add classes to the view element', function () {
            aldera.view('A', {
                aspect: 'span.foo.bar'
            });
            
            a = aldera.view('A').create();
            expect(a.el).toEqual('span.a.foo.bar');
        });
    });
    
    
    describe('init', function () {
        var a;
        
        afterEach(function () {
            a = void 0;
            aldera.view('A').remove();
        });
    
        it('should call init method', function () {
            var spy = jasmine.createSpy();
        
            aldera.view('A', {
                init: spy
            });
            
            aldera.view('A').create();
            expect(spy).toHaveBeenCalled();
        });
        
        it('should create init method if not defined and auto render view', function (done) {
            aldera.view('A', {});
            a = aldera.view('A').create();
            
            setTimeout(function () {
                expect(a.el).toHaveHtml('<h1>a</h1>');
                done();
            }, 50);
        });

        it('should have an options object parameter', function () {
            aldera.view('A', {
                init: function (opts) {
                    expect(opts).toEqual(jasmine.any(Object));
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should pass options to options object', function () {
            aldera.view('A', {
                init: function (opts) {
                    expect(JSON.stringify(opts)).toBe('{"foo":"bar"}');
                }
            });
            
            aldera.view('A').create({
                opts: {
                    foo: 'bar'
                }
            });
        });
    });
    

    describe('render', function () {
        var a;
        
        afterEach(function () {
            a = void 0;
            aldera.view('A').remove();
        });
        
        it('should render default template', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render();
                    
                    setTimeout(function () {
                        expect(this.el).toHaveHtml('<h1>a</h1>');
                        done();
                    }.bind(this), 50);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should render alternate template', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render('b');
                    
                    setTimeout(function () {
                        expect(this.el).toHaveHtml('<h1>b</h1>');
                        done();
                    }.bind(this), 50);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should call render callback after default delay', function (done) {
            aldera.view('A', {
                init: function () {
                    var spy = jasmine.createSpy();
                    this.render(spy);
                    
                    setTimeout(function () {
                        expect(spy).not.toHaveBeenCalled();
                    }, 49);
            
                    setTimeout(function () {
                        expect(spy).toHaveBeenCalled();
                        done();
                    }, 50);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should call render callback after delay', function (done) {
            aldera.view('A', {
                init: function () {
                    var spy = jasmine.createSpy();
                    this.render(spy, 100);
                    
                    setTimeout(function () {
                        expect(spy).not.toHaveBeenCalled();
                    }, 99);
            
                    setTimeout(function () {
                        expect(spy).toHaveBeenCalled();
                        done();
                    }, 100);
                }
            });
            
            aldera.view('A').create();
        });
    
        it('should render alternate template and call render callback after default delay', function (done) {
            aldera.view('A', {
                init: function () {
                    var spy = jasmine.createSpy();
                    this.render('b', spy);
                    
                    setTimeout(function () {
                        expect(spy).not.toHaveBeenCalled();
                    }, 49);
        
                    setTimeout(function () {
                        expect(spy).toHaveBeenCalled();
                        expect(this.el).toHaveHtml('<h1>b</h1>');
                        done();
                    }.bind(this), 50);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should render alternate template and call render callback after delay', function (done) {
            aldera.view('A', {
                init: function () {
                    var spy = jasmine.createSpy();
                    this.render('b', spy, 100);
                    
                    setTimeout(function () {
                        expect(spy).not.toHaveBeenCalled();
                    }, 99);
        
                    setTimeout(function () {
                        expect(spy).toHaveBeenCalled();
                        expect(this.el).toHaveHtml('<h1>b</h1>');
                        done();
                    }.bind(this), 100);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should have view element as callback parameter', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render(function (el) {
                        expect(this.el).toBe(el);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should pass data to template', function (done) {
            aldera.view('A', {
                init: function () {
                    this.data.set('title', 'foo bar');
                
                    this.render('x', function (el) {
                        expect(el).toHaveHtml('<h1>foo bar</h1>');
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
    });
});
