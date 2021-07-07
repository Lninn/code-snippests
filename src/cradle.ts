import readlineSync from 'readline-sync'

// Cradle

// 常量定义
const TAB = '  '

// 变量定义
let Look: string

// 从输入流读取一个字符
const GetChar = () => {
  Look = readlineSync.question('INPUT: ')
}

// 报告一个错误
const ReportError = (s: string) => {
  throw new Error('Error: ' + s + '.')
}

const Abort = (s: string) => {
  ReportError(s)
}

// 输出期望的信息
const Expected = (s: string) => {
  Abort(s + ' Expected')
}

const Match = (x: string) => {
  if (Look === x) {
    GetChar()
  } else {
    Expected('"' + x + '"')
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
  EmitLn('MOVE #' + GetNum() + ',D0')
}

const Add = () => {
  Match('+')
  Term()
  EmitLn('ADD D1,D0')
}

const Subtract = () => {
  Match('-')
  Term()
  EmitLn('SUB D1,D0')
  EmitLn('NEG D0')
}

const Expression = () => {
  Term();
  EmitLn('MOVE D0,D1')

  // ??
  GetChar()

  switch (Look) {
    case '+':
      Add()
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
