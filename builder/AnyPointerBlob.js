define([ "../reader/AnyPointerBlob", "../reader/isNull", "../reader/layout/any", "../reader/list/meta", "../reader/list/sizes", "./layout/index", "./copy/blob" ], function(Reader, isNull, any, meta, sizes, builder, copy) {
    var t = Reader._TYPE;
    var Any = function(arena, isOrphan, layout) {
        this._arena = arena;
        this._isOrphan = isOrphan;
        this.__layout = layout;
    };
    Any._READER = Reader;
    Any._TYPE = t;
    Any._adopt = function(arena, pointer, value) {
        if (!value._isOrphan) throw new ValueError("Cannot adopt a non-orphan");
        if (!arena.isEquivTo(value._arena)) throw new ValueError("Cannot adopt from a different arena");
        switch (value.__layout.meta) {
          case 0:
            builder.structure(arena, pointer, {
                segment: value.__layout.segment,
                position: value.__layout.dataSection
            }, {
                meta: 0,
                dataBytes: value.__layout.pointersSection - value.__layout.dataSection,
                pointersBytes: value.__layout.end - value.__layout.pointersSection
            });
            break;

          case 1:
            var m = meta(value.__layout);
            builder.list(arena, pointer, {
                segment: value.__layout.segment,
                position: value.__layout.begin - (m.layout === 7 ? 8 : 0)
            }, m);
            break;
        }
        value._arena = null;
    };
    Any.prototype = {
        _TYPE: t
    };
    Any.prototype._rt = function() {
        var ell = this.__layout;
        if (ell.meta === 0) {
            return {
                meta: 0,
                dataBytes: ell.pointersSection - ell.dataSection,
                pointersBytes: ell.end - ell.pointersSection
            };
        } else if (ell.meta === 1) {
            var layout;
            if (ell.dataBytes === null) {
                layout = 1;
            } else if (ell.dataBytes + ell.pointersBytes > 8) {
                layout = 7;
            } else {
                layout = sizes[ell.dataBytes][ell.pointersBytes];
            }
            return {
                meta: 1,
                layout: layout,
                dataBytes: ell.dataBytes,
                pointersBytes: ell.pointersBytes
            };
        }
    };
    Any.prototype._layout = function() {
        return this.__layout;
    };
    return Any;
});