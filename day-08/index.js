const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    const [inputs, outputs] = l.split(' | ')
    return [inputs.split(' '), outputs.split(' ')]
  })
}

function part1() {
  const lines = processInput(realInput)
  return lines
    .flatMap(([, outputs]) => outputs)
    .filter(o => o.length === 2 || o.length === 3 || o.length === 4 || o.length === 7)
    .length
}
console.log(part1()) // 245

function part2() {
  const lines = processInput(realInput)

  function decode([inputs, outputs]) {
    const digitsByLen = _.groupBy(inputs, i => i.length)

    const one = digitsByLen[2][0]
    const seven = digitsByLen[3][0]
    const four = digitsByLen[4][0]
    const eight = digitsByLen[7][0]

    const three = digitsByLen[5].find(n => seven.split('').every(d => n.split('').includes(d)))
    const five = digitsByLen[5].find(n => n !== three && _.intersection(four.split(''), n.split('')).length === 3)
    const two = digitsByLen[5].find(n => n !== three && n !== five)

    const nine = digitsByLen[6].find(n => four.split('').every(d => n.split('').includes(d)))
    const six = digitsByLen[6].find(n => {
      return n !== nine && five.split('').every(d => n.split('').includes(d))
    })
    const zero = digitsByLen[6].find(n => n !== nine && n !== six)

    const map = Object.fromEntries(
      [zero, one, two, three, four, five, six, seven, eight, nine]
        .map((v, i) => [v.split('').sort().join(), i])
    )
    const numbers = outputs.map(num => map[num.split('').sort().join()])
    return _.parseInt(numbers.join(''))
  }

  return lines.reduce((acc, line) => acc + decode(line), 0)
}
console.log(part2()) // 983026
