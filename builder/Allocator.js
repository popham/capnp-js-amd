define([ "./Arena" ], function(Arena) {
    var Allocator = function() {};
    Allocator.allocate = function(bytes) {
        var segment = new Uint8Array(bytes);
        return segment;
    };
    Allocator.prototype.createArena = function(size) {
        return new Builder(Allocator.allocate, size);
    };
    Allocator.prototype.initRoot = function(Struct) {
        var arena = this.createArena();
        return arena.initRoot(Struct);
    };
    Allocator.prototype.setRoot = function(reader) {
        var arena = this.createArena();
        return arena.setRoot(reader);
    };
    return Allocator;
});