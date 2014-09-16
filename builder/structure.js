define([ "../reader/layout/structure", "../reader/isNull", "./layout/structure", "./upgrade", "./zero" ], function(reader, isNull, layout, upgrade, zero) {
    return function(Reader, ct) {
        var Type = function(arena, depth, structure) {
            this._arena = arena;
            this._depth = depth;
            this._segment = structure.segment;
            this._dataSection = structure.dataSection;
            this._pointersSection = structure.pointersSection;
            this._end = structure.end;
        };
        Type._READER = Reader;
        Type._CT = ct;
        Type._TYPE = Reader._TYPE;
        Type.deref = function(arena, pointer, depth) {
            var instance = new Type(arena, depth, reader.unsafe(arena, pointer));
            // Upgrade the blob if the pointer derived from an old version.
            var rt = instance._rt();
            if (rt.dataBytes < ct.dataBytes || rt.pointersBytes < ct.pointersBytes) {
                upgrade.structure(instance._arena, pointer, ct);
                return new Type(arena, depth, reader.unsafe(arena, pointer));
            }
            return instance;
        };
        Type.initOrphan = function(arena) {
            // Create and return an orphan in arena
            var blob = arena._allocateOrphan(ct.dataBytes + ct.pointersBytes);
            return new Type(arena, 0, reader.unsafe(arena, pointer));
        };
        Type.init = function(arena, pointer, depth) {
            if (isNull(pointer.segment, pointer.position)) {
                var blob = arena.preallocate(pointer.segment, ct.dataBytes + ct.pointersBytes);
                structure.preallocated(pointer, blob, ct);
                return Type.deref(arena, pointer, depth);
            }
            // If there's existing data, it all needs to be zeroed (including
            // possibly newer versioned fields).
            var instance = Type.deref(arena, pointer, depth);
            zero.structure(arena, instance._layout());
            return instance;
        };
        Type.prototype._rt = Reader.prototype._rt;
        Type.prototype._layout = Reader.prototype._layout;
        Type.prototype._maskData = function(position, mask) {
            this._segment[this._dataSection + position] &= mask;
        };
        Type.prototype._zeroData = function(position, length) {
            this._arena._zero({
                segment: this._segment,
                position: position
            }, length);
        };
        return Type;
    };
});