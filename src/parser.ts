class Parser {
  lookhead: string

  constructor() {
    this.lookhead = read()
  }

  expr() {
    this.term()
    while(true) {
      if (this.lookhead == '+') {
        this.match('+');this.term();log('+')
      } else if (this.lookhead == '-') {
        this.match('-');this.term();log('-')
      } else {
        return
      }
    }
  }

  term() {
    if (isDigit(+this.lookhead)) {
      log(this.lookhead);this.match(this.lookhead)
    } else {
      throw new Error('syntax error')
    }
  }

  match(t: string) {
    if (this.lookhead === t) {
      this.lookhead = read()
    } else {
      throw new Error('syntax error')
    }
  }
}

function log(...args: any[]) {
  console.log(...args)
}

const inputStr = '9-5+3'
let i = 0
function read() {
  return inputStr[i++]
}

function isDigit(s: any) {
  return typeof s === 'number'
}

function main() {
  const parse = new Parser()
  parse.expr()
}

main()
