let move = (num, from, to, temp) => {
  if (num == 0) {
    return
  } else {
    move(num - 1, from, temp, to)
    console.log(`from ${from} to ${to}`)
    move(num - 1, temp, to, from)
  }
}

move(3, 'A', 'C', 'B')