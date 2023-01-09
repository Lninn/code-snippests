export const romanToInt = function(s) {
  const baseReg = /(I|II|III|IV|V|VI|VII|VIII|IX|X|L|C|D|M)$/
  const numReg = /(X|L|C|D|M)$/

  let currentString = s
  const findNext = () => {
    const result = baseReg.exec(currentString)
    if (result) {
      currentString = s.slice(0, result.index)
    }

    return result
  }

  let result
  let index = 0

  const sum = 0

  while (
    result = findNext()
  ) {
    const [str] = result

    const isNum = numReg.test(str)

    console.log(isNum, str)
  }
};
