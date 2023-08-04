use "utils/utils.sml";

datatype pos = Pos of int * int

fun get_next_pos(dir: char, Pos (x, y)): pos =
  case dir of
      #"^" => Pos (x, y + 1)
    | #"v" => Pos (x, y - 1)
    | #"<" => Pos (x - 1, y)
    | #">" => Pos (x + 1, y)
    | _ => raise Fail ("Unexpected dir: " ^ (Char.toString dir))


fun to_moves(directions: char list): pos list =
  let
    fun to_move ([], moves) = moves
      | to_move (dir::rest, moves) =
        let
          val pos = get_next_pos(dir, List.nth(moves, (length moves) - 1))
        in
          to_move(rest, moves @ [pos])
        end
  in
    to_move (
      directions,
      [Pos (0, 0)]
    )
  end


fun part_one(directions:char list) = 
  let
    val moves = (to_moves directions)
  in
    length (unique moves)
  end

fun part_two(directions: char list) = 
  let
    val stop = length directions

    fun partition (carry: char list, index): char list =
      if index >= stop then
        carry
      else
        partition(carry @ [List.nth(directions, index)], index + 2)
    
    val santa_moves = (to_moves (partition([], 0)))
    val robo_moves = (to_moves (partition([], 1)))
  in
    length (unique (santa_moves @ robo_moves))
  end

val stream      = TextIO.openIn "day_03_perfectly_spherical_houses_in_a_vacuum/input.txt"
val input       = List.nth((read_lines stream), 0)
val directions  = explode input;


print ("Solution 1: " ^ (Int.toString(part_one directions)) ^ "\n");
print ("Solution 2: " ^ (Int.toString(part_two directions)) ^ "\n");
