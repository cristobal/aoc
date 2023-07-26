fun read_lines(stream: TextIO.instream): string list =
  let 
    fun read_lines' (xs: string list): string list =
      case TextIO.inputLine stream of
        (* no lines left to read *)
          NONE => xs
        (* parsed a line, append to list and parse next line if available *)
        | SOME line => read_lines'(line :: xs)
  in
    read_lines'([])
  end

fun min (numbers: int list):int =
  foldl 
    (fn (a, b) => if a < b then a else b)
    (hd numbers)
    (tl numbers)

fun sum (numbers: int list):int =
  foldl (op +) 0 numbers
