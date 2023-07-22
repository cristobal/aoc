fun part_one(chars: char list): int =
  let
    val values = map (fn (chr) =>
      (* the open parens ( char *)
      if Char.compare(chr, #"(") = EQUAL then 
        1
      (* the close parens ) char *)
      else if Char.compare(chr, #")") = EQUAL then 
        ~1
      (* null byte perhaps? *)
      else
        0
    ) chars
  in
    foldl op+ 0 values
  end
;

fun part_two(char: char list) int =
  0

(* 
  1. open input file 
  2. extract first line
  3. get chars array
*)
val stream = TextIO.openIn "input.txt";
val line = Option.getOpt(
  TextIO.inputLine stream, ""
);
val chars = explode line;


(* Solution 1 *)
print ("Solution 1: " ^ Int.toString(part_one(chars)) ^ "\n");
