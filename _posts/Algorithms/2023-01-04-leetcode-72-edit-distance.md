---
layout: post
title: LeetCode 72 Edit Distance
category: algorithms
---

# Problem Description

[72 Edit Distance](https://leetcode.com/problems/edit-distance/)

Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.

You have the following three operations permitted on a word:

- Insert a character
- Delete a character
- Replace a character

**Example 1**

```
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation:
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
```

**Example 2**

```
Input: word1 = "intention", word2 = "execution"
Output: 5
Explanation:
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
```

# Dynamic Programming

## Recursive Approach

The DP solution to edit distance problem based on 3 basic operation to get the distance: `insertion`, `deletion`, and `substitution`.

Let $A[1, m]$ and $B[1, n]$ be two strings.

The edit distance between $A[1, i]$ and $B[1, j]$ $Edit(i, j)$ can be described as:

1. Insertion: $Edit(i, j) = Edit(i, j-1) + 1$
2. Deletion: $Edit(i, j) = Edit(i-1, j) + 1$
3. Substitution: $Edit(i, j) = Edit(i-1, j-1) + (A[i] \ne B[j])$

The way I interpret these three cases is considering the recursion case = 0.

For example, if $A[1, i] = B[1, j-1]$, adding the letter $B[j]$ to the end of A can make $A[1, i] = B[i, j]$. Also, if $A[1, i-1] = B[1, j]$, removing $A[i]$ from A can make $A[1, i-1] = B[1, i-1]$ (**Notice that the target is always manipulating string A to get string B**).

For substitution, if $A[1, i-1] = B[1, j-1]$, replacing $A[i]$ with $B[i]$ can achieve our goal. However, if $A[i] = B[j]$, there's no need to perform an extra replace operation.

## DP Setup

### Matrix

The matrix for DP can be a 2D $m \times n$ array $D$ where $m$ and $n$ are the length of two strings.

$D[i][j]$ represents the edit distance between $A[1, i]$ and $B[1, j]$.

### Bellman Equation

$$
\begin{aligned}
    D[i][j] = &min( \\
        & \quad D[i][j-1] + 1, \\
        & \quad D[i-1][j] + 1, \\
        & \quad D[i-1][j-1] + (A[i] \ne B[j]), \\
    &)
\end{aligned}
$$

### Initialization

For all $i$ from 0 to n and $j$ from 0 to m, $D[i][0] = i$ and $D[0][j] = j$.

### How to Populate

For all $i$ and $j$, $D[i][j]$ need $D[i-1][j]$, $D[i][j-1]$, and $D[i-1][j-1]$. Thus, after initialization, populate from $i = 1 \rightarrow m$, $j = i \rightarrow n$.

### How to Get Answer

Since $D[i][j]$ represents the edit distance between $A[1, i]$ and $B[1, j]$, to find the edit distance between $A[1, m]$ and $B[1, n]$, return $D[m][n]$

## Time complexity

For this DP problem, I use a 2D array and populate value for each cell, the overall time complexity should be $O(mn)$.

## Code Implementation

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m = len(word1)
        n = len(word2)

        # Distance DP array.
        distance = [
            [0 for i in range(n+1)]
            for j in range(m+1)
        ]

        # Init.
        distance[0][0] = 0
        for i in range(1, m+1):
            distance[i][0] = i
        for j in range(1, n+1):
            distance[0][j] = j

        # Populate.
        for i in range(1, m+1):
            for j in range(1, n+1):
                distance[i][j] = min([
                    distance[i][j-1] + 1,
                    distance[i-1][j] + 1,
                    distance[i-1][j-1] + (
                        0 if word1[i-1] == word2[j-1] else 1
                    )
                ])

        # Get result.
        return distance[-1][-1]
```

Notice that in line 26 I wrote `0 if word1[i-1] == word2[j-1] else 1`, this is because the `i` and `j` here is 1-indexed, while we need to use 0-index to get a character from a python string.
