
const lines = require('fs').readFileSync('./input.txt', 'utf-8').split('\n')

const alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x',
  'y', 'z'
]

const indexes = alphabet.reduce(
  (acc, char, index) => {
    acc[char] = index
    return acc
  }, {})

const createQuestionsTable =
  () => [...Array(alphabet.length).keys()].map(() => 0)

const createGroupSurvey =
  () => ({
    persons: 0,
    questionsTable: createQuestionsTable()
  })

const groupSurveys = []
let groupSurvey = null
for (const line of lines) {
  if (line === '') {
    groupSurveys.push(groupSurvey)
    groupSurvey = null
    continue
  }

  if (groupSurvey === null) {
    groupSurvey = createGroupSurvey()
  }

  groupSurvey.persons++
  line.split('').forEach(
    char => {
      groupSurvey.questionsTable[indexes[char]]++
    }
  )
}

const counts = groupSurveys.map(
  groupSurvey => groupSurvey.questionsTable.filter(v => v > 0).length
)

const sum = counts.reduce((acc, count) => acc + count, 0)
console.log(`Sum of counts: ${sum}`)

const countsEveryone = groupSurveys.map(
  groupSurvey => groupSurvey.questionsTable.filter(v => v === groupSurvey.persons).length
)

const sumEveryone = countsEveryone.reduce((acc, count) => acc + count, 0)
console.log(`Sum of counts for everyone: ${sumEveryone}`)
