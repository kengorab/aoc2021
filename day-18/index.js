const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    return eval(l)
  })
}

function sum(left, right) {
  return reduce([left, right])
}

function reduce(num) {
  const [v1, didExplode] = explode(num)
  if (didExplode) return reduce(v1)

  const [v2, didSplit] = split(num)
  if (didSplit) return reduce(v2)

  return v2
}

function tokenize(num) {
  return JSON.stringify(num)
    .replace(/(\D)/g, ' $1 ')
    .split(' ')
    .filter(Boolean)
}

function explode(num) {
  const tokens = tokenize(num)
  const newTokens = []

  let depth = 0
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]

    switch (tok) {
      case '[':
        newTokens.push(tok)
        depth += 1
        break
      case ']':
        newTokens.push(tok)
        depth -= 1
        break
      case ',':
        newTokens.push(tok)
        continue
      default: { // digit
        if (depth !== 5) {
          newTokens.push(tok)
          continue
        }

        const l = parseInt(tok)
        for (let j = newTokens.length - 1; j >= 0; j--) {
          const ch = newTokens[j]
          if (ch !== '[' && ch !== ']' && ch !== ',') {
            newTokens[j] = parseInt(ch) + l
            break
          }
        }

        const r = parseInt(tokens[i + 2])
        for (let j = i + 3; j < tokens.length; j++) {
          const ch = tokens[j]
          if (ch !== '[' && ch !== ']' && ch !== ',') {
            tokens[j] = parseInt(tokens[j]) + r
            break
          }
        }

        newTokens.pop() // remove [
        newTokens.push(0)
        newTokens.push(...tokens.slice(i + 4))
        const newNum = eval(newTokens.join(''))
        return [newNum, true]
      }
    }
  }

  return [num, false]
}

function split(num) {
  if (!Array.isArray(num)) {
    if (num >= 10) return [[Math.floor(num / 2), Math.ceil(num / 2)], true]
    return [num, false]
  }

  const [l, r] = num
  const [v1, didL] = split(l)
  if (didL) return [[v1, r], true]

  const [v2, didR] = split(r)
  return [[l, v2], didR]
}

function magnitude(num) {
  if (!Array.isArray(num)) return num
  const [l, r] = num
  return 3 * magnitude(l) + 2 * magnitude(r)
}

function part1() {
  const nums = processInput(realInput)

  let S = nums[0]
  for (let i = 1; i < nums.length; i++) {
    S = sum(S, nums[i])
  }
  return magnitude(S)
}
console.log(part1()) // 4289

function part2() {
  const nums = processInput(realInput)
  let max = 0
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (i === j) continue

      max = Math.max(
        max,
        magnitude(sum(nums[i], nums[j])),
        magnitude(sum(nums[j], nums[i])),
      )
    }
  }
  return max
}
console.log(part2()) // 4807
