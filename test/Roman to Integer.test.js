import { test, expect } from 'vitest'
import { romanToInt } from '../src/roman2Integer'

test('Test III', () => {
  const s = 'III'
  const result = romanToInt(s)
  expect(result).toMatchInlineSnapshot('123')
})

test('Test LVIII', () => {
  const s = 'LVIII'
  const result = romanToInt(s)
  expect(result).toMatchInlineSnapshot('123')
})
