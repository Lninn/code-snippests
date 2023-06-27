const info = {
  idx: 0,
  input: '',
}

function setup(s: string) {
  info.idx = 0
  info.input = s.trim()
}

function read() {
  return info.input[info.idx++]
}

function isNotEnd() {
  const v = info.input[info.idx]
  return v !== undefined
}

export default  { setup, read, isNotEnd }
