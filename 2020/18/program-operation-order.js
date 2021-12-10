#!/usr/bin/env NODE_ENV=production node
const expressions = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => line.trim())

const patterns = {
  startsWithNumber: /^(?<number>\d+)/,
  operatorThenExpr: / (?<operator>[*+]) (?<expr>.+)/,
}

const symbols = {
  operators: {
    plus: '+',
    multiplication: '*'
  },
  parentheses: {
    open: '(',
    close: ')'
  }
}

/**
 * @typedef {Object} LeftToRightExpressions
 * @property {string} [leftExpr]
 * @property {string} [leftToRightOperator=null]
 * @property {string} [rightExpr=null]
 * @property {string} [rightToRestOperator=null]
 * @property {string} [restExpr=null]
 */

 /*
  PARSING EXPRESSIONS
 */

 /**
  * Extracts first (expr) inside parentheses from an expr
  * @param {string} expr
  */
function parseParensExpr(expr) {
  const size = expr.length
  let index = 1
  let count = 1
  while (index < size) {
    if (expr[index] === symbols.parentheses.open) { count++ }
    if (expr[index] === symbols.parentheses.close) { count-- }
    if (count === 0) { break }
    index++
  }

  return expr.slice(0, index + 1)
}

/**
 * Parse left to right expressions from an expression form
 * expr ->
 *  leftExpr ( [*+] rightExpr ([*+] exprRest)? )?
 *
 * @param {string} expr
 * @return {LeftToRightExpressions}
 */
function parseLeftToRightExpressions(expr) {
  const expressions = {
    leftExpr: null,
    leftToRightOperator: null,
    rightExpr: null,
    rightToRestOperator: null,
    restExpr: null,
  }

  expressions.leftExpr =
    patterns.startsWithNumber.exec(expr)?.groups.number ?? parseParensExpr(expr)

  /*
    Original expr is is the same as left expr,
    meaning this is the terminating symbol */
  if (expressions.leftExpr === expr) {
    return expressions
  }

  const { operator: leftToRightOperator, expr: rightExpr } =
    patterns.operatorThenExpr.exec(expr.slice(expressions.leftExpr.length)).groups

  expressions.leftToRightOperator = leftToRightOperator
  expressions.rightExpr =
    patterns.startsWithNumber.exec(rightExpr)?.groups.number ?? parseParensExpr(rightExpr)

  /*
    Original expr is is the same as right expr,
    meaning this is the terminating symbol */
  if (expressions.rightExpr === rightExpr) {
    return expressions
  }

  const { operator: rightToRestOperator, expr: restExpr } =
    patterns.operatorThenExpr.exec(rightExpr.slice(expressions.rightExpr.length)).groups

  expressions.rightToRestOperator = rightToRestOperator
  expressions.restExpr = restExpr

  return expressions
}

/*
  CALCULATING EXPRESSIONS
*/

/**
 * @param {string} subExpr
 * @return {number}
 */
function calculateSubExprOrNumber(subExpr) {
  return !patterns.startsWithNumber.test(subExpr)
    ? calculate(subExpr.slice(1, -1))
    : Number.parseInt(subExpr)
}

/**
 *
 * @param {number} leftExpr
 * @param {(string|null)} operator
 * @param {(string|null)} rightExpr
 */
function calculateEvaluateExpressions(leftExpr, operator, rightExpr) {
  return operator === symbols.operators.plus
    ? leftExpr + rightExpr
    : leftExpr * rightExpr
}

function calculate(expr) {
  let acc = 0
  let operator = symbols.operators.plus
  let nextExpr = expr
  while (nextExpr) {
    /* parse expressions */
    const expressions =
      parseLeftToRightExpressions(nextExpr)

    acc = calculateEvaluateExpressions(
      acc,
      operator,
      calculateSubExprOrNumber(expressions.leftExpr)
    )

    if (!expressions.leftToRightOperator) { break }

    acc = calculateEvaluateExpressions(
      acc,
      expressions.leftToRightOperator,
      calculateSubExprOrNumber(expressions.rightExpr)
    )

    if (!expressions.rightToRestOperator) { break }

    operator = expressions.rightToRestOperator
    nextExpr = expressions.restExpr
  }

  return acc
}

/*
  COERCE ORDER PRESEDENCE
*/

/**
 * @param {string} subExpr
 * @return {number}
 */
function coerceOrderPresedenceSubExprOrNumber(subExpr) {
  return !patterns.startsWithNumber.test(subExpr)
    ? `(${coerceOrderPresedence(subExpr.slice(1, -1))})`
    : Number.parseInt(subExpr)
}

function coerceOrderPresedence(expr) {
  const stack = []
  let nextExpr = expr
  while (nextExpr) {
    /* parse expressions */
    const expressions = parseLeftToRightExpressions(nextExpr)

    /* matches case: previous expression is a sum to the current expression */
    if (stack[stack.length - 1] === symbols.operators.plus) {
      const [prevOperator, prevExpr] = [stack.pop(), stack.pop()]
      stack.push(
        `(${prevExpr} ${prevOperator} ${coerceOrderPresedenceSubExprOrNumber(expressions.leftExpr)})`
      )

      nextExpr = expressions.leftToRightOperator
        ? `${expressions.rightExpr}${expressions.rightToRestOperator ? ` ${expressions.rightToRestOperator} ${expressions.restExpr}` : ''}`
        : null

      nextExpr
        ? stack.push(expressions.leftToRightOperator)
        : void 0

      continue
    }

    /* matches case: number|(expr) */
    if (!expressions.leftToRightOperator) {
      stack.push(coerceOrderPresedenceSubExprOrNumber(expressions.leftExpr))
      nextExpr = null
      continue
    }

    /* matches case: number|(expr) [+*] number|(expr) */
    if (!expressions.rightToRestOperator) {
      expressions.leftToRightOperator === symbols.operators.plus
        ? (stack.push(
          `(${coerceOrderPresedenceSubExprOrNumber(expressions.leftExpr)} ${symbols.operators.plus} ${coerceOrderPresedenceSubExprOrNumber(expressions.rightExpr)})`
          ))
        : (stack.push(
            coerceOrderPresedenceSubExprOrNumber(expressions.leftExpr),
            symbols.operators.multiplication,
            coerceOrderPresedenceSubExprOrNumber(expressions.rightExpr)
          ))
      nextExpr = null
      continue
    }

    /* matches case: number|(expr) [+*] number|(expr) */
    expressions.leftToRightOperator === symbols.operators.plus
      ? (stack.push(
          `(${coerceOrderPresedenceSubExprOrNumber(expressions.leftExpr)} ${symbols.operators.plus} ${coerceOrderPresedenceSubExprOrNumber(expressions.rightExpr)})`,
          expressions.rightToRestOperator
        ))
      : (stack.push(
          coerceOrderPresedenceSubExprOrNumber(expressions.leftExpr),
          symbols.operators.multiplication,
          coerceOrderPresedenceSubExprOrNumber(expressions.rightExpr),
          expressions.rightToRestOperator
        ))
    nextExpr = expressions.restExpr
  }

  return stack.join(' ')
}

/*
  Run Programs
*/
function calculatePartOne () {
  return expressions
    .map(expr => calculate(expr))
    .reduce((a, b) => a + b)
}

function calculatePartTwo () {
  return expressions
    .map(expr => coerceOrderPresedence(expr))
    .map(expr => calculate(expr))
    .reduce((a, b) => a + b)
}

console.log(`Part one - result: ${calculatePartOne()}`)
console.log(`Part two - result: ${calculatePartTwo()}`)
