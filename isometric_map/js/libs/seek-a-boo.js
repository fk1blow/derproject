/* BetBrain seek.js - stable version */
;(function(alias) {
    var aliased  = (typeof alias === 'string') && alias.length > 1;
    var SK = aliased ? window[alias] = {} : window['SK'] = {};
    var $ = window.jQuery;

    SK.VERSION = '0.4.25';

// -----------------------------------
//                          Namespaces
// -----------------------------------

    SK.app = {};

    SK.data = {
        LocalStorage: null,

        Manager: null,

        Collection: null
    };

    SK.service = {
        Geolocation: null,

        Socket: null,

        Ajax: null
    };

    SK.ui = {
        ViewController: null,

        View: null,

        widget: null
    };

    // display object?
    // SK.UIObject = null;

    SK.util = {};

    SK.model = null;

// -----------------------------------
//                              Object
// -----------------------------------

    // Object.create shim
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    };

    
    // SK.Object
    // ---------
    SK.Object = {
        extend: function() {
            var args = [].slice.call(arguments);
            var mixinObject, extensionObject;
            var Template = Object.create(this);

            mixinObject = [].slice.call(args, 0, args.length - 1);
            extensionObject = args[args.length - 1];

            /* addd the extension, overriding superConstruct properties */
            for(var prop in extensionObject) {
                if(extensionObject.hasOwnProperty(prop))
                    Template[prop] = extensionObject[prop];
            }

            /* add the mixins, if they exist */
            Template.mixin(mixinObject);

            return Template;
        },

        create: function() {
            var instance = Object.create(this);
            if(typeof instance.initialize === 'function')
                instance.initialize.apply(instance, [].slice.call(arguments));
            return instance;
        },

        mixin: function(mixins) {
            if(!arguments.length)
                return false;

            var args = [].slice.call(arguments);
            var argsLen = args.length;
            var asArray = Object.prototype.toString.apply(mixins) === '[object Array]';

            /* if only one mixin function is passed */
            if(typeof mixins === 'function' && argsLen == 1) {
                SK.Mixin.inject(mixins, this);
            /* if a single mixin array of multiple mixins as params */
            } else if((asArray && argsLen == 1) || argsLen > 1) {
                var mixinsArr = (argsLen > 1) ? args : args[0];
                var arrLen = mixinsArr.length;
                for(var i = 0; i < arrLen; i++)
                    SK.Mixin.inject(mixinsArr[i], this);
            }

            return this;
        }
    };

     var createFunctionalMixin = function(mixinObject) {
        return function() {
            /* if the mixin has an [initialize] method
            rename it and delete the mixin property(method) */
            if('initialize' in mixinObject) {
                this['initializeMixin'] = mixinObject.initialize;
                delete mixinObject['initialize'];
            }
            /* now add every other property of the mixin to the "functional" */
            for(var item in mixinObject) {
                if (mixinObject.hasOwnProperty(item))
                    this[item] = mixinObject[item];
            }
            return this;
        }
    };

    // SK.Mixin
    // --------
    SK.Mixin = {
        define: function() {
            var args = Array.prototype.slice.call(arguments);
            return createFunctionalMixin(args[0]);
        },

        inject: function(mixinFunction, targetObject) {
            var init = null;
            /* check the target */
            if(Object.prototype.toString.apply(targetObject) !== '[object Object]')
                throw new TypeError('Mixin target must be of type Object.');

            /* add the mixin by calling the functional mixin on the target's context - targetObject */
            mixinFunction.call(targetObject);  

            /* shortcut to mixin's initialize method */
            init = targetObject.initializeMixin;

            /* check to see if there's a initialize mixin method */
            if(typeof init === 'function') {
                init.call(targetObject);
                delete targetObject.initializeMixin;
            }
        }
    };

// -----------------------------------
//                                Util
// -----------------------------------

    /**
     * Mutates an object's method
     * 
     * @example
     * Util.Mutator({aMethod: function}, {aMethod: function});
     * will simply mutate the aMethod from the template and add "_super" to it
     */
    SK.util.Mutator = {
        wrapObject: function(template, parent) {
            var pp, cp, prop;
            for(prop in template) {
                pp = parent[prop];
                cp = template[prop];
                if(prop in parent && typeof cp === 'function' && cp != pp) {
                    template[prop] = SK.util.Mutator.mutateFunction(cp, pp, parent, template);
                }
            }
        },

        mutateFunction: function(childProp, parentProp, parentCtx, childCtx) {
            return function() {
                this._super = function() {
                    return parentProp.apply(childCtx, arguments);
                };
                this._parent = parentCtx;
                return childProp.apply(this, arguments);
            }
        }
    };

    /**
     * Array utils
     * @type {Object}
     */ 
    SK.util.Array = {
        forEach: function(arr, callback, ctx) {
            if(arr == null)
                return;
            var i, len = arr.length;
            for(i = 0; i < len; i++)
                callback.call(ctx || this, arr[i], i);
        },

        isArray: function(object) {
            return Object.prototype.toString.apply(object) === '[object Array]';
        }
    };

    /**
     * Object utils
     */
    SK.util.Object = {
        /**
         * my.class extend method
         * @author jie http://myjs.fr/my-class/
         * 
         * @param  {Object} obj         target object
         * @param  {Object} extension   template/extension object
         * @param  {Boolean} override   if extension prop overrides the target prop
         */
        include: function(obj, extension, override) {
            var prop;
            if (override === false) {
                for (prop in extension) {
                    if ((prop in obj)) continue;
                    obj[prop] = extension[prop];
                }
            } else {
                for (prop in extension) {
                    obj[prop] = extension[prop];
                    // if (extension.toString !== Object.prototype.toString)
                    //     obj.toString = extension.toString;
                }
            }
            return obj;
        },

        /**
         * Merges two or more objects
         * 
         * @description the merge will overrite previously declaredy attributes
         * @param  {[type]} target the object that should be merged to
         * @return {Object}        target merged object
         */
        merge: function(target) {
            var targetObject = target;
            var extension = Array.prototype.slice.call(arguments, 1);
            // for each object extension, merge into target object
            SK.util.Array.forEach(extension, function(item) {
                if(SK.util.Object.isObject(item) == false)
                    throw new Error('Merged/Extension argument must be of type Object; [SK.util.Object.merge]');
                SK.util.Object.include(target, item || {});
            });
            return target;
        },

        isObject: function(module) {
            return Object.prototype.toString.apply(module) === '[object Object]';
        },

        prepareDefaultAttributes: function(target, defaultOptions) {
            /* if the arguments is an Object */
            if(SK.util.Object.isObject(defaultOptions)) {
                for(var item in defaultOptions) {
                    if(defaultOptions.hasOwnProperty(item))
                        target[item] = defaultOptions[item];
                }
                target._defaultAttributes = defaultOptions;
            /* if it's an Array of attributes, assign to each a value of undefined */
            } else if(SK.util.Array.isArray(defaultOptions)) {
                var len = defaultOptions.length;
                for(var i = 0; i < len; i++) {
                    target[defaultOptions[i]] = undefined;
                }
                target._defaultAttributes = defaultOptions;
            }
        }
    };

    /**
     * @todo
     * TO BE REMOVED
     */
    SK.util.Identifier = (function() {
        var incrementID = 0;

        return {
            getIncrementedId: function(prefix) {
                var _prefix = prefix || '';
                return _prefix + '_' + (incrementID += 1);
            }
        }
    }());

    var eventSplitter = /\s+/;

    /**
     * Observable mixin
     * A slight modification of backbone's Event Object
     * 
     * @author Jeremy Ashkenas, DocumentCloud Inc
     */
    SK.util.Events = SK.Mixin.define({
        bind: function(events, callback, context) {
            var calls, event, list;
            if (!callback) return this;

            events = events.split(eventSplitter);
            calls = this._callbacks || (this._callbacks = {});

            while (event = events.shift()) {
                list = calls[event] || (calls[event] = []);
                list.push(callback, context || this);
            }

            return this;
        },

        unbind: function(events, callback, context) {
            var event, calls, list, i;

            // No events, or removing *all* events.
            if (!(calls = this._callbacks)) return this;
            if (!(events || callback || context)) {
                delete this._callbacks;
                return this;
            }

            events = events.split(eventSplitter);

            // Loop through the callback list, splicing where appropriate.
            while (event = events.shift()) {
                list = calls[event];

                if (!(list = calls[event]) || !(callback || context)) {
                    delete calls[event];
                    continue;
                }

                for (i = list.length - 2; i >= 0; i -= 2) {
                    if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                        list.splice(i, 2);
                    }
                }
            }

          return this;
        },

        fire: function(events) {
            var event, calls, list, i, length, args, all, rest;
            if (!(calls = this._callbacks)) return this;

            rest = [];
            events = events.split(eventSplitter);
            for (i = 1, length = arguments.length; i < length; i++) {
                rest[i - 1] = arguments[i];
            }

            while (event = events.shift()) {
                // Copy callback lists to prevent modification.
                if (list = calls[event])
                    list = list.slice();

                if (list) {
                    for (i = 0, length = list.length; i < length; i += 2) {
                        list[i].apply(list[i + 1] || this, rest);
                    }
                }
            }

            return this;
        }
    });

    /**
     * Adds a convenient and safe method
     * to use the console even in browser that don't support it
     * 
     * @author Paul Irish, linked from http://www.jquery4u.com/snippets/lightweight-wrapper-firebug-console-log/#.T-2xA-HWRhE
     */
    SK.util.Logger = SK.Object.extend({
        TYPE: 'Logger',

        _instance: null,

        _console: null,

        _enabled: true,

        initialize: function(options) {
            if(!options || options && options.singleton !== true)
                throw new Error('Unable to initialize Object! Logger is a singleton.');
            this._prepareConsole();
        },

        getInstance: function() {
            return this._instance || SK.util.Logger.create({ singleton: true });
        },

        _prepareConsole: function() {
            this._console = window.console;
            // if the browser does not support console(IE, mobiles, etc)
            if(this.consoleUnavailable())
                this._clearUndefinedConsole();
        },

        _clearUndefinedConsole: function() {
            var c = this._console || {};
            for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)c[a]=c[a] || function() {};
            // is it safe?!
            this._console = c;
        },

        disablePrinter: function() {
            window.console = window.console || {};
            var c = function(){};
            for(var d="info,debug,error,log".split(","), a; a=d.pop();)
                window.console[a]=c;
            return true;
        },

        consoleUnavailable: function() {
            return typeof (window.console !== 'undefined');
        },

        /* Now, for every console method, check if it's a function(Because IE that's why) */

        debug: function() {
            if(typeof this._console.debug === 'function')
                this._console.debug.apply(console, [].slice.call(arguments));
        },

        info: function() {
            if(typeof this._console.info === 'function')
                this._console.info.apply(console, [].slice.call(arguments));
        },

        warn: function() {
            if(typeof this._console.warn === 'function')
                this._console.warn.apply(console, [].slice.call(arguments));
        },

        error: function() {
            if(typeof this._console.error === 'function')
                this._console.error.apply(console, [].slice.call(arguments));
        }
    });

    /**
     * Accessor methods
     */
    SK.util.Accessible = SK.Mixin.define({
        _defaultAttributes: null,

        _previousAttributes: null,

        get: function(attr) {
            return this[attr];
        },

        set: function(attr, value) {
            var attributes, item, previous = {},
                attrChanged = this.attributeChanged || function() {};

            if(SK.util.Object.isObject(attr)) {
                attributes = attr;
            } else {
                attributes = {};
                attributes[attr] = value;
            }

            for(item in attributes) {
                if(attributes.hasOwnProperty(item)) {
                    previous[item] = this[item];
                    this[item] = attributes[item];
                    attrChanged(item);
                }
            }

            this._previousAttributes = previous;

            return this;
        },

        getPreviousAttributes: function(attr) {
            if(!arguments.length || !this[attr])
                return this._previousAttributes;
            return this._previousAttributes[attr];
        },

        /**
         * @todo
         * TO BE REMOVED
         */
        getDefaults: function() {
            return this._defaultAttributes;
        },

        /**
         * @todo
         * TO BE REMOVED
         */
        setDefaults: function(defaultOptions) {
            /* if the arguments is an Object */
            if(SK.util.Object.isObject(defaultOptions)) {
                for(var item in defaultOptions) {
                    if(defaultOptions.hasOwnProperty(item))
                        this[item] = defaultOptions[item];
                }
                this._defaultAttributes = defaultOptions;
            /* if it's an Array of attributes, assign to each a value of undefined */
            } else if(SK.util.Array.isArray(defaultOptions)) {
                var len = defaultOptions.length;
                for(var i = 0; i < len; i++) {
                    this[defaultOptions[i]] = undefined;
                }
                this._defaultAttributes = defaultOptions;
            }

            return this;
        }
    });

// -----------------------------------
//                                View
// -----------------------------------

    /**
     * SK.view
     * 
     * @description similar to a Backbone.View object
     */
    SK.ui.View = SK.Object.extend(SK.util.Events, {
        TYPE: 'View',

        /**
         * Debug attached dom (delegated) events
         * @type {Boolean}
         */
        debug: false,

        /**
         * The jQuery (dom) element associated with the View
         * @type {Object}
         */
        el: null,

        /**
         * Pseudo ideftifier
         * @type {Integer}
         */
        cid: null,

        /**
         * parent view of this instance
         * @type {Object}
         */
        parent: null,

        /**
         * View events object
         * @type {Object}
         */
        events: null,

        /**
         * Holds data about the views primary attributes - [el], [events], [binds]
         * @type {[type]}
         */
        _refreshData: null,

        /**
         * Initialize and configure the instance
         * @param  {Object} defaults an object representing additional args passed at Object.create
         */
        setup: function(defaults) {},

        /**
         * View initializing method
         * @param  {[type]} defaults additional params passed to the View.create
         */
        initialize: function(defaults) {
            // configure initialization options... if any
            SK.util.Object.prepareDefaultAttributes(this, defaults || {});

            // set identifier
            this.cid = SK.util.Identifier.getIncrementedId(this['TYPE']);

            // some simple validations
            this._validateSelector();

            // Add events to target
            this.attachEvents();

            // prepare refresh data
            this._prepareForRefresh();

            // calls the View pseudo constructor
            // if more than one argument, use method.apply
            // else call the method passing the defaults param
            if(arguments.length > 1)
                this.setup.apply(this, [].slice.call(arguments));
            else
                this.setup(defaults);
        },

        /**
         * Reattaches [this.el] to the View Object reattaching the events along with it
         * 
         * @return {Object} [this]
         */
        resetElement: function() {
            /* the new jQuery object */
            var newEl = $(this._refreshData.selector);
            /* if the new element is not an instance of jQuery */
            if(!(newEl instanceof jQuery))
                return false;
            /* notify */
            this.fire('before:resetElement');
            /* unbind [this.el] events */
            this.el.unbind();
            /* nullify the object [this.el] */
            if(this.el instanceof jQuery)
                this.el = null;
            /* reassigns [el] or current */
            this.el = newEl;
            /* some simple validations */
            this._validateSelector();
             /* Add events to target */
            this.attachEvents();
            /* notify */
            this.fire('after:resetElement');
            return this;
        },

        /**
         * Unbinds all possible events from the view
         * First, will try to unbind SK.util.Events callbacks and then tries
         * to unbind every jQuery event from [this.el]
         */
        dettachElementEvents: function() {
            this.fire('before:dettachElementEvents');
            if(this.el instanceof jQuery)
                this.el.unbind();
            return this;
        },

        /**
         * Removes this.el from the DOM and everything inside it() and 
         * al bound events and jQuery data associated with the elements are removed.(jQuery docs)
         */
        destroy: function() {
            this.fire('before:destroy');
            /* remove SK observables */
            this.dettachElementEvents();
            /* remove/unbind all SK.util.Events */
            this.unbind()
            /* removes the element from dom and everything associated with it */
            if(this.el != null)
                this.el.remove();
            /* nullify el */
            this.el = null;
        },

        /**
         * Delegates "this.el.events" to child elements through "this.events" object
         * @return {undefined}
         * @todo move method inside SK.Util.View
         */
        attachEvents: function() {
            var key, events = this.events, splitter = /^(\S+)\s*(.*)$/;
            // now start assingning the events
            for(key in events) {
                if(!events.hasOwnProperty(key))
                    continue;
                // key matches; [object, event, target]
                var matches = key.match(splitter);
                // callback method - either this.method or the inline one
                var callback = this[events[key]] || events[key];
                // delegates selector
                var selector = matches[2];
                // event type
                var event = matches[1];
                // What happens if the selector is missing? Should it binds directly to this.el
                // or just leave it be?! Should the selector be mandatory forcing the user on el.delegate?!
                // Applies the delegate to the appropriate selector
                (function(selector, event, callback, ctx) {
                    jQuery(ctx.el).on(event, selector, function(evt) {
                        callback.call(ctx, evt);
                    });
                }(selector, event, callback, this));
            }
            events = null;
        },

        /**
         * @todo REFACTOR
         * 
         * @return {Bool} view instance validation
         */
        _validateSelector: function() {
            var isJqueryInstance = (this.el instanceof jQuery);
            var selectorHasEntries = (isJqueryInstance && this.el.length > 0);
            
            /* validate */
            if(!isJqueryInstance) {
                SK.util.Logger.getInstance().warn('View.el should be a jQuery object; current state is :: ',
                    '{' + typeof this.el + '}', this.el);
                return false;
            }

            if(!selectorHasEntries) {
                SK.util.Logger.getInstance().warn('Unable to find an element matching :: ', this.el.selector);
                return false;
            }

            return true;
        },

        /**
         * Prepares an object containing [this.events] and [this.el] for refreshing
         */
        _prepareForRefresh: function() {
            this._refreshData = {
                selector: this.el.selector,
                events: this.events
            }
        }
    });

// -----------------------------------
//                          Controller
// -----------------------------------

    SK.ui.ViewController = SK.Object.extend(SK.util.Events, {
        TYPE: 'ViewController',

        /**
         * Pseudo ideftifier
         * @type {Integer}
         */
        cid: null,

         /**
         * Initialize and configure the instance
         * @param  {Object} defaults an object representing additional args passed at Object.create
         */
        setup: function(defaults) {},

        /**
         * The view instance
         * @type {Object}
         */
        view: null,

        /**
         * Children controller objects
         * Should this be a list of objects or plain instances?!
         * 
         * @type {Object} Object
         */
        _childViewControllers: null,

        /**
         * The parent viewController object
         * 
         * @type {Object}
         */
        _parentViewController: null,

        /**
         * Constructor
         * @param  {Mixed} default attributes
         */
        initialize: function(defaults) {
           SK.util.Object.prepareDefaultAttributes(this, defaults || {});

            // set identifier
            this.cid = SK.util.Identifier.getIncrementedId(this['TYPE']);

            // the children controller/s
            this._childViewControllers = {};

            // call setup initializer
            if(arguments.length > 1) {
                this.setup.apply(this, [].slice.call(arguments));
            } else {
                this.setup(defaults);
            }
        },

        /**
         * Adds a child viewController
         * 
         * @description queries the [this._childViewControllers] to find out if
         * the controller already resides and if not, it creates it
         * 
         * @param {String} controllerId    controller string identifier
         * @param {Object} childController the actual object to be created and inserted as a child
         * @param {Object} options         an options argument for the child viewController
         */
        addChildViewController: function(controllerId, childController, options) {
            /* check childController object reference */
            if(! SK.util.Object.isObject(childController))
                throw new TypeError('childController argument must be of type Object.');
            /* check options object argument */
            if(options && ! SK.util.Object.isObject(options))
                throw new TypeError('options argument argument must be of type Object.');
            
            /* not sure if this (and the removal from the parent) 
            should be done implicitly or by the user*/
            // var options = options || {};
            // options._parentViewController = this;
            
            /* if not in [this.childViewController], create it */
            if(! (controllerId in this._childViewControllers))
                this._childViewControllers[controllerId] = childController.create(options);
            return this._childViewControllers[controllerId];
        },

        /**
         * Removes a child from the current viewController
         * 
         * @description finds the child(if exists), calls the destroy method and then
         * nullifies the reference from [this._childViewControllers]
         * 
         * @param  {String} controllerId    controller string identifier
         */
        removeChildViewController: function(controllerId) {
            var options = options || {};
            if(controllerId in this._childViewControllers) {
                this._childViewControllers[controllerId].destroy();
                delete this._childViewControllers[controllerId];
            }
            return this;
        },

        removeFromParentViewController: function() {
            //
        },

        /**
         * Returns the child viewController
         * 
         * @param  {String} controllerId controller string identifier 
         * @return {Mixed}              viewController or undefined
         */
        getChildViewController: function(controllerId) {
            return this._childViewControllers[controllerId];
        },

        loadView: function() {
            //
        },

        unloadView: function() {
            //
        },

        /**
         * Destroys all the childViewController and their respective childViews,
         * then destroys the current view(by calling this.view.destroyView)
         * and resets the [childViewController] to a blank new object
         * 
         * @return {Object} [this]
         */
        destroy: function() {
            // this.removeFromParentViewController();
            // delete this._parentViewController;
            var subControllers = this._childViewControllers;
            for(var controller in subControllers) {
                if(subControllers.hasOwnProperty(controller)) {
                    subControllers[controller].destroy();
                    delete this._childViewControllers[controller];
                }
            }
            this._childViewControllers = {};
            this.unbind()
            this.destroyChildView();
            return this;
        },

        /**
         * Destroys the view child by calling its destroy method
         */
        destroyChildView: function() {
            if(this.view)
                this.view.destroy();
            return this;
        }
    });

// -----------------------------------
//                            Services
// -----------------------------------

    SK.service.Geolocation = SK.Object.extend({
        initialize: function() {
            //
        },

        locationEnabled: function() {
            return !!(navigator.geolocation);
        },

        getPosition: function(success, error, options) {
            if(typeof success !== 'function')
                return null;
            var self = this;
            navigator.geolocation.getCurrentPosition(function(pos) {
                success.call(self, pos.coords);
            }, error, options);
        },

        getLatitude: function(success, error) {
            var self = this;
            this.getPosition(function(pos) {
                success.call(this, pos.latitude);
            }, error);
        },

        getLongitude: function(success, error) {
            var self = this;
            this.getPosition(function(pos) {
                success.call(this, pos.longitude);
            }, error);
        },

        getAltitude: function(success, error) {
            var self = this;
            this.getPosition(function(pos) {
                success.call(this, pos.altitude);
            }, error);
        }

        /*getAddress: function(position) {
            //
        },

        getCountry: function(position) {
            //
        },

        getCity: function(position) {
            //
        }*/
    });

    /**
     * @todo  Refactor/Rethink
     */
    SK.service.Ajax = {
        /* THESE options shouldn't be declared on the Ajax global object.
           Instead, try to pass them as params(in case a Model wants it) */
        defaultOptions: {
            contentType: 'application/json',
            dataType: 'json',
            processData: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        },

        get: function(options) {
            options.type = 'GET';
            this._doRequest(options);
        },

        post: function(options) {
            options.type = 'POST';
            this._doRequest(options);
        },

        put: function(options) {
            options.type = 'PUT';
            this._doRequest(options);
        },
        
        /**
         * Because fuck you Internet Explorer, that's why
         * IE8 (don't know if other versions as well) expects 
         * an identifier (an object's property) in order to be deleted
         */
        destroy: function(options) {
            options.type = 'DELETE';
            this._doRequest(options);
        },

        _doRequest: function(options) {
            return $.ajax.apply(this, [].slice.call(arguments));
        }
    };

// -----------------------------------
//                             Manager
// -----------------------------------

    SK.data.Manager = {
        _stack: null,

        register: function(id, obj) {
            this._stack = this._stack || {};
            if(!arguments.length || !id)
                throw new Error('Manager.register -> unable to register without an id!');
            if(id in this._stack)
                throw new Error('Manager.register -> object already registerd!');
            this._stack[id] = obj;
            return this;
        },

        unregister: function(id) {
            if(this._stack == null) {
                this._stack = {};
                return null;
            }
            if(!arguments.length || !id)
                throw new Error('Manager.unregister -> unable to unregister witouht an id!');
            // not sure if safer this way
            this._stack[id] = null;
            delete this._stack[id];
            return true;
        },

        find: function(id) {
            if(!arguments.length || !id)
                return null;
            return this._stack[id];
        },

        all: function() {
            return this._stack;
        }
    };

// -----------------------------------
//                         Application
// -----------------------------------

    SK.app.Window = SK.Object.extend(SK.util.Events, {
        initialize: function() {
            this._buildResizeHandler();
            this._buildEscKeyHandler();
            this._createScrollHandler();
        },

        getDimensions: function() {
            var dimensions = {};
            dimensions.width = $(window).width();
            dimensions.height = $(window).height();  
        },

        _buildResizeHandler: function() {
            var resizeTickerTimeout, resizeTickerFirst = 0, self = this;

            $(window).resize(function() {
                if(resizeTickerFirst == 0) {
                    self.fire('window:resize_started');
                }
                clearTimeout(resizeTickerTimeout);
                resizeTickerTimeout = setTimeout(function() {
                    self.fire('window:resize_ended');
                    resizeTickerFirst = 0;
                }, 500);
                resizeTickerFirst = 1;
            });
        },

        _buildEscKeyHandler: function() {
            var self = this;
            $(window).keydown(function(evt) {
                if(evt.keyCode == 27) { // ESC
                    evt.preventDefault();
                    // self.keyEscPressed.dispatch();
                    self.fire('window:esc_pressed');
                }
            });
        },

        /* Thanks again, IE */
        _createScrollHandler: function() {
            var self = this;
            $(window).scroll(function() {
                self.fire('window:scrolled');
            });
        }
    });

    SK.app.Document = SK.Object.extend(SK.util.Events, {
        initialize: function() {
            this._createScrollHandler();
        },

        getDimensions: function() {
            var dimensions = {};
            dimensions.width = $(document).width();
            dimensions.height = $(document).height();
        },

        _createScrollHandler: function() {
            var self = this;
            $(document).scroll(function() {
                self.fire('document:scrolled');
            });
        }
    });
    
    SK.app.Application = SK.Object.extend(SK.util.Events, {
        TYPE: 'Application',

        logger: null,

        _zoneStack: null,

        _namespace: null,

        // not sure if .window is better than .windowHelper xd
        window: null,

        // not sure if the above applies here
        document: null,

        manager: null,

        initialize: function(zones) {
            this._zoneStack = {};
            this.window = SK.app.Window.create();
            this.document = SK.app.Document.create();
            this.logger = SK.util.Logger.getInstance();
            this.manager = SK.data.Manager;

            if(SK.util.Object.isObject(zones))
                this.prepareZones(zones);
        },

        /**
         * Starts to create the zone controllers(if any)
         * By default, the "Default" zone will be instantiated first
         */
        start: function() {
            this.logger.info('Application started!');
            this._buildZones();
        },

        getZone: function(name) {
            return SK.Manager.get(name);
        },

        prepareZones: function(zones) {
            for(var module in zones) {
                if(zones.hasOwnProperty(module))
                    this.addZone(module, zones[module])
            }
        },

        addZone: function(name, module) {
            if(SK.util.Object.isObject(module) == false || typeof module.create !== 'function')
                throw new TypeError('Zone Module must be of type Object and extend SK.Object!');
            this._zoneStack[name] = module;
        },

        _buildZones: function() {
            var zones = this._zoneStack, module;
            if('Default' in zones) {
                this.manager.register('Default', zones['Default'].create());
                // this._instanceStack['Default'] = zones['Default'].create();
                delete this._zoneStack['Default'];
            }
            for(module in zones) {
                if(zones.hasOwnProperty(module))
                    if(module == 'Default')
                        continue;
                    // this._instanceStack[module] = zones[module].create();
                    this.manager.register(module, zones[module].create());
            }
        }
    });

    // backwords compatible
    SK.Application = SK.app.Application;

}('SK'));
