#!/usr/bin/env NODE_ENV=production node
const lines = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')

/*
  EVALUATE LINES
*/
const fieldRe = /(?<name>\w+(| \w+)+): (?<upper>\d+-\d+) or (?<lower>\d+-\d+)/
const isField =
  (line) => fieldRe.test(line)

const valuesRe = /(\d+|,)+/
const isValues =
  (line) => valuesRe.test(line)

const isYourTicket =
  (line) => line.startsWith('your ticket:')
const isNearbyTicket =
  (line) => line.startsWith('nearby tickets:')


/*
  PARSE LINES
*/
const range =
  (min, max) => [...Array((max + 1) - min)].map((_, index) => min + index)

const parseFieldRange =
  (arg) => {
    const [min, max] = arg.split('-').map(v => Number(v))
    return range(min, max)
  }

const parseField =
  (line) => {
    const result = fieldRe.exec(line)
    const lower = parseFieldRange(result.groups.lower)
    const upper = parseFieldRange(result.groups.upper)

    return {
      name: result.groups.name,
      range: new Set([lower, upper].flat().sort((a, b) => a - b))
    }
  }

const parseValues =
  (line) => line.split(',').filter(v => v).map(v => Number.parseInt(v))

/*
  READS LINES TO DOMAIN
*/
const readStates = {
  fields: Symbol('fields'),
  ticket: Symbol('ticket'),
  tickets: Symbol('tickets')
}
let readState = readStates.fields

const fields = []
const ticket = []
const tickets = []
for (const line of lines) {
  if (readState === readStates.fields && isField(line)) {
    fields.push(parseField(line))
    continue
  }

  if (isYourTicket(line)) {
    readState = readStates.ticket
    continue
  }

  if (readState === readStates.ticket && isValues(line)) {
    parseValues(line).forEach(v => ticket.push(v))
    continue
  }

  if (isNearbyTicket(line)) {
    readState = readStates.tickets
    continue
  }

  if (readState === readStates.tickets && isValues(line)) {
    tickets.push(
      parseValues(line)
    )
    continue
  }
}

/*
  Part One
*/
const all = fields.map(field => Array.from(field.range)).flat().sort((a, b) => a - b)
const set = new Set(all)
const invalidValues = []
const validTickets = []
for (const values of tickets) {
  const inclusive = values.filter(value => set.has(value))
  if (inclusive.length === fields.length) {
    validTickets.push(values)
    continue
  }

  values.filter(value => !set.has(value))
    .forEach(value => invalidValues.push(value))
}
console.log(
  `Part one – error sample rate is: ${Array.from(invalidValues).reduce((a, b) => a + b, 0)}`
)

/*
  Part two
*/
const columnSize = validTickets.length
const columnCandidates = []
for (let c = 0, width = fields.length; c < width; c++) {
  const column = validTickets.map(values => values[c])
  const candidates = []
  for (const field of fields) {
    const inclusive = column.filter(value => field.range.has(value))
    if (inclusive.length === columnSize) {
      candidates.push(field)
    }
  }

  columnCandidates.push({
    column: c,
    candidates
  })
}

/*
  Candidates looks like this
  [
    { column: 0 candidates: [ class ] },
    { column: 1 candidates: [ class, row ] },
    { column: 2 candidates: [ class, row, train ]},
    { column: 3 candidates: [ class, row, train, type ]},
    ...
  ]
*/
const seen = new Set()
const orderedFields = columnCandidates.sort((a, b) => a.candidates.length - b.candidates.length)
  .map((item) => {
    let [ candidate ] = item.candidates.filter(candidate => !seen.has(candidate.name))
    seen.add(candidate.name)

    return {
      column: item.column,
      field: candidate
    }
  })
  .sort((a, b) => a.column - b.column)
  .map(item => item.field)

const result =
  orderedFields.map((field, index) => field.name.startsWith('departure') ? index : -1)
    .filter((index) => index >= 0)
    .reduce((acc, index) => acc * ticket[index], 1)

console.log(
  `Part two – words that start with departure mutiplied is: ${result}`
)

