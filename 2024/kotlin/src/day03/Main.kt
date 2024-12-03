package day03

import java.io.File

fun solvePartOne(input: String): Int {
  val pattern ="""mul\((\d{1,3}),(\d{1,3})\)""".toRegex()
  return pattern
    .findAll(input)
    .map { matchResult ->
      // Extract captured groups and multiply them
      val (first, second) = matchResult.destructured
      first.toInt() * second.toInt()
    }
    .sum()
}

fun solvePartTwo(input: String): Int {
  var instructionEnabled = true
  var solutionTwoSum = 0

  val pattern = Regex("""(do|don't)\(\)|mul\((\d{1,3}),(\d{1,3})\)""")
  pattern.findAll(input).forEach { match ->
    val (instr, first, second) = match.destructured
    when {
      instr == "don't" -> instructionEnabled = false
      instr == "do" -> instructionEnabled = true
      instructionEnabled -> {
        solutionTwoSum += first.toInt() * second.toInt()
      }
    }
  }
  
  return solutionTwoSum
}

fun main() {
  val input = File("src/day03/input.txt").readText()
  println("Part 1: ${solvePartOne(input)}")
  println("Part 2: ${solvePartTwo(input)}")
}
