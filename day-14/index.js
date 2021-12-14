const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`

function processInput(input) {
  const [template, rules] = input.trim().split('\n\n')

  const R = Object.fromEntries(
    rules.split('\n').map(l => {
      return l.split(' -> ')
    })
  )
  return [template, R]
}

function pairs(template) {
  const pairs = []
  for (let i = 1; i < template.length; i++) {
    pairs.push(template[i - 1] + template[i])
  }
  return pairs
}

function part1() {
  let [template, rules] = processInput(realInput)

  // naive
  let newTemplate = ''
  for (let _ = 0; _ < 10; _++) {
    newTemplate = template[0]
    for (const pair of pairs(template)) {
      newTemplate += rules[pair] + pair[1]
    }
    template = newTemplate
  }
  const counts = Object.values(_.countBy(newTemplate.split('')))

  return Math.max.apply(null, counts) - Math.min.apply(null, counts)
}
console.log(part1()) // 3095

function part2() {
  let [template, rules] = processInput(realInput)

  let pairCounts = _.countBy(pairs(template))
  for (let _ = 0; _ < 40; _++) {
    const newCounts = {}
    for (const [pair, count] of Object.entries(pairCounts)) {
      const res = rules[pair]
      const p1 = pair[0] + res
      const p2 = res + pair[1]
      newCounts[p1] = (newCounts[p1] || 0) + count
      newCounts[p2] = (newCounts[p2] || 0) + count
    }
    pairCounts = newCounts
  }

  const chCounts = {}
  for (const [p, k] of Object.entries(pairCounts)) {
    const p1 = p[0]
    const p2 = p[1]
    chCounts[p1] = (chCounts[p1] || 0) + k
    chCounts[p2] = (chCounts[p2] || 0) + k
  }
  chCounts[template[0]] += 1
  chCounts[_.last(template)] += 1

  const counts = _.sortBy(Object.values(chCounts).map(c => Math.ceil(c/2)))
  return _.last(counts) - counts[0]
}
console.log(part2()) // 3152788426516
