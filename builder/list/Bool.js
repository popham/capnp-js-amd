define([ "../../reader/list/Bool", "../../reader/layout/list", "../copy/pointer", "../layout/list", "./statics", "./methods", "../primitives" ], function(Reader, reader, copy, builder, statics, methods, primitives) {
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Bools = function(arena, layout, isDisowned) {
        this._arena = arena;
        this._isDisowned = isDisowned;
        this._segment = layout.segment;
        this._begin = layout.begin;
        this._length = layout.length;
        this._dataBytes = layout.dataBytes;
        this._pointersBytes = layout.pointersBytes;
        this._stride = layout.dataBytes + layout.pointersBytes;
    };
    Bools._READER = Reader;
    Bools._TYPE = t;
    Bools._CT = ct;
    Bools._adopt = statics.adopt(Bools);
    Bools._deref = statics.deref(Bools);
    Bools._init = function(arena, pointer, length) {
        var ell = (length >>> 3) + (length & 7 ? 1 : 0);
        var blob = arena._preallocate(pointer.segment, ell);
        builder.preallocated(pointer, blob, Bools._CT, length);
        return Bools._deref(arena, pointer);
    };
    Bools._initOrphan = function(arena, length) {
        var ell = (length >>> 3) + (length & 7 ? 1 : 0);
        var blob = arena._allocate(ell);
        return new Bools(arena, {
            segment: blob.segment,
            begin: blob.position,
            length: length,
            dataBytes: ct.dataBytes,
            pointersBytes: ct.pointersBytes
        }, true);
    };
    Bools._set = statics.set(Bools);
    Bools.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Bools.prototype.length = function() {
        return this._length;
    };
    Bools.prototype.get = Reader.prototype.get;
    Bools.prototype.set = function(index, value) {
        if (typeof value !== "boolean") {
            throw new TypeError();
        }
        primitives.bool(value, this._segment, this._begin + (index >>> 3), index & 7);
    };
    return Bools;
});