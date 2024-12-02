open System.IO
open System.Text.RegularExpressions

let readValues () : int list * int list =
  let pattern = Regex(@"(\d+)\s+(\d+)")
  let left, right =
    File.ReadLines($"{__SOURCE_DIRECTORY__}/input.txt")
    |> Seq.map pattern.Match
    |> Seq.filter _.Success
    |> Seq.map(fun m ->
        int m.Groups[1].Value,
        int m.Groups[2].Value
      )
    |> Seq.toList
    |> List.unzip

  // return left and right lists sorted
  (List.sort left, List.sort right)
 
let solutionOne (left: int list, right: int list): unit =
  // Calculate distance between lists
  let distance =
    List.zip left right
      |> List.map (fun (l, r) -> abs(l - r))
      |> List.sum
  printfn $"Total distance between lists => {distance}"

let solutionTwo (left: int list, right: int list): unit =
  // Calculate similarity score
  let mutable score = 0
  for value in left do
    let total =
      right
        |> List.filter ((=) value)
        |> List.length
    score <- score + value * total
  printfn $"Similarity score between lists => {score}"

let left, right = readValues()
solutionOne(left, right)
solutionTwo(left, right)
