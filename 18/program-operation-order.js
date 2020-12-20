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
 * @param {string} expr
 * @return {number}
 */
function numberOrCalculate(expr) {
  return patterns.startsWithNumber.test(expr)
    ? Number.parseInt(expr)
    : calculate(expr.slice(1, -1))
}

/**
 *
 * @param {number} leftExpr
 * @param {(string|null)} operator
 * @param {(string|null)} rightExpr
 */
function evaluate(leftExpr, operator, rightExpr) {
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

    acc = evaluate(
      acc,
      operator,
      numberOrCalculate(expressions.leftExpr)
    )

    if (!expressions.rightExpr) { break }

    acc = evaluate(
      acc,
      expressions.leftToRightOperator,
      numberOrCalculate(expressions.rightExpr)
    )

    if (!expressions.restExpr) { break }

    operator = expressions.rightToRestOperator
    nextExpr = expressions.restExpr
  }

  return acc
}


function calculatePartOne () {
  return expressions
    .map(expr => calculate(expr))
    //.map(val => console.log(val))
    .reduce((a, b) => a + b)
}

console.log(calculatePartOne())
// function calculatePartTwo () {
//   return expressions
//     .map(line => coerceOperatorPresedencePlus(line))
//     .map(args => calculate(args))
//     .reduce((a, b) => a + b)
// }

// console.log(`Part one result: ${calculatePartOne()}`)
// console.log(`Part on result: ${calculatePartTwo()}`)
// console.log(
//   calculate(
//     coerce(expressions[5]).split('').filter(arg => arg.trim())
//   )
// )

