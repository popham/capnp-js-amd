define([ "../type" ], function(type) {
    var t = new type.Terminal();
    var Any = function(arena, pointer, depth) {
        this._arena = arena;
        this._pointer = pointer;
        this._depth = depth;
    };
    Any._TYPE = t;
    Any._deref = function(arena, pointer, depth) {
        return new Any(arena, pointer, depth);
    };
    Any.prototype = {
        _TYPE: t
    };
    Any.prototype.cast = function(Derefable) {
        /*
         * No increment on `depth` since the caller of `deref` has already
         * incremented.  `Derefable` is responsible for applying read and depth
         * limits.
         */
        if (Derefable._READER) {
            // User provided a builder--grab its reader and dereference that.
            return Derefable._READER._deref(this._arena, this._pointer, this._depth);
        }
        return Derefable._deref(this._arena, this._pointer, this._depth);
    };
    return Any;
});