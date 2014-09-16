define([ "./reader/Arena", "./reader/primitives", "./builder/primitives" ], function(Arena, reader, builder) {
    var header = function(arena) {
        var count = arena._segments.length - 1;
        var bytes = new Uint8Array(Math.ceil(count / 2) + 1);
        builder.uint32(count, bytes, 0);
        var i;
        for (i = 0; i < arena._segments.length; ++i) {
            builder.uint32(arena._segments[i]._position >>> 3, bytes, 1 + i << 2);
        }
    };
    var lengths = function(header, blob) {
        if (blob.length < 4) throw new RangeError();
        var ss = [];
        var end = 4 + (reader.uint32(blob, 0) + 1 << 2);
        if (blob.length < end) throw new RangeError();
        for (var i = 0; i < end; i += 4) ss.push(reader.uint32(blob, i));
        return ss;
    };
    return {
        header: header,
        lengths: lengths
    };
});