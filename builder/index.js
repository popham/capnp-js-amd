define([ "./primitives", "./fields", "./structure", "./group", "./list/index", "./AnyPointer", "./AnyPointerBlob", "./Text", "./Data", "./copy/index", "./zero" ], function(primitives, fields, structure, group, lists, AnyPointer, AnyPointerBlob, Text, Data, copy, zero) {
    return {
        primitives: primitives,
        fields: fields,
        structure: structure,
        group: group,
        lists: lists,
        AnyPointer: AnyPointer,
        AnyPointerBlob: AnyPointerBlob,
        Text: Text,
        Data: Data,
        copy: copy,
        zero: zero
    };
});