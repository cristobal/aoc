use "../utils/utils.sml";

datatype dimension = Dimension of int * int * int;

fun to_dimensions(lines: string list): dimension list =
  let
    fun to_int(arg: string): int =
      Option.getOpt(Int.fromString(arg), 0)

    fun to_dimension(line: string): dimension =
      let
        val tokens: string list = 
          String.tokens
          (fn (chr) => chr = #"x")
          line

        val [l, w, h] = map to_int tokens
      in
        Dimension (l, w, h)
      end
  in
    map to_dimension lines
  end
;

fun part_one(dimensions: dimension list):int =
  let
    fun calculate_wrapping_paper(Dimension (l, w, h)):int =
      let
        val sides     = [2*l*w, 2*w*h, 2*h*l]
        val smallest  = min(sides) div 2
      in
        (sum sides) + smallest
      end
  in
    sum
      (map calculate_wrapping_paper dimensions)
  end
;

fun part_two(dimensions: dimension list): int =
  let
    fun calculate_ribbon(Dimension (l, w, h)):int =
      (* take min of three possible results *)
      min([
        (l + l + w + w) + (l * w * h),
        (w + w + h + h) + (l * w * h),
        (l + l + h + h) + (l * w * h)
      ])
  in
    sum
      (map calculate_ribbon dimensions)
  end

(* 
  1. open input file 
  2. read lines
  3. transform to dimensions
*)
val stream     = TextIO.openIn "input.txt";
val lines      = read_lines(stream);
val dimensions = to_dimensions(lines);

(* Solution 1 *)
print ("Solution 1: " ^ Int.toString(part_one(dimensions)) ^ "\n");

(* Solution 2 *)
print ("Solution 2: " ^ Int.toString(part_two(dimensions)) ^ "\n");
