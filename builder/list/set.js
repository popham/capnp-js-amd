define([ "../copy/pointer", "../layout/list" ], function(copy, list) {
    return function(List) {
        return function(arena, pointer, value) {
            if (!List._TYPE.equiv(value._TYPE)) {
                throw new TypeError();
            }
            copy.setListPointer(value._arena, value._layout(), arena, pointer);
        };
    };
});