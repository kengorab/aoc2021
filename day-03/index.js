const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`

function processInput(input) {
  return input.trim().split('\n')
}

function part1() {
  const input = processInput(realInput)
  const n = input.length;
  const len = input[0].length;
  let gamma = 0, epsilon = 0

  for (let i = 0; i < len; i++) {
    gamma = gamma << 1
    epsilon = epsilon << 1

    const s = _.sum(input.map(r => r[i] === '1' ? 1 : 0))
    if (s < n/2) {
      epsilon += 1
    } else {
      gamma += 1
    }
  }
  return gamma * epsilon
}
console.log(part1()) // 3633500

function part2() {
  let input1 = processInput(realInput)
  let input2 = processInput(realInput)
  const len = input1[0].length;

  for (let i = 0; i < len; i++) {
    if (input1.length > 1) {
      const s1 = _.sum(input1.map(r => r[i] === '1' ? 1 : 0))
      if (s1 >= input1.length / 2) {
        input1 = input1.filter(r => r[i] === '1')
      } else {
        input1 = input1.filter(r => r[i] === '0')
      }
    }

    if (input2.length > 1) {
      const s2 = _.sum(input2.map(r => r[i] === '1' ? 1 : 0))
      if (s2 >= input2.length / 2) {
        input2 = input2.filter(r => r[i] === '0')
      } else {
        input2 = input2.filter(r => r[i] === '1')
      }
    }
  }

  return parseInt(input1[0], 2) * parseInt(input2[0], 2)
}
console.log(part2()) // 4550283
