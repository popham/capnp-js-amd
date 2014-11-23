define([ "../reader/Text", "./list/statics", "./list/methods", "./layout/list" ], function(Reader, statics, methods, layout) {
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Text = function(arena, isOrphan, layout) {
        this._arena = arena;
        this._isOrphan = isOrphan;
        this._segment = layout.segment;
        this._begin = layout.begin;
        this._length = layout.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };
    Text._READER = Reader;
    Text._TYPE = t;
    Text._CT = ct;
    Text._decode = Reader._decode;
    // http://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string#answer-17192845
    Text._encode = function(string) {
        string = unescape(encodeURIComponent(string));
        var uintArray = new Uint8Array(string.length);
        for (var i = 0; i < string.length; ++i) {
            uintArray[i] = string.charCodeAt(i);
        }
        return uintArray;
    };
    Text._deref = statics.deref(Text);
    Text._adopt = statics.adopt(Text);
    Text._init = statics.init(Text);
    Text._initOrphan = statics.initOrphan(Text);
    Text._setParams = function(value) {
        if (t === value._TYPE) {
            return {
                source: {
                    segment: value._segment,
                    position: value._begin
                },
                length: value._length - 1
            };
        } else if (typeof value === "string") {
            var segment = Text._encode(value);
            return {
                source: {
                    segment: segment,
                    position: 0
                },
                length: segment.length
            };
        } else {
            throw new TypeError();
        }
    };
    Text._set = function(arena, pointer, params) {
        var blob = arena._preallocate(pointer.segment, params.length + 1);
        arena._write(params.source, params.length, blob);
        layout.preallocated(pointer, blob, ct, params.length + 1);
    };
    Text.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Text.prototype.asBytesNull = function() {
        return this._segment.subarray(this._begin, this._begin + this._length);
    };
    Text.prototype.asBytes = function() {
        return this._segment.subarray(this._begin, this._begin + this._length - 1);
    };
    Text.prototype.toString = function() {
        return Reader._decode(this.asBytes());
    };
    return Text;
});