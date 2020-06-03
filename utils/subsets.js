// 返回一个集合的所有子集(包括空集合)
var subsets = function(list) {
    if (list.length == 0) {
        return [[]]
    } else {
        var rest = subsets(list.slice(1))
        return rest.concat(rest.map(function(x) {
            return [list[0], ...x]
        }))
    }
}

var list = [1, 2, 3]

var result = subsets(list)

result.forEach(element => {
    console.log(element)
})

// var rest = [[]]
// var rest = rest.concat(rest.map(x => [3, ...x]))
