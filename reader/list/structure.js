define([ "./deref", "./methods" ], function(deref, methods) {
    return function(Reader, ct) {
        var Structs = function(arena, depth, list) {
            if (depth > arena.maxDepth) {
                throw new Error("Exceeded nesting depth limit");
            }
            if (list.dataBytes === null) {
                throw new Error("Single bit structures are not supported");
            }
            this._arena = arena;
            this._depth = depth;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._stride = list.dataBytes + list.pointersBytes;
            arena.limiter.read(list.segment, list.begin, this._stride * list.length);
        };
        Structs._CT = Structs.prototype._CT = ct;
        Structs.deref = deref(Structs);
        Structs.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            var position = this._begin + this._stride * index;
            var pointers = position + this._dataBytes;
            /*
             * Do not apply the struct's memory to the traversal limit a second
             * time.
             */
            this._arena.limiter.unread(this._stride);
            return new Reader(this._arena, this._depth + 1, {
                meta: 0,
                segment: this._segment,
                dataSection: position,
                pointersSection: pointers,
                end: pointers + this._pointersBytes
            });
        };
        methods.install(Structs.prototype);
        return Structs;
    };
});