var scaleList = function(list, factor) {
    return list.map(function(subList) {
        if (Array.isArray(subList)) {
            return scaleList(subList, factor)
        } else {
            return subList * factor
        }
    })
}

var list = [1, 2, [3, 4, 5, [6, 7, 8]], 10]

console.log(scaleList(list, 10))