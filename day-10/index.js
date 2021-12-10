const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    return l.split('')
  })
}

function part1() {
  function processLine(line) {
    const matches = {
      ')': ['(', 3],
      ']': ['[', 57],
      '}': ['{', 1197],
      '>': ['<', 25137],
    }

    const stack = []
    for (const ch of line) {
      switch (ch) {
        case '(':
        case '[':
        case '{':
        case '<':
          stack.push(ch)
          break
        default:
          const [m, v] = matches[ch]
          if (stack.pop() !== m) return v
      }
    }
    return 0;
  }

  const lines = processInput(realInput)
  return _.sum(lines.map(processLine))
}
console.log(part1()) // 367227

function part2() {
  function processLine(line) {
    const matches = {
      ')': '(',
      ']': '[',
      '}': '{',
      '>': '<',
    }

    const stack = []
    for (const ch of line) {
      switch (ch) {
        case '(':
        case '[':
        case '{':
        case '<':
          stack.push(ch);
          break;
        default:
          if (stack.pop() !== matches[ch]) return null;
      }
    }

    let score = 0
    while (stack.length) {
      const rem = stack.pop()
      score *= 5

      if (rem === '(') score += 1
      else if (rem === '[') score += 2
      else if (rem === '{') score += 3
      else if (rem === '<') score += 4
    }
    return score;
  }

  const lines = processInput(realInput)
  const scores = lines.map(processLine).filter(s => !!s)
  const sorted = _.sortBy(scores, i => i)
  return sorted[Math.floor(sorted.length / 2)]
}
console.log(part2()) // 3583341858
