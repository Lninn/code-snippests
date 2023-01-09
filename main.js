import { romanToInt } from './src/roman2Integer'

const s1 = 'III'
const s2 = 'LVIII'
// MMM  DCC XX IV
// 3000 700 20 4
const s3 = 'MMMDCCXXIV'

const list = [
  // s1,
  // s2,
  s3,
]
for (const s of list) {
  romanToInt(s)
}
