define([ "../primitives", "./deref", "./methods" ], function(primitives, deref, methods) {
    var Bools = function(arena, depth, list) {
        this._arena = arena;
        this._depth = depth;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = list.dataBytes;
        this._pointersBytes = list.pointersBytes;
        this._stride = list.dataBytes + list.pointersBytes;
        arena.limiter.read(list.segment, list.begin, Math.ceil(list.length / 8));
    };
    Bools._CT = Bools.prototype._CT = {
        meta: 1,
        layout: 1,
        dataBytes: null,
        pointersBytes: null
    };
    Bools._TYPE = Bools.prototype._TYPE = {};
    Bools.deref = deref(Bools);
    Bools.prototype.get = function(index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }
        if (this._dataBytes === null) {
            // Still single bits.
            return !!primitives.bool(this._segment, this._begin + (index >>> 3), index & 7);
        } else {
            /*
             * There exists a new version that has upgraded to non-single-bit
             * structures.
             */
            return !!(this._segment[this._begin + index * this._stride] & 1);
        }
    };
    methods.install(Bools.prototype);
    return Bools;
});