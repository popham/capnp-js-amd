define([], function() {
    // Float conversion helpers
    var buffer = new ArrayBuffer(8);
    var view = new DataView(buffer);
    return {
        bool: function(bytes, position, bitPosition) {
            return bytes[position] >>> bitPosition & 1 | 0;
        },
        int8: function(bytes, position) {
            return bytes[position] | 0;
        },
        int16: function(bytes, position) {
            return bytes[position] | bytes[position + 1] << 8 | 0;
        },
        int32: function(bytes, position) {
            return bytes[position] | bytes[position + 1] << 8 | bytes[position + 2] << 16 | bytes[position + 3] << 24 | 0;
        },
        uint8: function(bytes, position) {
            return bytes[position] >>> 0;
        },
        uint16: function(bytes, position) {
            return (bytes[position] | bytes[position + 1] << 8) >>> 0;
        },
        uint32: function(bytes, position) {
            return (bytes[position] | bytes[position + 1] << 8 | bytes[position + 2] << 16 | bytes[position + 3] << 24) >>> 0;
        },
        float32: function(bytes, position) {
            var i = 3;
            do {
                buffer[i] = bytes[position + i];
            } while (i--);
            return view.getFloat32(0, true);
        },
        float64: function(bytes, position) {
            var i = 7;
            do {
                buffer[i] = bytes[position + i];
            } while (i--);
            return view.getFloat64(0, true);
        }
    };
});