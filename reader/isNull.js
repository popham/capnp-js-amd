define([], function() {
    return function(segment, position) {
        return !(segment[position] || segment[position + 1] || segment[position + 2] || segment[position + 3] || segment[position + 4] || segment[position + 5] || segment[position + 6] || segment[position + 7]);
    };
});