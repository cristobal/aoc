const readline = require('readline')
const fs = require('fs')

function validatePassportsPolicyA (passports) {
  const validKeys = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid'
  ]

  return passports.filter(
    passport => {
      const keys = Object.keys(passport)
        .filter(key => validKeys.includes(key))

      return keys.length === 7
    }
  )
}

function validatePassportsPolicyB (passports) {
  // byr(Birth Year) - four digits; at least 1920 and at most 2002.
  // iyr(Issue Year) - four digits; at least 2010 and at most 2020.
  // eyr(Expiration Year) - four digits; at least 2020 and at most 2030.
  // hgt(Height) - a number followed by either cm or in:
  // If cm, the number must be at least 150 and at most 193.
  // If in, the number must be at least 59 and at most 76.
  // hcl(Hair Color) - a # followed by exactly six characters 0 - 9 or a - f.
  // ecl(Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  // pid(Passport ID) - a nine - digit number, including leading zeroes.
  // cid(Country ID) - ignored, missing or not.

  const patterns = {
    fourDigits: /^\d{4,4}$/,
    nineDigits: /^\d{9,9}$/,
    height: /^(?<height>\d{2,3})(?<type>cm|in)$/,
    hairColor: /^#[0-9a-f]{6,6}$/,
    eyerColor: /^(amb|blu|brn|gry|grn|hzl|oth)$/
  }

  const isFourDigits =
    value => patterns.fourDigits.test(value)

  const isWithinRange =
    (value, min, max) => {
      const number = parseInt(value, 10)
      return number >= min && number <= max
    }

  const validBirthYear =
    value => (isFourDigits(value) && isWithinRange(value, 1920, 2002))

  const validIssueYear =
    value => (isFourDigits(value) && isWithinRange(value, 2010, 2020))

  const validExpirationYear =
    value => (isFourDigits(value) && isWithinRange(value, 2020, 2030))

  const validHeight =
    value => {
      const match = patterns.height.exec(value)
      if (!match) {
        return false
      }

      return match.groups.type === 'cm'
        ? isWithinRange(match.groups.height, 150, 193)
        : isWithinRange(match.groups.height, 59, 76)
    }

  const validHairColor =
    value => patterns.hairColor.test(value)

  const validEyeColor =
    value => patterns.eyerColor.test(value)

  const validPassportID =
    value => patterns.nineDigits.test(value)

  return passports.filter(
    passport => (
      validBirthYear(passport.byr) &&
      validIssueYear(passport.iyr) &&
      validExpirationYear(passport.eyr) &&
      validHeight(passport.hgt) &&
      validHairColor(passport.hcl) &&
      validEyeColor(passport.ecl) &&
      validPassportID(passport.pid)
    )
  )
}

function parsePassports () {
  return new Promise(resolve => {
    const passports = []

    const parsePassportFromLines =
      (lines) => {
        //   byr(Birth Year)
        //   iyr(Issue Year)
        //   eyr(Expiration Year)
        //   hgt(Height)
        //   hcl(Hair Color)
        //   ecl(Eye Color)
        //   pid(Passport ID)
        //   cid(Country ID)

        const pairs = lines.flatMap(line => line.split(' '))
          .map(arg => {
            const [key, value] = arg.trim().split(':')
            return { [key]: value }
          })

        const passport = Object.assign({}, ...pairs)
        passports.push(passport)
      }

    let lines = []
    readline.createInterface({
      input: fs.createReadStream('./input.txt'),
      output: process.stdout,
      terminal: false
    })
    .on('line', (line) => {
      if (line === '') {
        parsePassportFromLines(lines)
        lines = []
        return
      }

      lines.push(line)
    })
    .on('close', () => {
      parsePassportFromLines(lines)
      resolve(passports)
    })
  })
}

async function main () {
  const passports = await parsePassports()
  const passportsValidForPolicyA = validatePassportsPolicyA(passports)
  const passportsValidForPolicyB = validatePassportsPolicyB(passportsValidForPolicyA)

  console.log('total passports valid for policy A', passportsValidForPolicyA.length)
  console.log('total passports valid for policy B', passportsValidForPolicyB.length)
}

main()
