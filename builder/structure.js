define([ "../reader/layout/structure", "../reader/methods", "./layout/structure", "./copy/pointer", "./upgrade" ], function(reader, methods, builder, copy, upgrade) {
    return function(Reader) {
        var t = Reader._TYPE;
        var ct = Reader._CT;
        var listCt = Reader._LIST_CT;
        var Structure = function(arena, isOrphan, layout) {
            this._arena = arena;
            this._isOrphan = isOrphan;
            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
        };
        Structure._READER = Reader;
        Structure._TYPE = t;
        Structure._CT = ct;
        Structure._LIST_CT = listCt;
        Structure._adopt = function(arena, pointer, value) {
            if (!value._isOrphan) throw new ValueError("Cannot adopt a non-orphan");
            if (!arena.isEquivTo(value._arena)) throw new ValueError("Cannot adopt from a different arena");
            builder.nonpreallocated(arena, pointer, {
                segment: value._segment,
                position: value._dataSection
            }, value._rt());
            value._arena = null;
        };
        Structure._deref = function(arena, pointer) {
            var instance = new Structure(arena, false, reader.unsafe(arena, pointer));
            // Upgrade the blob if the pointer derived from an old version.
            var rt = instance._rt();
            if (rt.dataBytes < ct.dataBytes || rt.pointersBytes < ct.pointersBytes) {
                upgrade.structure(instance._arena, pointer, ct);
                return new Structure(arena, false, reader.unsafe(arena, pointer));
            }
            return instance;
        };
        Structure._init = function(arena, pointer) {
            var ctSize = ct.dataBytes + ct.pointersBytes;
            var blob = arena._preallocate(pointer.segment, ctSize);
            builder.preallocated(pointer, blob, ct);
            return new Structure(arena, false, reader.unsafe(arena, pointer));
        };
        Structure._initOrphan = function(arena) {
            var ctSize = ct.dataBytes + ct.pointersBytes;
            var blob = arena._allocateOrphan(ctSize);
            return new Structure(arena, true, {
                segment: blob.segment,
                dataSection: blob.position,
                pointersSection: blob.position + ct.dataBytes,
                end: blob.position + ctSize
            });
        };
        Structure._set = function(arena, pointer, value) {
            if (t !== value._TYPE) {
                throw new TypeError();
            }
            copy.setStructPointer(value._arena, value._layout(), arena, pointer);
        };
        Structure.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        Structure.prototype._maskData = function(position, mask) {
            this._segment[this._dataSection + position] &= mask;
        };
        Structure.prototype._zeroData = function(position, length) {
            this._arena._zero({
                segment: this._segment,
                position: this._dataSection + position
            }, length);
        };
        return Structure;
    };
});