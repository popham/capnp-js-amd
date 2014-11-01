define([ "../reader/AnyPointer" ], function(Reader) {
    var t = Reader._TYPE;
    var Any = function(arena, pointer, depth) {
        this._arena = arena;
        this._pointer = pointer;
        this._depth = depth;
    };
    Any._READER = Reader;
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
         * incremented.
         */
        if (!Derefable._READER) {
            /*
             * User provided a reader, so wrap a reader arena around the
             * segments.
             */
            return Derefable._deref(this._arena.asReader(), this._pointer, this._depth);
        }
        return Derefable._deref(this._arena, this._pointer, this._depth);
    };
    return Any;
});