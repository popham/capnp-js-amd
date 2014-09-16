define([ "./size" ], function(size) {
    var Any = function(arena, pointer, depth) {
        this._arena = arena;
        this._pointer = pointer;
        this._depth = depth;
    };
    Any._TYPE = Any.prototype._TYPE = {};
    Any.deref = function(arena, pointer, depth) {
        return new Any(arena, pointer, depth);
    };
    Any.prototype._bytes = function() {
        return size.blobs(this._arena, this._pointer);
    };
    // Upgrade to fill all fields for settability.
    Any.prototype.getAs = function(Derefable) {
        /*
         * No increment on `depth` since the caller of `deref` has already
         * incremented.
         */
        return Derefable.deref(this._arena, this._pointer, this._depth);
    };
    Any.prototype.initStruct = function(Struct) {};
    Any.prototype.initList = function(List, length) {};
    Any.prototype.set = function(reader) {};
    Any.prototype.adopt = function(orphan) {};
    Any.prototype.disownAs = function(Derefable) {};
    Any.prototype.cast = function(Derefable) {};
    return Any;
});