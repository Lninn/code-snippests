import readlineSync from 'readline-sync'

const TAB = '  '

let Look: string

const GetChar = () => {
  Look = readlineSync.question('INPUT: ')
}

const ReportError = (s: string) => {
  console.log('\n')
  console.log('Error: ' + s + '.')
}

const Abort = (s: string) => {
  ReportError(s)
}

const Expected = (s: string) => {
  Abort(s)
}

const Match = (x: string) => {
  if (Look === x) {
    GetChar()
  } else {
    Expected('' + x + '')
  }
}

const isAlpha = (c: string): boolean => {
  const upcaseStr = c.toUpperCase()

  return /[A-Z]/.test(upcaseStr)
}

const isDigit = (c: string): boolean => {
  return /[0-9]/.test(c)
}

const GetName = () => {
  if (!isAlpha(Look)) {
    Expected('Name')
  }

  return Look
}

const GetNum = () => {
  if (!isDigit(Look)) {
    Expected('Integer')
  } else {
    return Look
  }
}

const Emit = (s: string) => {
  console.log(TAB + s)
}

const EmitLn = (s: string) => {
  Emit(s)
  console.log('\n')
}

const Term = () => {
  EmitLn('Move # ' + GetNum() + ', D0')
  GetChar()
}

const Add = () => {
  Match('+')
  Term()
  EmitLn('ADD D1, D0')
}

const Subtract = () => {
  Match('-')
  Term()
  EmitLn('SUB D1, D0')
}

const Expression = () => {
  Term()
  EmitLn('MOVE D0, D1')
  switch (Look) {
    case '+':
      Add
      break
    case '-':
      Subtract()
      break
    default:
      Expected('Addop')
  }
}

const Init = () => {
  GetChar()
}

export const Main = () => {
  Init()
  Expression()
}
