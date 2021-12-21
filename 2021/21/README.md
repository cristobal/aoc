# Solution part 2

Instructions on how to solve from video [here](https://www.youtube.com/watch?v=tEPgMuqZZGE)

* Reduce the number of possible states
* Every 3 rolls can be summarized as its total

minimum possible is 3
and maximum possible is 9
----
min:    3 | (1,1 1)         | 1
        4 | (1,1,2)         | 3 (since we can permute them in 3 possible ways)
        5 | (1,2,2) (1,1,3) | 6 (since we can permute them in 6 possible ways)
        6 | (2,2,2) (1,3,2) | 7 (since we can permute them in 7 possible ways)
        7 | (3,3,1) (3,2,2) | 6 (since we can permute them in 6 possible ways)
        8 | (3,3,2)         | 3 (since we can permute them in 3 possible ways)
max:    9 | (3,3,3)         | 1

* The number of ways for 3 rolls to happen
* Whats important is the number of ways we can obtain these values.

https://math.stackexchange.com/questions/2255659/cartesian-product-of-3-sets
