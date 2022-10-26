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

# Divide and Conquer

There's another solution to this problem using DC.

Given an array A, we can first search the value of max subarray on the left and right half of A. Then find the value of the max subarray cross the midpoint. Then return the max value of these three results.

This is the pseudo code:

![picture 1](/Blog/images/2022-10-26-10-45-50-max-subarray-dc.png)

Here, the $MidMaxSubarray$ first search the max subarray on the left that **ends at m-1**. Then search the max subarray **start at m**. Then combine the two results.

This extra step is necessary and we cannot use the result from $A_1$ and $A_2$ directly since $A_1$ and $A_2$ may not be able to connect.

## Analysis

The $MidMaxSubarray$ search two separate arrays linearly. So its time complexity is $O(n)$

There are two recursive calls in $MaxSubarray$, each with size n/2.

So we have the recurrence:

$$
T(n) \le 2T(n/2) + cn = O(nlogn)
$$

## Code Solution

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        return self.maxSubArrayHelper(nums, 0, len(nums))

    def maxSubArrayHelper(self, nums: List[int], i: int, j: int) -> int:
        """
        Return the sum of max subarray from nums[i, j)
        """
        # Base case: If there's only one item in nums.
        if j - i == 1:
            return nums[i]

        # Get the mid index.
        m = int((i + j)/2)

        # Get the value of max subarray from [i, m)
        l = self.maxSubArrayHelper(nums, i, m)
        # Get the value of max subarray from [m, j)
        r = self.maxSubArrayHelper(nums, m, j)

        # Find the max subarray cross m.
        # Left max subarray end at m-1.
        maxP = nums[m-1]
        val = 0
        for p in range(m-1, i-1, -1):
            val += nums[p]
            if val > maxP:
                maxP = val
        # Right max subarray start at m.
        maxQ = nums[m]
        val = 0
        for q in range(m, j, 1):
            val += nums[q]
            if val > maxQ:
                maxQ = val
        c = maxP + maxQ

        return max(l, r, c)

```
