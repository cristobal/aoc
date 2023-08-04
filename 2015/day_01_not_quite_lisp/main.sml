use "utils/utils.sml";

fun chr_to_val(chr: char): int =
  case chr of
    (* the open parens ( char *)
      #"(" => 1
    (* the close parens ) char *)
    | #")" => ~1
    (* unexpected chr *)
    | _ => raise Fail ("Unexpected chr: " ^ (Char.toString chr))

(*
  Santa is trying to deliver presents in a large apartment building, but he can't find the right floor - 
  the directions he got are a little confusing. 
  
  He starts on the ground floor (floor 0) and then follows the instructions one character at a time.
  An opening parenthesis, (, means he should go up one floor, and a closing parenthesis, ), 
  means he should go down one floor.
*)
fun part_one (chars: char list): int =
  let
    fun reducer(chr: char, acc: int): int = 
      acc + (chr_to_val chr)
  in
    foldl reducer 0 chars
  end


(*
  Now, given the same instructions, find the position of the first character that causes him to 
  enter the basement (floor -1).
*)
fun part_two(chars: char list): int =
  let
    val basement = ~1
    fun loop([]: char list, _: int, index: int): int = index
      | loop(chr::chars', acc: int, index: int): int =
        if (acc = basement, index <> 0) = (true, true) then
          loop([], acc, index)
        else
          loop(chars', acc + (chr_to_val chr), index + 1)
  in 
    loop(chars, 0, 0)
  end


(* 
  1. open input file 
  2. extract first line
  3. get chars array
*)
val stream = TextIO.openIn "day_01_not_quite_lisp/input.txt"
val input  = List.nth((read_lines stream), 0)
val chars = (explode input);

(* Solution 1 *)
print ("Solution 1: " ^ (Int.toString (part_one chars)) ^ "\n");

(* Solution 2 *)
print ("Solution 2: " ^ (Int.toString (part_two chars)) ^ "\n");

