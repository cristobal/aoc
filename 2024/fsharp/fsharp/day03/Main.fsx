open System.IO
open System.Text.RegularExpressions

let input = File.ReadAllText($"{__SOURCE_DIRECTORY__}/input.txt")

// Solution One
let solutionOneSum =
    Regex.Matches(input, @"mul\((\d{1,3}),(\d{1,3})\)")
      |> Seq.map (fun m -> 
          let first = int m.Groups.[1].Value
          let second = int m.Groups.[2].Value
          first * second)
      |> Seq.sum
printfn $"Solution 1: ${solutionOneSum}"

// Solution Two
let mutable instructionEnabled = true
let mutable solutionTwoSum = 0
for m in Regex.Matches(input, @"(do|don't)\(\)|mul\((\d{1,3}),(\d{1,3})\)") do
    let groups = m.Groups
    match groups.[1].Value with
    | "don't" -> 
        instructionEnabled <- false
    | "do" -> 
        instructionEnabled <- true
    | _ when instructionEnabled ->
        let first = int groups.[2].Value
        let second = int groups.[3].Value
        solutionTwoSum <- solutionTwoSum + (first * second)
    | _ -> ()
printfn $"Solution 2: ${solutionTwoSum}"

exit 0
