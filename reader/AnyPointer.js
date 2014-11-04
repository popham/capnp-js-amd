define([ "../type", "./layout/any", "./isNull" ], function(type, any, isNull) {
    var t = new type.Terminal();
    var Any = function(arena, pointer, depth) {
        this._arena = arena;
        this._pointer = pointer;
        /*
         * The caller is responsible for setting depth.  This parameter just
         * passes through.
         */
        this._depth = depth;
    };
    Any._TYPE = t;
    Any._deref = function(arena, pointer, depth) {
        return new Any(arena, pointer, depth);
    };
    Any.prototype = {
        _TYPE: t
    };
    Any.prototype.getAs = function(Derefable) {
        if (Derefable._READER) {
            // User provided a builder.  Use the associated reader.
            Derefable = Derefable._READER;
        }
        var layout;
        if (isNull(this._pointer) && Derefable._CT.meta === 1) {
            // If the pointer is null, then make up an empty list layout.
            layout = {
                meta: 1,
                segment: this._pointer.segment,
                begin: this._pointer.position,
                length: 0,
                dataBytes: 0,
                pointersBytes: 0
            };
        } else {
            layout = any.safe(this._arena, this._pointer);
        }
        return new Derefable(this._arena, this._depth, layout);
    };
    return Any;
});