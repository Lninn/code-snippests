var mul = () => {
  for (let i = 1; i <= 9; i++) {
    let t = ''
    for (let j = 1; j <= i; j++) {
      const x = `${j} * ${i} = ${i * j}`
      t += ' ' + x
    }
    console.log(t)
  }
}

mul()