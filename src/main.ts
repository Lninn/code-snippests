console.log('hello world')

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
  // test(`
  //   9 -  3  +2
  // `)

  // console.log('\n')
  
  test(`
      //test
      
      // 这是一段注释，在代码开头
    
      const a = 1
      let foo =     334

      const isShow = 34 >=45
      const isHideen = 43 <=123
      const isOpen = foo !=isShow
      const isClose = foo == a

      // 这是一段注释，在代码中间

      /* 一段注释   */

      const isFoo = a >12345
      const isBar = a <54321

      var asd = 123 + comment

      /* 一
        段sad
        注asd
        释   */

      /* 一段注释   */

      var result = foo + 123
  `)
}

main()
