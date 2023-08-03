fun min (numbers: int list):int =
  foldl 
    (fn (a, b) => if a < b then a else b)
    (hd numbers)
    (tl numbers)

fun sum (numbers: int list):int =
  foldl (op +) 0 numbers
