const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`

function processInput(input) {
  const pairs = input.trim().split('\n')
    .map(l => l.split('-'))
  const G = {}
  for (const [s, e] of pairs) {
    if (!G[s]) G[s] = { name: s, children: [] }
    G[s].children.push(e)
    if (!G[e]) G[e] = { name: e, children: [] }
    G[e].children.push(s)
  }
  return G
}

const isLowerCase = s => 'a' <= s && s <= 'z'

function part1() {
  const G = processInput(realInput)

  function findPaths(node = 'start', path = [node]) {
    if (node === 'end') return [path]

    const paths = []
    for (const edge of G[node].children) {
      if (isLowerCase(edge) && path.includes(edge)) continue

      paths.push(...findPaths(edge, [...path, edge]))
    }
    return paths
  }

  return findPaths().length
}
console.log(part1()) // 4411

function part2() {
  const G = processInput(realInput)

  function findPaths(allowedDup, node = 'start', path = [node]) {
    if (node === 'end') return [path]

    const paths = []
    for (const edge of G[node].children) {
      const counts = _.countBy(path)
      if (isLowerCase(edge) && counts[edge]) {
        if (edge === allowedDup && counts[edge] >= 2) continue
        if (edge !== allowedDup && counts[edge]) continue
      }

      paths.push(...findPaths(allowedDup, edge, [...path, edge]))
    }
    return paths
  }

  // Probably works way harder than it has to, but whatever
  const paths = Object.keys(G)
    .filter(k => k !== 'start' && k !== 'end' && isLowerCase(k))
    .flatMap(ch => findPaths(ch).map(p => p.join(',')))
  return new Set(paths).size
}
console.log(part2()) // 136767
