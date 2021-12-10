#!/usr/bin/env NODE_ENV=production node
function readlines (input) {
  return require('fs').readFileSync(input, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
}

function readRules (lines) {
  const rulePattern = /^(?<key>\d+): (?<rule>(.*))/
  return lines.reduce((acc, line) => {
      const result = rulePattern.exec(line)
      return result
        ? acc.set(Number(result.groups.key), result.groups.rule.trim())
        : acc
    }, new Map())
}

function readMessages (lines) {
  const messagePattern = /^(a|b)+/
  return lines.filter(line => messagePattern.test(line))
}

function exprForRule (key, rules) {
  const rule = rules.get(key)
  const exprForSubRule =
    (subRule) =>
      subRule.split(' ').map(key => exprForRule(Number(key), rules)).join('')

  // case single char
  if (rule.startsWith('"')) {
    return rule[1]
  }

  const [leftSubRule, rightArgs] = rule.split(' | ')
  const left = exprForSubRule(leftSubRule)

  // single expr e.g. 8 42
  if (!rightArgs) {
    return left
  }

  const [rightSubRule, repeat, restSubRule ] =
    rightArgs.split(new RegExp(`( ${key}(?: |$))`))
      .map(v => v.trim())
      .filter(v => v)

  const right = exprForSubRule(rightSubRule)
  if (!repeat) {
    return `(${left}|${right})`
  }

  if (!restSubRule) {
    return `(${left}|${right}{2,})`
  }

  const rest = exprForSubRule(restSubRule)
  // This is actually a nested recursive expression {right}R{rest}
  return `(${left}|${right}{2,2}${rest}{2,2}|${right}{3,3}${rest}{3,3}|${right}{4,4}${rest}{4,4}|${right}{5,5}${rest}{5,5}|${right}{6,6}${rest}{6,6})`
}

function patternForRule (key, rules) {
  return new RegExp(`^${exprForRule(key, rules)}$`)
}

function partOne () {
  const lines = readlines('./input_a.txt')
  const rules = readRules(lines)
  const messages = readMessages(lines)
  const pattern = patternForRule(0, rules)
  return messages.filter(m => pattern.test(m))
}

function partTwo () {
  const lines = readlines('./input_b.txt')
  const rules = readRules(lines)
  const messages = readMessages(lines)
  const pattern = patternForRule(0, rules)
  return messages.filter(m => pattern.test(m))
}

console.log(`Part one - total message: ${partOne().length}`)
console.log(`Part two - total message: ${partTwo().length}`)
