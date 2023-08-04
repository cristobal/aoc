fun find_index(list: ''a list, predicate: ''a -> bool): int =
  let
    fun loop ([], _) = ~1
      | loop (item::rest, index: int) =
        if (predicate item) then
          index
        else
          loop(rest, index + 1)
  in
    loop(list, 0)
  end

fun index_of(list: ''a list, item: ''a): int =
  find_index(
    list,
    (fn (candidate: ''a) => candidate = item)
  )

fun unique(list: ''a list): ''a list =
  let
    fun loop([], output: ''a list) = output
      | loop(item::rest, output: ''a list) =
        if index_of(output, item) = ~1 then
          loop(rest, output @ [item])
        else
          loop(rest, output)
  in
    loop(list, [])
  end
