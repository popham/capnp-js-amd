define([ "./layout/structure" ], function(layout) {
    return function(ct) {
        var Type = function(arena, depth, structure) {
            if (depth > arena.maxDepth) {
                throw new Error("Exceeded nesting depth limit");
            }
            this._arena = arena;
            this._depth = depth;
            this._segment = structure.segment;
            this._dataSection = structure.dataSection;
            this._pointersSection = structure.pointersSection;
            this._end = structure.end;
            arena.limiter.read(structure.segment, structure.dataSection, structure.end - structure.dataSection);
        };
        Type._CT = Type.prototype._CT = ct;
        Type._TYPE = Type.prototype._TYPE = {};
        Type.deref = function(arena, pointer, depth) {
            return new Type(arena, depth, layout.safe(arena, pointer));
        };
        Type.prototype._rt = function() {
            return {
                meta: 0,
                dataBytes: this._pointersSection - this._dataSection,
                pointersBytes: this._end - this._pointersSection
            };
        };
        Type.prototype._layout = function() {
            return {
                meta: 0,
                segment: this._segment,
                dataSection: this._dataSection,
                pointersSection: this._pointersSection,
                end: this._end
            };
        };
        return Type;
    };
});