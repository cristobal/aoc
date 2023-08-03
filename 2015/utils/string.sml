fun trim_end(value: string): string =
  (* 
    The loop finds the first none whitespace or none line terminator 
    starting from the end of the string to start of the string-
  *)
  let
    fun loop 0     = 0
      | loop index =
        if Char.ord(String.sub(value, index - 1)) > 32 then
          index
        (* recurse *)
        else
          loop (index - 1)
  in
    String.substring(
      value, 
      0,
      loop(
        size value
      )
    )
  end
