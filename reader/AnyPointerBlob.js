define([ "../type" ], function(type) {
    var t = new type.Terminal();
    var Any = function() {};
    Any._TYPE = t;
    return Any;
});