const fibIter = (n, a = 0, b = 1) => {
  console.log(`n:${n} a:${a} b:${b}`)
  if (n == 1) {
    return a
  } else if (n == 2) {
    return b
  } else {
    return fibIter(n - 1, b, a + b)
  }
}

const fibRecursion = n => {
  if (n < 2) {
    console.log(`n ${n}`)
    return n
  } else {
    console.log(`n-1 ${n - 1}, n-2 ${n - 2}`)
    return fibRecursion(n - 1) + fibRecursion(n - 2)
  }
}

let t = fibIter(5)

console.log(t)

// 0 1 1 2 3 5