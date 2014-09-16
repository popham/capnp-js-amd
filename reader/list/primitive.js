define([ "./deref", "./methods" ], function(deref, methods) {
    return function(decoder, ct) {
        var Primitives = function(arena, depth, list) {
            this._arena = arena;
            this._depth = depth;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._stride = list.dataBytes + list.pointersBytes;
            arena.limiter.read(list.segment, list.begin, list.dataBytes * list.length);
        };
        Primitives._CT = Primitives.prototype._CT = ct;
        Primitives._TYPE = Primitives.prototype._TYPE = {};
        Primitives.deref = deref(Primitives);
        Primitives.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            return decoder(this._segment, this._begin + index * this._stride);
        };
        methods.install(Primitives.prototype);
        return Primitives;
    };
});