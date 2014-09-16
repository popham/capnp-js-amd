define([ "../primitives", "./primitive", "./structure", "./pointer", "./types", "./sizes" ], function(decode, primitive, structure, pointer, types, sizes) {
    var primitiveCt = function(dataBytes) {
        return {
            meta: 1,
            layout: sizes[dataBytes][0],
            dataBytes: dataBytes,
            pointersBytes: 0
        };
    };
    return {
        structure: structure,
        pointer: pointer,
        Text: types.Text,
        Data: types.Data,
        Void: types.Void,
        Bool: types.Bool,
        Int8: primitive(decode.int8, primitiveCt(1)),
        Int16: primitive(decode.int16, primitiveCt(2)),
        Int32: primitive(decode.int32, primitiveCt(4)),
        Int64: primitive(decode.int64, primitiveCt(8)),
        UInt8: primitive(decode.uint8, primitiveCt(1)),
        UInt16: primitive(decode.uint16, primitiveCt(2)),
        UInt32: primitive(decode.uint32, primitiveCt(4)),
        UInt64: primitive(decode.uint64, primitiveCt(8)),
        Float32: primitive(decode.float32, primitiveCt(4)),
        Float64: primitive(decode.float64, primitiveCt(8))
    };
});