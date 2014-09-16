define([ "./copy/index", "./zero", "./structure", "./fields", "./primitives" ], function(copy, zero, structure, fields, primitives) {
    return {
        structure: structure,
        fields: fields,
        primitives: primitives,
        copy: copy,
        zero: zero
    };
});