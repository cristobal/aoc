package day01

import java.io.File
import kotlin.math.abs

fun readValues(): Pair<List<Int>, List<Int>> {
  val pattern = """(\d+)\s+(\d+)""".toRegex()
  val left = mutableListOf<Int>()
  val right = mutableListOf<Int>()
  for (line in File("src/day01/input.txt").readLines()) {
    val match = pattern.find(line)
    val values = match?.groupValues ?: listOf()
    if (values.isEmpty()) {
      continue
    }
    
    left.add(values[1].toInt())
    right.add(values[2].toInt())
  }
  
  return Pair(left.sorted(), right.sorted())
}

fun main() {
  val (left, right) = readValues()
  
  // Calculate distances
  val distances = mutableListOf<Int>()
  for (i in left.indices) {
    val distance = abs(left[i] - right[i])
    distances.add(distance)
  }
  
  val totalDistances = distances.reduce { a, b -> a + b }
  println("Total distances between lists = $totalDistances")

  // Calculate similarity score
  var totalSimilarityScore = 0
  for (value in left) {
    val total = right.filter { it == value }.sum()
    val score = value * total
    totalSimilarityScore += score
  }
  
  println("Total similarity score between lists = $totalSimilarityScore")
}
