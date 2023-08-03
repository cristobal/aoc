fun read_lines(stream: TextIO.instream): string list =
  let
    fun read_lines' (xs: string list): string list =
      case TextIO.inputLine stream of
        (* no lines left to read *)
          NONE => xs
        (* parsed a line, append to list and parse next line if available *)
        | SOME line => read_lines'(xs @ [trim_end line])
  in
    read_lines' []
  end
