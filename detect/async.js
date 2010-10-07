(function(has, addtest, cssprop){

    addtest("settimeout-async", function(global, document, anElement, promise){
        setTimeout(function() {
            promise.done(true);
        }, 1000);
    }, {
        async: true
    });

})(has, has.add, has.cssprop);
