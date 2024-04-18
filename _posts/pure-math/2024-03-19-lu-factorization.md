---
layout: post
title: LU Factorization
category: pure-math
---

## Why LU Factorization

Similar to the iterative solver we covered in the first half of the semester, direct solvers are still trying to solve a large linear system

$$
Ax = b
$$

But this time, we are trying to solve the system by LU-factorizing the coefficient matrix $A$.

As I mentioned in the previous note, matrix factorization is essential for solving linear system.

In this case, since we factorized

$$
A = LU
$$

Where $L$ is a (unit) lower-triangular matrix and $U$ is an upper-triangular matrix.

Solving the original system is equivalent to solving

$$
LUx = b
$$

And we can solve it by solving two linear system

$$
\begin{align*}
    Ly = b \\
    Ux = y
\end{align*}
$$

Solving lower and upper-triangular linear systems is easy. Because we can solve from the first (or last) entry and substitute the solution iteratively.

### Example

Given a matrix $A$

$$
\begin{align*}
    A &= \begin{bmatrix}
        1 & 2 & 3 \\
        -4 & 5 & 6 \\
        7 & -8 & 9
    \end{bmatrix}
\end{align*}
$$

And we try to solve

$$
\begin{align*}
    Ax &= \begin{bmatrix}
        14 \\
        24 \\
        18
    \end{bmatrix}
\end{align*}
$$

for $x$

We use **LU factorization algorithm** to factorize $A$. Notice you don't really need to understand how to perform LU factorization in this course, but I'll still talk about it briefly later.

$$
\begin{align*}
    A &= LU \\
    L &= \begin{bmatrix}
        1 & 0 & 0 \\
        -4 & 1 & 0 \\
        7 & -\frac{22}{13} & 1
    \end{bmatrix} \\
    U &= \begin{bmatrix}
        1 & 2 & 3 \\
        0 & 13 & 18 \\
        0 & 0 & \frac{240}{13}
    \end{bmatrix}
\end{align*}
$$

First, we solve for $y$ in

$$
\begin{align*}
    Ly &= b \\
    \begin{bmatrix}
        1 & 0 & 0 \\
        -4 & 1 & 0 \\
        7 & -\frac{22}{13} & 1
    \end{bmatrix} \begin{bmatrix}
        y_1 \\
        y_2 \\
        y_3
    \end{bmatrix} &= \begin{bmatrix}
        14 \\
        24 \\
        18
    \end{bmatrix}
\end{align*}
$$

Given the first row of matrix $L$, we know $y_1 = 14$

By substituting $y_1 = 14$ in the second row, we have

$$
\begin{align*}
    -4y_1 + y_2 &= 24 \\
    y_2 &= 80
\end{align*}
$$

Finally, by substituting $y_1 = 14$ and $y_2 = 80$ in the last row, we have

$$
\begin{align*}
    7y_1 - \frac{22}{13}y_2 + y_3 &= 18 \\
    y_3 &= \frac{720}{13}
\end{align*}
$$

This algorithm is called forward substitution. And it can be used to solve lower triangular linear systems.

Similarly, you can solve an upper triangular linear system bottom up. And it's called backward substitution.

In this case, we need to solve

$$
\begin{align*}
    Ux &= y \\
    \begin{bmatrix}
        1 & 2 & 3 \\
        0 & 13 & 18 \\
        0 & 0 & \frac{240}{13}
    \end{bmatrix} \begin{bmatrix}
        x_1 \\
        x_2 \\
        x_3
    \end{bmatrix} &= \begin{bmatrix}
        14 \\
        80 \\
        \frac{720}{13}
    \end{bmatrix} \\
    x &= \begin{bmatrix}
        1 \\
        2 \\
        3
    \end{bmatrix}
\end{align*}
$$

The aforementioned steps (factorization, forward substituting, backward substitution) correspond to the three phases in PARDISO library.

But if you really pay attention to what we covered during the class, you'll remember I missed one factor in the factorization phase.

Instead of LU factorization, it's offten better to perform PLU factorization ($A = PLU$ or $A = P^{-1}LU$ if you are a MATLAB user).

The matrix $P$ is introduced to **permutate** (or **pivot**) the original matrix $A$.

Since swapping rows won't change the solution to a linear system, the solution to $LUx = b$ and the solution to $PLUx = b$ are the same except the entries are permuted.

This is because solving an mxm linear system is basically solving m linear equations with m unknowns. The order of the equations has no effect on the solution.

An example is

$$
\begin{align*}
    \begin{bmatrix}
        1 & 2 & 3 \\
        -4 & 5 & 6 \\
        7 & -8 & 9
    \end{bmatrix} x &= \begin{bmatrix}
        14 \\
        24 \\
        18
    \end{bmatrix} \\
    x &= \begin{bmatrix}
        1 \\
        2 \\
        3
    \end{bmatrix}
\end{align*}
$$

After permutation:

$$
\begin{align*}
    \begin{bmatrix}
        7 & -8 & 9 \\
        1 & 2 & 3 \\
        -4 & 5 & 6
    \end{bmatrix} x &= \begin{bmatrix}
        18 \\
        14 \\
        24
    \end{bmatrix} \\
    x &= \begin{bmatrix}
        3 \\
        1 \\
        2
    \end{bmatrix}
\end{align*}
$$

But why do we even need to permute the matrix in the first place? To understand this, we have to first take a look at LU factorization.

Note: You are not required to understand the following note for this course at all. Still, we are just discussing the math in case you are curious (and also for fun, maybe?).

## How to LU Factorize a Matrix

The general idea behind LU factorization is to manipulate the original matrix $A$ to make it "more and more like an upper triangular matrix."

Specifically, let's call the original matrix $A = A_0$. During the first iteration, I want to construct a lower triangular matrix $L_1$ such that when we multiply $A_0$ by $L_1$, we get $A_1 = L_1A_0$. And the **first column** of $A_1$ is upper triangular.

By "the first **column** of $A_1$ is upper triangular", I basically mean I'll make all the entries except for the first one in the first column 0. $A_1$ will be something like this:

$$
A_1 = \begin{bmatrix}
? & ? & \cdots & ? \\
0 & ? & \cdots & ? \\
\vdots & ? & \cdots & ? \\
0 & ? & \cdots & ?
\end{bmatrix}
$$

Next, we'll construct another lower triangular matrix $L_2$ such that when we multiply $A_1$ by $L_2$, we get $A_2 = L_2A_1$. And the **first two column** of $A_2$ is upper triangular. $A_2$ will be something like this:

$$
A_2 = \begin{bmatrix}
? & ? & ? & \cdots & ? \\
0 & ? & ? & \cdots & ? \\
0 & 0 & ? & \cdots & ? \\
\vdots & \vdots & ? & \cdots & ? \\
0 & 0 & ? & \cdots & ?
\end{bmatrix}
$$

You may realize that when $A$ is an mxm matrix, after m-1 iterations, we have $A_{m-1}=L_{m-1} \cdots L_2 L_1 A_0 = U$ is an upper triangular matrix.

What about the lower triangular matrix? Well, I can guarantee you that I'll construct $L_i$ such that $L_i^{-1}$ is also a lower triangular matrix for all $i$. And since the product of two lower triangular matrices is still a lower triangular matrix, we can get the ultimate lower triangular matrix $L = L_1^{-1} L_2^{-1} \cdots L_{m-1}^{-1}$.

### Constructing $L_i$

To find the magical $L_i$, I'll first define a vector

$$
\begin{align*}
    l_i &= \begin{bmatrix}
    0 \\
    \vdots \\
    0 \\
    A_{i-1}(i+1, i) \\
    A_{i-1}(i+2, i) \\
    \vdots \\
    A_{i-1}(m, i) \\
    \end{bmatrix} / A_{i-1}(i, i)
\end{align*}
$$

To describe this vector in English, the first $i$ entries of $l_i$ are all zeros. The rest of it comes from the i-th column of matrix $A_{i-1}$ divided by the ith diagonal entry of $A_{i-1}$

Then,

$$
\begin{align*}
    L_i &= I - l_ie_i^T
\end{align*}
$$

I know this is too confusing to understand, so let me show you an example:

In the matrix factorization example I demonstrated above,

$$
\begin{align*}
    A_0 = A &= \begin{bmatrix}
        1 & 2 & 3 \\
        -4 & 5 & 6 \\
        7 & -8 & 9
    \end{bmatrix}
\end{align*}
$$

This is the starting point. When we want to construct the vector $l_1$, we pick the first column and make the first i entries (which is the first entry in the first iteration) 0. Finally, we divided the entire vector by $A_0(1, 1) = 1$

$$
\begin{align*}
    l_1 &= \begin{bmatrix}
        0 \\
        -4 \\
        7
    \end{bmatrix} / 1 = \begin{bmatrix}
        0 \\
        -4 \\
        7
    \end{bmatrix}
\end{align*}
$$

The helper lower triangular matrix $L_1$ we got is

$$
\begin{align*}
    L_1 &= I - l_1e_1^T \\
    &= I - \begin{bmatrix}
        0 \\
        -4 \\
        7
    \end{bmatrix} \begin{bmatrix}
        1 & 0 & 0
    \end{bmatrix} \\
    &= \begin{bmatrix}
        1 & 0 & 0 \\
        0 & 1 & 0 \\
        0 & 0 & 1
    \end{bmatrix} - \begin{bmatrix}
        0 & 0 & 0 \\
        -4 & 0 & 0 \\
        7 & 0 & 0
    \end{bmatrix} \\
    &= \begin{bmatrix}
        1 & 0 & 0 \\
        4 & 1 & 0 \\
        -7 & 0 & 1
    \end{bmatrix}
\end{align*}
$$

Notice the $l_1e_1^T$ is a 3x3 matrix instead of a single number. because we are multiplying a 3x1 vector to a 1x3 vector. The result is a 3x3 matrix.

By multiplying the $L_1$ by $A_0$, we'll get

$$
\begin{align*}
    A_1 &= L_1 A_0 \\
    &= \begin{bmatrix}
        1 & 2 & 3 \\
        0 & 13 & 18 \\
        0 & -22 & -12
    \end{bmatrix}
\end{align*}
$$

Just as we expected, the first column of $A_1$ is now upper triangular!

Similarly, let's fetch $l_2$ from the second column of $A_1$ and make the first 2 entries 0. Finally, we divided the entire vector by $A_1(2, 2) = 13$

$$
\begin{align*}
    l_2 &= \begin{bmatrix}
        0 \\
        0 \\
        -22
    \end{bmatrix} / 13
\end{align*}
$$

The helper lower triangular matrix $L_2$ we got is

$$
\begin{align*}
    L_2 &= I - l_2e_2^T \\
    &= I - \begin{bmatrix}
        0 \\
        0 \\
        -22
    \end{bmatrix} \begin{bmatrix}
        0 & 1 & 0
    \end{bmatrix} / 13 \\
    &= \begin{bmatrix}
        1 & 0 & 0 \\
        0 & 1 & 0 \\
        0 & 0 & 1
    \end{bmatrix} + \begin{bmatrix}
        0 & 0 & 0 \\
        0 & 0 & 0 \\
        0 & \frac{22}{13} & 0
    \end{bmatrix} \\
    &= \begin{bmatrix}
        1 & 0 & 0 \\
        0 & 1 & 0 \\
        0 & \frac{22}{13} & 1
    \end{bmatrix}
\end{align*}
$$

By multiplying the $L_2$ by $A_1$, we'll get

$$
\begin{align*}
    U = A_2 &= L_2 A_1 \\
    &= \begin{bmatrix}
        1 & 2 & 3 \\
        0 & 13 & 18 \\
        0 & 0 & \frac{240}{13}
    \end{bmatrix}
\end{align*}
$$

We made it! This is the upper triangular matrix I got in the very beginning!

Let's also check if the helper lower triangular matrices I constructed satisfy the special condition I meantioned previously (Inverse of $L_i$ is still lower triangular).

Believe it or not, not only the inverse of $L_i$ is lower triangular, there's also a simple algorithm to find the inverse: just reverse the sign of all the entries but the diagonal entries.

For example, the inverse of

$$
\begin{align*}
    L_1 &= \begin{bmatrix}
        1 & 0 & 0 \\
        4 & 1 & 0 \\
        -7 & 0 & 1
    \end{bmatrix}
\end{align*}
$$

is

$$
\begin{align*}
    L_1^{-1} &= \begin{bmatrix}
        1 & 0 & 0 \\
        -4 & 1 & 0 \\
        7 & 0 & 1
    \end{bmatrix}
\end{align*}
$$

Try to multiply the two matrix together and check if the result is identity.

Now, we can get
$$
\begin{align*}
    L &= L_1^{-1} L_2^{-1} \\
    &= \begin{bmatrix}
        1 & 0 & 0 \\
        -4 & 1 & 0 \\
        7 & 0 & 1
    \end{bmatrix} \begin{bmatrix}
        1 & 0 & 0 \\
        0 & 1 & 0 \\
        0 & -\frac{22}{13} & 1
    \end{bmatrix} \\
    &= \begin{bmatrix}
        1 & 0 & 0 \\
        -4 & 1 & 0 \\
        7 & -\frac{22}{13} & 1
    \end{bmatrix}
\end{align*}
$$

It's probably looks too magical to be true given the example I showed above. But you can try it yourself to make sure I'm not making things up.

If you are really curious about why all the math check out perfectly here. There are some proof behind the algorithm we use.

For example, we chose the vector $l_i$ strategically so that we only cancel out the lower half of the i-th column in $A_{i-1}$ while leave the first i-1 columns intact when multiplying $L_i$.

This can be proved easily by not really computing $L_i$ but multiply $(I - l_ie_i^T)$ to $A_{i-1}$. Then, we should consider it an "updating" operation that subtract $l_ie_i^TA_{i-1}$ from $A_{i-1}$ and $e_i^TA_{i-1}$ is essentially querying the i-th row of matrix $A_{i-1}$. At the end of the day, the only element we are updating is the bottom right part of the matrix and we cancel out the lower half of i-th column perfectly!

There are also more questions to be answered like why the inverse of this particular lower triangular matrix still lower triangular, etc.

If everything I talked about in the past few paragraph sounds like gibberish to you, just ignore it. All I want to say is you can prove the LU factorization will output the result correctly and the example I showed is not a coincidence.

If you want to learn more, take numerical linear algebra :)

## Why Permutation Matrix

So, back to the important question: why permutation?

The simple version of the answer is: there's one step in the LU factorization that can broke.

When computing

$$
\begin{align*}
    l_i &= \begin{bmatrix}
    0 \\
    \vdots \\
    0 \\
    A_{i-1}(i+1, i) \\
    A_{i-1}(i+2, i) \\
    \vdots \\
    A_{i-1}(m, i) \\
    \end{bmatrix} / A_{i-1}(i, i)
\end{align*}
$$

what'll happen when $A_{i-1}(i, i) = 0$?

Well, of course it'll brake, but is it suppose to brake? For example, if A is a singular matrix (non-invertable), it's ok for the algorithm to brake. But when you try some simple examples such as

$$
\begin{align*}
    A &= \begin{bmatrix}
        0 & 2 & 3 \\
        -4 & 5 & 6 \\
        7 & -8 & 9
    \end{bmatrix}
\end{align*}
$$

you'll find $A$ is not a singular matrix at all.

So the algorithm will brake randomly :O

That's not desirable.

A more formal explaination to this situation is **LU factorization is not a stable algorithm**. To understand what does it mean to be stable or unstable, we have to introduced the concept of condition number. Which, again, will be covered in numerical linear algebra.

Long story short, pivoting can solve the issue. For example, moving the third row to the top will make the entire algorithm working again. Try it if you want.
