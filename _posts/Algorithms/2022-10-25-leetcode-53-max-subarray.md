---
layout: post
title: LeetCode 53 Max Subarray
category: algorithms
---

# Problem Description

[53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

Given an integer array $nums$, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A **subarray** is a **contiguous** part of an array.

**Example 1:**

```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.
```

**Example 2:**

```
Input: nums = [1]
Output: 1
```

**Example 3:**

```
Input: nums = [5,4,-1,7,8]
Output: 23
```

# Brute Force Search

To learn the how worse the implementation can be. We first need to analyze the brute force search performance.

For an array of size $n$, there are $\frac{(n+1) \cdot n}{2}$ subarrays.

The brute force algorithm will go through all the subarrays and find the one with max sum. This lead to $O(n^2)$ time complexity.

# Dynamic Programming

When traverse $i$ from 1 to n, the dichotomy is:

1. Append the current item to the max subarray end at $i-1$
2. Start a new subarray at $i$

This give us the Bellman Equation:

$$
S(i) = max(S(i-1) + A[i], A[i])
$$

Here, $S(i-1) + A[i]$ means append the current item to the end of the previous max subarray end at $i-1$, $A[i]$ means start a new subarray.

$S(i)$ output **the value of max subarray end at i**.

To use DP, construct an array S.

The base case is S[0] = A[0], since when there's only one item, the item itself is the max subarray.

Then, populate using Bellman Equation given above from 1 to n-1.

To get the overall max subarray, we need to go through the entire S again and get the max value inside S.

## Analysis

Size of S = Size of A.

The array S is populate from 0 to n-1.

The time complexity of this algorithm is $O(n)$.

## Code Solution

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        # Construct the array.
        s = []
        # Populate array.
        s.append(nums[0])
        for i in range(1, len(nums)):
            s.append(max(nums[i] + s[i-1], nums[i]))
        # Get result.
        return max(s)
```
