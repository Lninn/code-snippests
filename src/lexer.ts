import input from './input'
import character from './character'


class Lexer {
  public line: number = 1
  private peek: string = ' '
  private words: Map<string, Word> = new Map()

  constructor() {
    this.reserve(new Word(Tag.TRUE, 'true'))
    this.reserve(new Word(Tag.FALSE, 'false'))
  }

  reserve(t: Word) {
    this.words.set(t.lexeme, t)
  }

  public scan(): Token {
    for(;;(this.peek = input.read())) {
      if (this.peek == ' ' || this.peek == '\t') continue
      else if (this.peek === '\n') this.line += 1
      else break
    }

    if (character.isDigit(this.peek)) {
      let v = 0
      do {
        v = 10 * v + (+this.peek)
        this.peek = input.read()
      } while(character.isDigit(this.peek))
      return new Num(v)
    }

    if (character.isLetter(this.peek)) {
      let b: string = ''
      do {
        b+= this.peek
        this.peek = input.read()
      } while(character.isLetterOrDigit(this.peek))
      const s = b
      let w = this.words.get(s)
      if (w) return w
      w = new Word(Tag.ID, s)
      this.words.set(s, w)
      return w
    }

    const t = new Token(this.peek)
    this.peek = ' '
    return t
  }
}

const enum Tag {
  NUM = 256,
  ID = 257,
  TRUE = 258,
  FALSE = 259,
}

class Token {
  public tag: Tag | string
  constructor(t: Tag | string) {
    this.tag = t
  }
}

class Num extends Token {
  public value: number
  constructor(v: number) {
    super(Tag.NUM)
    this.value = v
  }
}

class Word extends Token {
  public lexeme: string
  constructor(t: Tag, s: string) {
    super(t)
    this.lexeme = s
  }
}

export { Lexer }
