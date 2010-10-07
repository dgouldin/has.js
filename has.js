has = (function(g, d){
    
    // summary: A simple feature detection function/framework.
    //
    // name: String
    //      The name of the feature to detect, as defined by the overall `has` tests.
    //      Tests can be registered via `has.add(testname, testfunction)`. 
    //
    // example:
    //      mylibrary.bind = has("native-bind") ? function(fn, context){
    //          return fn.bind(context);
    //      } : function(fn, context){
    //          return function(){
    //              fn.apply(context, arguments);
    //          }
    //      }
    
    var NON_HOST_TYPES = { "boolean": 1, "number": 1, "string": 1, "undefined": 1 },
        el = d && d.createElement("DiV"),
        prefixes = ["Webkit", "Moz", "O", "ms", "Khtml"],
        testCache = {}
    ;
    
    function has(/* String */name){
        if(typeof testCache[name] == "function"){
            testCache[name] = testCache[name](g, d, el);
        }
        return testCache[name]; // Boolean
    }
    
    function Promise() {
        this.callbacks = [];
        this.result = undefined;

        this.addCallback = function(fn) {
            if (this.result === undefined) {
                this.callbacks.push(fn);
            } else {
                fn(this.result);
            }
        };

        this.done = function(result) {
            if (this.result !== undefined) {
                return;
            }
            this.result = result;
            for (;this.callbacks.length;) {
                this.callbacks.pop()(result);
            }
        };
    }

    function add(/* String */name, /* Function */test, /* Object? */opts){
        // summary: Register a new feature detection test for some named feature
        //
        // name: String
        //      The name of the feature to test.
        //
        // test: Function
        //      A test function to register. If a function, queued for testing until actually
        //      needed. The test function should return a boolean indicating
        //      the presence of a feature or bug, or if it is async, call its promise.done
        //      with the boolean result.
        //
        // opts: Object?
        //      Optional. An object of test options whose properties are defined as:
        //
        //      now: Boolean?
        //          Optional. Omit if `test` is not a function. Provides a way to immediately
        //          run the test and cache the result.
        //
        //      async: Boolean?
        //          Optional. Specifies that the test function is run asynchronously.
        //          Test function returns a promise rather than a boolean result.
        //      
        // example:
        //      A redundant test, testFn with immediate execution:
        //  |       has.add("javascript", function(){ return true; }, { now: true }); 
        //  
        // example:
        //      Again with the redundantness. You can do this in your tests, but we should
        //      not be doing this in any internal has.js tests
        //  |       has.add("javascript", true);
        //
        // example:
        //      Three things are passed to the testFunction. `global`, `document`, and a generic element
        //      from which to work your test should the need arise. 
        //  |       has.add("bug-byid", function(g, d, e){
        //  |           // g = global, typically window, yadda yadda
        //  |           // d == document object
        //  |           // e == the generic element. a `has` element.
        //  |           return false; // fake test, byid-when-form-has-name-matching-an-id is slightly longer
        //  |       });
        var o = {
            now: false,
            async: false
        };
        for (optName in opts) {
            if (opts.hasOwnProperty(optName)) {
                o[optName] = opts[optName];
            }
        }
        var _test = test;
        if (o.async) {
            var p = new Promise();
            _test = function(g, d, el) {
                test(g, d, el, p);
                return p;
            }
        }
        if (o.now) {
            _test = test(g, d, el);
        }
        testCache[name] = _test;
    }
    
    // cssprop adapted from http://gist.github.com/598008 (thanks, ^pi)
    function cssprop(styleName, elem){
        var s, length = prefixes.length,
            capitalized = styleName.charAt(0).toUpperCase() + styleName.slice(1);
        
        if(elem && (s = elem.style)){
            if(typeof s[styleName] == "string"){
                return true;
            }
            while (length--) {
                if(typeof s[prefixes[length] + capitalized] == "string"){
                    return true;
                }
            }
        }
        return false;
    }
    
    function clearElement(elem) {
        if (elem) {
            while (elem.lastChild) {
                elem.removeChild(elem.lastChild);
            }
        }
        return elem;
    }
    
    // Host objects can return type values that are different from their actual
    // data type. The objects we are concerned with usually return non-primitive
    // types of object, function, or unknown.
    function isHostType(object, property) {
        var type = typeof object[property];
        return type == 'object' ? !!object[property] : !NON_HOST_TYPES[type];
    }
    
    //>>excludeStart("production", true);
    function all(){
        // summary: For debugging or logging, can be removed in production. Run all known tests 
        //  at some point in time for the current environment. 
        var ret = {};
        for(var i in testCache){
            try{
                var _ret = has(i);
                if (_ret !== null && typeof _ret === "object") {
                    _ret.addCallback(function(result) {
                        ret[i] = result;
                    });
                } else {
                    ret[i] = _ret;
                }
            }catch(e){
                ret[i] = "error";
                ret[i].ERROR_MSG = e;
            }
        }
        return ret; // Object
    };
    
    has.all = all;
    //>>exlucdeEnd("production");
    has.add = add;
    has.clearElement = clearElement;
    has.cssprop = cssprop;
    has.isHostType = isHostType;

    has.add('is-browser', function(global, document, element){
        return (typeof document != 'undefined' && typeof element != 'undefined' && typeof navigator != 'undefined');
    }, true);
    
    return has;

})(this, document);


