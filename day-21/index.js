const _ = require('lodash')

// const [p1Start, p2Start] = [4, 8]  // Demo
const [p1Start, p2Start] = [4, 7]  // Real

function part1() {
  let d = 1
  let c = 0
  function roll() {
    c++
    if (d === 100) d = 0
    return d++
  }

  let p1 = p1Start
  let p2 = p2Start
  let s1 = 0
  let s2 = 0
  while (true) {
    p1 = (p1 + roll() + roll() + roll()) % 10
    if (p1 === 0) p1 = 10
    s1 += p1
    if (s1 >= 1000) return s2 * c

    p2 = (p2 + roll() + roll() + roll()) % 10
    if (p2 === 0) p2 = 10
    s2 += p2
    if (s2 >= 1000) return s1 * c
  }
}
console.log(part1()) // 893700

const product = (...arrays) => arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))

function part2() {
  const rolls = Object.entries(
    _.countBy(
      product([1, 2, 3], [1, 2, 3], [1, 2, 3])
        .map(([a, b, c]) => a + b + c)
    )
  ).map(([k, v]) => [parseInt(k), v])

  const DP = {}
  function play(p1, p2, s1, s2) {
    const dp = DP[`${p1},${p2},${s1},${s2}`]
    if (dp) return dp

    if (s1 >= 21) return [1, 0]
    if (s2 >= 21) return [0, 1]

    let p1Wins = 0
    let p2Wins = 0
    for (const [v, count] of rolls) {
      let p1New = (p1 + v) % 10
      if (p1New === 0) p1New = 10
      const s1New = s1 + p1New

      const [p2w, p1w] = play(p2, p1New, s2, s1New)
      p1Wins += p1w * count
      p2Wins += p2w * count
    }

    const res = [p1Wins, p2Wins]
    DP[`${p1},${p2},${s1},${s2}`] = res
    return res
  }

  return Math.max.apply(null, play(p1Start, p2Start, 0, 0))
}
console.log(part2()) // 568867175661958
