define([ "./deref", "./methods" ], function(deref, methods) {
    var Voids = function(arena, depth, list) {
        this._arena = arena;
        this._depth = depth;
        this._segment = list.segment;
        this._begin = 0;
        this._length = list.length;
        /*
         * While there may exist a new version, this version only provides
         * nulls.  There's no need to adapt stride, so just use static byte
         * counts.  These have not been moved to the prototype so that this list
         * maintains parallel structure with all of the others.
         */
        this._dataBytes = 0;
        this._pointersBytes = 0;
        this._stride = 0;
    };
    Voids._CT = Voids.prototype._CT = {
        meta: 1,
        layout: 0,
        dataBytes: 0,
        pointersBytes: 0
    };
    Voids._TYPE = Voids.prototype._TYPE = {};
    Voids.deref = deref(Voids);
    Voids.prototype.get = function(index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }
        return null;
    };
    methods.install(Voids.prototype);
    return Voids;
});