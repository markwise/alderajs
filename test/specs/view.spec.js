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
        
        it('should be overridden by config object', function () {
            aldera.view('A', {
                aspect: 'span.foo.bar'
            });
            
            a = aldera.view('A').create({
                aspect: 'section.hello.world'
            });
            
            expect(a.el).toEqual('section.a.hello.world');
        });
    });
    
    
    describe('init', function () {
        
        afterEach(function () {
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
            var a;
            
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
        
        afterEach(function () {
            aldera.view('A').remove();
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
        
        it('should have view as callback context', function (done) {
            aldera.view('A', {
                init: function () {
                    var self = this;
                
                    this.render(function () {
                        expect(this).toBe(self);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should have view element as callback parameter', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render(function (el) {
                        expect(el).toBe(this.el);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });        
        
        it('should render default template', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render(function (el) {
                        expect(el).toHaveHtml('<h1>a</h1>');
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should render alternate template', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render('b', function (el) {
                        expect(el).toHaveHtml('<h1>b</h1>');
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
                
                    this.render('data', function (el) {
                        expect(el).toHaveHtml('<h1>foo bar</h1>');
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
    });
        
        
    describe('addOutlet', function () {
        
        afterEach(function () {
            aldera.view('A').remove();
            aldera.view('C').remove();
        });

        it('should add an outlet', function (done) {
            aldera.view('A', {});
        
            aldera.view('C', {
                init: function () {
                    this.addOutlet('outlet1', aldera.view('A').create());
                
                    this.render('outlet', function (el) {
                        expect(el).toHaveHtml([
                            '<div class="a" data-view="A" data-outlet="outlet1">',
                                '<h1>a</h1>',
                            '</div>'
                        ].join(''));
                    
                        done();
                    });
                }
            });
        
            aldera.view('C').create();
        });
    });
    
    
    describe('addOutlets', function () {
        
        beforeEach(function () {
            aldera.view('A', {});
            aldera.view('B', {});
        });
    
        afterEach(function () {
            aldera.view('A').remove();
            aldera.view('B').remove();
            aldera.view('C').remove();
        });
        
        it('should add a group of outlets', function (done) {
            aldera.view('C', {
                init: function () {
                    this.addOutlets({
                        outlet1: aldera.view('A').create(),
                        outlet2: aldera.view('B').create()
                    });
                
                    this.render('outlets', function (el) {
                        expect(el).toHaveHtml([
                            '<div class="a" data-view="A" data-outlet="outlet1">',
                                '<h1>a</h1>',
                            '</div>\n',
                            '<div class="b" data-view="B" data-outlet="outlet2">',
                                '<h1>b</h1>',
                            '</div>'
                        ].join(''));
                    
                        done();
                    });
                }
            });
        
            aldera.view('C').create();
        });
        
        it('should add a group of outlets from config object', function (done) {
            aldera.view('C', {
                init: function () {
                    this.render('outlets', function (el) {
                        expect(el).toHaveHtml([
                            '<div class="a" data-view="A" data-outlet="outlet1">',
                                '<h1>a</h1>',
                            '</div>\n',
                            '<div class="b" data-view="B" data-outlet="outlet2">',
                                '<h1>b</h1>',
                            '</div>'
                        ].join(''));
                    
                        done();
                    });
                }
            });
        
            aldera.view('C').create({
                outlets: {
                    outlet1: aldera.view('A').create(),
                    outlet2: aldera.view('B').create()
                }
            });
        });
    });
        
        
    describe('replaceOutlet', function () {
        
        beforeEach(function () {
            aldera.view('A', {});
            aldera.view('B', {});
        });
        
        afterEach(function () {
            aldera.view('A').remove();
            aldera.view('B').remove();
            aldera.view('C').remove();
        });
    
        it('should call callback after default delay', function (done) {
            aldera.view('C', {
                init: function () {
                    this.render('outlet', function () {
                        var spy = jasmine.createSpy();
                        
                        this.replaceOutlet('outlet1', aldera.view('A').create(), spy);
                        
                        setTimeout(function () {
                            expect(spy).not.toHaveBeenCalled();
                        }, 49);
                        
                        setTimeout(function () {
                            expect(spy).toHaveBeenCalled();
                            done();
                        }, 50);
                    });
                }
            });
            
            aldera.view('C').create();
        });
        
        it('should call callback after delay', function (done) {
            aldera.view('C', {
                init: function () {
                    this.render('outlet', function () {
                        var spy = jasmine.createSpy();
                        
                        this.replaceOutlet('outlet1', aldera.view('A').create(), spy, 100);
                        
                        setTimeout(function () {
                            expect(spy).not.toHaveBeenCalled();
                        }, 99);
                        
                        setTimeout(function () {
                            expect(spy).toHaveBeenCalled();
                            done();
                        }, 100);
                    });
                }
            });
            
            aldera.view('C').create();
        });
        
        it('should have view as callback context', function (done) {
             aldera.view('C', {
                init: function () {
                    var self = this;
                    
                    this.render('outlet', function () {
                        this.replaceOutlet('outlet1', aldera.view('A').create(), function () {
                            expect(this).toBe(self);
                            done();
                        });
                    });
                }
            });
            
            aldera.view('C').create();
        });
        
        it('should have view element as callback parameter', function (done) {
             aldera.view('C', {
                init: function () {
                    this.render('outlet', function () {
                        this.replaceOutlet('outlet1', aldera.view('A').create(), function (el) {
                            expect(el).toBe(this.el);
                            done();
                        });
                    });
                }
            });
            
            aldera.view('C').create();
        });
        
        it('should replace an outlet', function (done) {
            aldera.view('C', {
                init: function () {
                    this.addOutlet('outlet1', aldera.view('A').create());
                    
                    this.render('outlet', function (el) {
                        expect(el).toHaveHtml([
                            '<div class="a" data-view="A" data-outlet="outlet1">',
                                '<h1>a</h1>',
                            '</div>'
                        ].join(''));
                        
                        this.replaceOutlet('outlet1', aldera.view('B').create(), function () {
                            expect(el).toHaveHtml([
                                '<div class="b" data-view="B" data-outlet="outlet1">',
                                    '<h1>b</h1>',
                                '</div>'
                            ].join(''));
                        
                            done();
                        });
                    });
                }
            });
            
            aldera.view('C').create();
        });
    });
        
    
    describe('replaceOutlets', function () {
        
        beforeEach(function () {
            aldera.view('A', {});
            aldera.view('B', {});
            aldera.view('X', {});
            aldera.view('Y', {});
        });
        
        afterEach(function () {
            aldera.view('A').remove();
            aldera.view('B').remove();
            aldera.view('C').remove();
            aldera.view('X').remove();
            aldera.view('Y').remove();
        });
    
        it('should call callback after default delay', function (done) {
            aldera.view('C', {
                init: function () {
                    this.render('outlets', function () {
                        var spy = jasmine.createSpy();
                        
                        this.replaceOutlets({
                            outlet1: aldera.view('A').create()
                        }, spy);
                        
                        setTimeout(function () {
                            expect(spy).not.toHaveBeenCalled();
                        }, 49);
                        
                        setTimeout(function () {
                            expect(spy).toHaveBeenCalled();
                            done();
                        }, 50);
                    });
                }
            });
            
            aldera.view('C').create();
        });
        
        it('should call callback after delay', function (done) {
            aldera.view('C', {
                init: function () {
                    this.render('outlets', function () {
                        var spy = jasmine.createSpy();
                        
                        this.replaceOutlets({
                            outlet1: aldera.view('A').create()
                        }, spy, 100);
                        
                        setTimeout(function () {
                            expect(spy).not.toHaveBeenCalled();
                        }, 99);
                        
                        setTimeout(function () {
                            expect(spy).toHaveBeenCalled();
                            done();
                        }, 100);
                    });
                }
            });
            
            aldera.view('C').create();
        });
        
        it('should have view as callback context', function (done) {
             aldera.view('C', {
                init: function () {
                    var self = this;
                    
                    this.render('outlets', function () {
                        this.replaceOutlets({
                            outlet1: aldera.view('A').create()
                        }, function () {
                            expect(this).toBe(self);
                            done();
                        });
                    });
                }
            });
            
            aldera.view('C').create();
        });
        
        it('should have view element as callback parameter', function (done) {
             aldera.view('C', {
                init: function () {
                    this.render('outlets', function () {
                        this.replaceOutlets({
                            outlet1: aldera.view('A').create()
                        }, function (el) {
                            expect(el).toBe(this.el);
                            done();
                        });
                    });
                }
            });
            
            aldera.view('C').create();
        });
        
        it('should replace a group of outlets', function (done) {
            aldera.view('C', {
                init: function () {
                    this.addOutlets({
                        outlet1: aldera.view('A').create(),
                        outlet2: aldera.view('X').create()
                    });
                    
                    this.render('outlets', function (el) {
                        expect(el).toHaveHtml([
                            '<div class="a" data-view="A" data-outlet="outlet1">',
                                '<h1>a</h1>',
                            '</div>\n',
                            '<div class="x" data-view="X" data-outlet="outlet2">',
                                '<h1>x</h1>',
                            '</div>'
                        ].join(''));
                        
                        this.replaceOutlets({
                            outlet1: aldera.view('B').create(),
                            outlet2: aldera.view('Y').create()
                        }, function () {
                            expect(el).toHaveHtml([
                                '<div class="b" data-view="B" data-outlet="outlet1">',
                                    '<h1>b</h1>',
                                '</div>\n',
                                '<div class="y" data-view="Y" data-outlet="outlet2">',
                                    '<h1>y</h1>',
                                '</div>'
                            ].join(''));
                        
                            done();
                        });
                    });
                }
            });
            
            aldera.view('C').create();
        });
    });
    
    
    describe('events', function () {
        var spy;
    
        beforeEach(function () {
            spy = jasmine.createSpy(); 
        });
        
        afterEach(function () {
            spy = void 0;
            aldera.view('A').remove();
        });
    
        it('should add an event to the view element', function () {
            aldera.view('A', {
                events: {
                    'click': spy
                },
                
                init: function () {
                    expect(spy).not.toHaveBeenCalled();
                    this.el.trigger('click');
                    expect(spy).toHaveBeenCalled();
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should add multiple events to the view element', function () {
            aldera.view('A', {
                events: {
                    'mouseover|mouseout': spy
                },
                
                init: function () {
                    expect(spy.calls.count()).toBe(0);
                    this.el.trigger('mouseover');
                    expect(spy.calls.count()).toBe(1);
                    this.el.trigger('mouseover');
                    expect(spy.calls.count()).toBe(2);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should delegate an event for an element', function (done) {
            aldera.view('A', {
                events: {
                    'click .salt': spy
                },
                
                init: function () {
                    this.render('event', function (el) {
                        expect(spy).not.toHaveBeenCalled();
                        el.find('.salt').trigger('click');
                        expect(spy).toHaveBeenCalled();
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should delegate multiple events for an element', function (done) {
            aldera.view('A', {
                events: {
                    'mouseover|mouseout .salt': spy
                },
                
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(1);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(2);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should delegate an event for multiple elements', function (done) {
            aldera.view('A', {
                events: {
                    'click .salt|.pepper': spy
                },
                
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt');
                        var pepper = el.find('.pepper');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('click');
                        expect(spy.calls.count()).toBe(1);
                        pepper.trigger('click');
                        expect(spy.calls.count()).toBe(2);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        
        it('should delegate multiple events for multiple elements', function (done) {
            aldera.view('A', {
                events: {
                    'mouseover|mouseout .salt|.pepper': spy
                },
                
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt');
                        var pepper = el.find('.pepper');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(1);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(2);
                        pepper.trigger('mouseover');
                        expect(spy.calls.count()).toBe(3);
                        pepper.trigger('mouseout');
                        expect(spy.calls.count()).toBe(4);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
    });
    
    
    describe('addEvent', function () {
        var spy;
        
        beforeEach(function () {
            spy = jasmine.createSpy();
        });
        
        afterEach(function () {
            spy = void 0;
            aldera.view('A').remove();
        });
    
        it('should add an event to the view element', function () {
            aldera.view('A', {
                init: function () {
                    var el = this.el;
                
                    this.addEvent('click', spy);
                    expect(spy.calls.count()).toBe(0);
                    el.trigger('click');
                    expect(spy.calls.count()).toBe(1);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should add multiple events to the view element', function () {
             aldera.view('A', {
                init: function () {
                    var el = this.el;
                    
                    this.addEvent('mouseover|mouseout', spy);
                    expect(spy.calls.count()).toBe(0);
                    el.trigger('mouseover');
                    expect(spy.calls.count()).toBe(1);
                    el.trigger('mouseout');
                    expect(spy.calls.count()).toBe(2);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should delegate an event for an element', function (done) {
             aldera.view('A', {
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt');
                        
                        this.addEvent('click .salt', spy);
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('click');
                        expect(spy.calls.count()).toBe(1);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should delegate an event for multiple elements', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt'),
                            pepper = el.find('.pepper');
                            
                        this.addEvent('click .salt|.pepper', spy);
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('click');
                        expect(spy.calls.count()).toBe(1);
                        pepper.trigger('click');
                        expect(spy.calls.count()).toBe(2);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should delegate multiple events for an element', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt');
                        
                        this.addEvent('mouseover|mouseout .salt', spy);
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(1);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(2);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should delegate multiple events for multiple elements', function (done) {
            aldera.view('A', {
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt'),
                            pepper = el.find('.pepper');
                            
                        this.addEvent('mouseover|mouseout .salt|.pepper', spy);
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(1);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(2);
                        pepper.trigger('mouseover');
                        expect(spy.calls.count()).toBe(3);
                        pepper.trigger('mouseout');
                        expect(spy.calls.count()).toBe(4);
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
    });
    
    
    describe('addEvents', function () {
        
        it('should add a group of events', function (done) {
            var spy = jasmine.createSpy();
        
            aldera.view('A', {
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt'),
                            pepper = el.find('.pepper');
                            
                        this.addEvents({
                            'click': spy,
                            'mouseover .salt|.pepper': spy,
                            'mouseout .salt': spy,
                            'mouseout .pepper': spy
                        });
                            
                        expect(spy.calls.count()).toBe(0);
                        el.trigger('click');
                        expect(spy.calls.count()).toBe(1);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(2);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(3);
                        pepper.trigger('mouseover');
                        expect(spy.calls.count()).toBe(4);
                        pepper.trigger('mouseout');
                        expect(spy.calls.count()).toBe(5);
                        aldera.view('A').remove();
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
    });
    
    
    describe('removeEvent', function () {
        var spy;
        
        beforeEach(function () {
            spy = jasmine.createSpy();
        });
        
        afterEach(function () {
            spy = void 0;
            aldera.view('A').remove();
        });
        
        it('should remove an event from the view element', function () {
            aldera.view('A', {
                events: {
                    'click': spy
                },
            
                init: function () {
                    var el = this.el;
                
                    expect(spy.calls.count()).toBe(0);
                    el.trigger('click');
                    expect(spy.calls.count()).toBe(1);
                    
                    spy.calls.reset();
                    this.removeEvent('click');
                    
                    expect(spy.calls.count()).toBe(0);
                    el.trigger('click');
                    expect(spy.calls.count()).toBe(0);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should remove multiple events from the view element', function () {
             aldera.view('A', {
                events: {
                    'mouseover|mouseout': spy
                },
            
                init: function () {
                    var el = this.el;
                
                    expect(spy.calls.count()).toBe(0);
                    el.trigger('mouseover');
                    expect(spy.calls.count()).toBe(1);
                    el.trigger('mouseout');
                    expect(spy.calls.count()).toBe(2);
                    
                    spy.calls.reset();
                    // this.removeEvent('mouseover');
                    // this.removeEvent('mouseout');
                    this.removeEvent('mouseover|mouseout');
                    
                    expect(spy.calls.count()).toBe(0);
                    el.trigger('mouseover');
                    expect(spy.calls.count()).toBe(0);
                    el.trigger('mouseout');
                    expect(spy.calls.count()).toBe(0);
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should remove a delegated event from an element', function (done) {
             aldera.view('A', {
                events: {
                    'click .salt': spy
                },
            
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('click');
                        expect(spy.calls.count()).toBe(1);
                        
                        spy.calls.reset();
                        this.removeEvent('click .salt');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('click');
                        expect(spy.calls.count()).toBe(0);
                        
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should remove a delegated event from multiple elements', function (done) {
            aldera.view('A', {
                events: {
                    'click .salt|.pepper': spy
                },
            
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt'),
                            pepper = el.find('.pepper');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('click');
                        expect(spy.calls.count()).toBe(1);
                        pepper.trigger('click');
                        expect(spy.calls.count()).toBe(2);
                        
                        spy.calls.reset();
                        // this.removeEvent('click .salt');
                        // this.removeEvent('click .pepper');
                        this.removeEvent('click .salt|.pepper');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('click');
                        expect(spy.calls.count()).toBe(0);
                        pepper.trigger('click');
                        expect(spy.calls.count()).toBe(0);
                        
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should remove multiple delegated events from an element', function (done) {
            aldera.view('A', {
                events: {
                    'mouseover|mouseout .salt': spy
                },
            
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(1);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(2);
                        
                        spy.calls.reset();
                        // this.removeEvent('mouseover .salt');
                        // this.removeEvent('mouseout .salt');
                        this.removeEvent('mouseover|mouseout .salt');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(0);
                        
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
        
        it('should remove multiple delegated events from multiple elements', function (done) {
            aldera.view('A', {
                events: {
                    'mouseover|mouseout .salt|.pepper': spy
                },
            
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt'),
                            pepper = el.find('.pepper');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(1);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(2);
                        pepper.trigger('mouseover');
                        expect(spy.calls.count()).toBe(3);
                        pepper.trigger('mouseout');
                        expect(spy.calls.count()).toBe(4);
                        
                        spy.calls.reset();
                        this.removeEvent('mouseover|mouseout .salt|.pepper');
                        
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(0);
                        pepper.trigger('mouseover');
                        expect(spy.calls.count()).toBe(0);
                        pepper.trigger('mouseout');
                        expect(spy.calls.count()).toBe(0);
                        
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
    });
    
    
    describe('removeEvents', function () {
        
        it('should remove a group of events', function (done) {
            var spy = jasmine.createSpy();
        
            aldera.view('A', {
                events: {
                    'click': spy,
                    'mouseover .salt|.pepper': spy,
                    'mouseout .salt': spy,
                    'mouseout .pepper': spy
                },
            
                init: function () {
                    this.render('event', function (el) {
                        var salt = el.find('.salt'),
                            pepper = el.find('.pepper');
                            
                        expect(spy.calls.count()).toBe(0);
                        el.trigger('click');
                        expect(spy.calls.count()).toBe(1);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(2);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(3);
                        pepper.trigger('mouseover');
                        expect(spy.calls.count()).toBe(4);
                        pepper.trigger('mouseout');
                        expect(spy.calls.count()).toBe(5);
                        
                        spy.calls.reset();
                        this.removeEvents([
                            'click',
                            'mouseover .salt|.pepper',
                            'mouseout .salt',
                            'mouseout .pepper'
                        ]);
                        
                        expect(spy.calls.count()).toBe(0);
                        el.trigger('click');
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseover');
                        expect(spy.calls.count()).toBe(0);
                        salt.trigger('mouseout');
                        expect(spy.calls.count()).toBe(0);
                        pepper.trigger('mouseover');
                        expect(spy.calls.count()).toBe(0);
                        pepper.trigger('mouseout');
                        expect(spy.calls.count()).toBe(0);
                        
                        aldera.view('A').remove();
                        done();
                    });
                }
            });
            
            aldera.view('A').create();
        });
    });
});
