console.log('hello world')

import './parser'

import { Lexer } from './lexer'
import input from './input'

function test(inputStr: string) {
  input.setup(inputStr)
  const lexer = new Lexer()
  
  while(input.isNotEnd()) {
    const token = lexer.scan()
    console.log(token)
  }
}

function main() {
  test(`
    9 -  3  +2
  `)

  console.log('\n')
  
  test(`
  
    const a = 1
    let foo =     334

    var result = foo + 123
  `)
}

main()
