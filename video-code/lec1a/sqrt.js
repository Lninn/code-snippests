const average = (a, b) => {
  return (a + b) / 2
}

const goodEnough = (g, x) => {
  const t = Math.abs(g * g - x)
  return t < 0.00001
}

const makeGuess = (g, x) => {
  const t = average(g, (x / g))
  return t
}

const tryGuess = (g, x) => {
  if (goodEnough(g, x)) {
    return g
  } else {
    const t = makeGuess(g, x)
    return tryGuess(t, x)
  }
}

const sqrt = x => {
  return tryGuess(1, x)
}

const sqrt2 = (x) => {
    let g = x
    while(Math.abs(g * g - x) > 0.000001)
    {
        g = ( g + x / g ) / 2
    }
    return g;
}

console.log(
  sqrt(36)
)