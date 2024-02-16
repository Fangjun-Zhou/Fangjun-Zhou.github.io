---
layout: post
title: Laplacian, Linear System, and Matrix Factorization
category: pure-math
---

Last year, when I took CS 639, some math related to the course, such as Laplacian and using numerical methods to solve linear systems, confused me for a while.

These are not the prerequisites of the course. But I did wish to understand what was going on behind the scenes.

I took CS 412, Introduction to Numerical Methods, last semester and CS 513, Numerical Methods for Linear Algebra, this semester. I'm writing this note to let you know some of the details I learned, and I hope this helps you better understand the material.

## Why Laplacian?

In the heat dissipation example, we learned in class that the final temperature of the grid was found by solving the linear system related to a Laplacian stencil. This is related to three properties we want for the field:

- Steady heat flow: The temperature gradient flow does not change over time.
- Incompressible heat flow: Heat does not spontaneously emerge or disappear.
- Irrotational heat flow: There's no heat flow spinning inside our cube.

To guarantee these three properties, we need to satisfy the Laplace's equation:

$$
\Delta f = 0
$$

Where

$$
\Delta f = \sum_{i} \frac{\partial^2f}{\partial x_i^2}
$$

Note that

$$
\begin{align}
    v &= \nabla f \\
    \nabla \cdot v &= \sum_{i} \frac{\partial^2f}{\partial x_i^2} = \Delta f
\end{align}
$$

So, the Laplacian of a heat field is also the divergence of the heat flow.

Since this is not an Engineering class, we don't cover the details of Laplace's equation. But I found a [great video](https://youtu.be/zN0zDrQimXU) about this topic!

## How's that Related to Stencil

So, how's this related to the $-6$ and $+1$ stencil we used in the lectures? It turns out that when you want to calculate the Laplacian of a discrete grid, you can use the [Discrete Laplace Operator](https://en.wikipedia.org/wiki/Discrete_Laplace_operator).

In the 2D example, the Laplacian of field $f$ at position $(x, y)$ is approximate to

$$
\Delta f(x, y) \approx \frac{f(x - h, y) + f(x + h, y) + f(x, y - h) + f(x, y + h) - 4f(x, y)}{h^2}
$$

Looks familiar? This is exactly the $-4$ and $+1$ stencil we used in the 2D case when $h=1$!

The discrete Laplacian stencil is calculating the **approximated Laplacian at each location of a certain grid**. We need to solve this equation to constrain our object's three properties.

And when we convert the Laplacian stencil to a matrix $L$, we got

$$
Lx = b
$$

Where $L$ is the discrete Laplacian operator in the matrix format, $b$ is the Laplacian we want to get.

Remember, the Laplacian of the field is also the divergence of the heat gradient flow. So, a positive value in $b$ means there's a heat source at the point. That's why we initially set the side of $b$ to 1.

![x 0001](https://github.com/fangjunzhou/fangjunzhou.github.io/assets/79500078/d14107ef-9cf5-49b1-8a13-3890850724b8)
![x 0256](https://github.com/fangjunzhou/fangjunzhou.github.io/assets/79500078/5dd313e6-4e2a-4c65-b4d0-50fdc417de38)


OK, we can get the final steady state of the heat dissipation problem by solving this linear system, but how do we solve it?

## Matrix Factorization

**Disclaimer**: learning numerical methods to solve linear systems is not required in this class. It's just fun to learn why we need to use different methods to do the same thing :)

To solve a linear system $Ax = b$ numerically, there are two types of algorithms:

- Direct solvers
- Indirect solvers

To solve the matrix directly, you need to **factorize** it. Two major matrix factorization algorithms are:

- LU factorization
- QR factorization

LU factorization factors any **invertible** matrix A into

$$
A = LU
$$

Where $L$ is a lower-triangular matrix, and $U$ is an upper-triangular matrix. How is this helpful in solving the linear system?

$$
\begin{align}
    Ax &= b \\
    LUx &= b
\end{align}
$$

Let $y = Ux$, we have

$$
\begin{align}
    Ly &= b \\
    Ux &= y
\end{align}
$$

So solving the linear system $Ax = b$ for x becomes solving two **easier** linear systems $Ly = b$ for y and $Ux = y$ for x.

Solving linear systems with upper or lower triangular coefficient matrices is easy because you can solve and substitute entries row by row. This step is called forward or backward substitution.

QR factorization factors any **invertible** matrix A into

$$
A = QR
$$

Where $Q$ is an orthogonal matrix, and $R$ is an upper-triangular matrix. How is this helpful in solving the linear system?

Orthogonal matrices have a very nice property:

$$
Q^{-1} = Q^T
$$

So, again, we went from solving $Ax = b$ for x to solving $Qy = b$ for y and $Rx = y$ for x.

We just mentioned that solving linear systems with upper triangular coefficient matrices is easy. It's also obvious that solving linear systems with orthogonal coefficient matrices is easy.

All you have to do is left-multiply both sides by its inverse (transpose).

$$
\begin{align}
    Qy &= b \\
    Q^TQy &= Q^Tb \\
    &= y
\end{align}
$$

OK, if the direct method is good, why the conjugate gradient method?

## Time and Space Complexity

The problem with direct methods is that the time complexity for LU factorization and QR factorization are both $O(n^3)$. This matrix $A$ can get to a huge size in our heat dissipation simulation.

Remember, the grid size is $256^3 = 2^24$. This is only the length of $A$ because we stretched the grid into a vector and multiplied that vector by $A$. So the size of $A$ is $256^3 \cdot 256^3$. With this kind of linear system, you don't want to solve it with a direct solver not only because the time complexity just skyrocketed but also because it's impossible to even store the matrix in **dense format**.

The indirect methods, such as the conjugate gradient method, can be faster than the direct methods when the matrix is large. This is because it just iteratively improves the matrix to make it closer to the root. The solver does not need to actually "solve" the system but to bring the result accurate enough so that the error is close or even smaller than the system floating point accuracy limit. This is the intuition and beauty behind a lot of numerical methods.

Another major benefit of using the conjugate gradient method is that you don't need to actually store the matrix. Just like what we discussed during the lecture, applying stencil with code is **equivalent** to applying the Laplacian stencil matrix! A stencil kernel is almost the most elegant way to store the matrix with no memory footprint.

## Wait, the Matrix is Almost Empty

When I said it's impossible to store the matrix in **dense format**, you may realize it's possible to get around this memory limitation. Because the matrix we constructed from Laplacian stencil, despite its huge size, is mostly zero. That's why we call it **sparse matrices**.

It's obvious that we don't need to store those zeros in memory. That's why we'll learn the CSR format to compress the matrix into a condensed soup. But it's still annoying when you need to factor it in direct solvers, especially when you want to squeeze that SIMD performance. This is also why we appreciate MKL achieving a relatively high memory bandwidth to deal with such a messy task. You'll learn the details later in this course.

## OK, but How to Factor the Matrix Though

If you are like me, who is also bad at math but still curious about what's going on behind that matrix factorization math, I'll post another note about how matrix factorization works and why its time complexity is $O(3)$. Because I've just learned it recently from my numerical linear algebra class :)

If you are curious about how the conjugate gradient method works, I may try to post another post later this semester because we haven't covered all the stuff about indirect solvers yet :(
