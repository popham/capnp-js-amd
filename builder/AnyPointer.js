define([ "../reader/AnyPointer", "../reader/isNull", "./copy/pointer", "./AnyPointerBlob" ], function(Reader, isNull, copy, Blob) {
    var t = Reader._TYPE;
    var Any = function(arena, pointer) {
        this._arena = arena;
        this._pointer = pointer;
    };
    Any._READER = Reader;
    Any._TYPE = t;
    Any._deref = function(arena, pointer) {
        return new Any(arena, pointer);
    };
    Any._set = function(arena, pointer, value) {
        if (value._TYPE === t) {
            if (value._arena.IS_READER) {
                console.log("No read limits have been applied :(");
            }
            copy.pointer.setAnyPointer(value._arena, value._pointer, arena, pointer);
        } else {
            if (value._arena.IS_READER) {
                console.warn("No read limits have been applied :(");
            }
            var layout = value._layout();
            switch (layout) {
              case 0:
                copy.pointer.setStructPointer(value._arena, layout, arena, pointer);
                break;

              case 1:
                copy.pointer.setListPointer(value._arena, layout, arena, pointer);
                break;
            }
        }
    };
    Any.prototype = {
        _TYPE: t
    };
    Any.prototype.getAs = function(Derefable) {
        var arena = this._arena;
        if (!Derefable._READER) {
            /*
             * User provided a reader.  Wrap a reader arena around the builder
             * arena's data to parametrize the Derefable.
             */
            arena = arena.asReader();
        }
        return Derefable._deref(arena, this._pointer);
    };
    Any.prototype.initAs = function(Derefable) {
        if (!Derefable._READER) throw new TypeError("Cannot initialize an AnyPointer with a reader type");
        return Derefable._init(this._arena, this._pointer);
    };
    Any.prototype.cloneAsOrphan = function() {
        return Blob._cloneAsOrphan(this._arena, this._pointer);
    };
});