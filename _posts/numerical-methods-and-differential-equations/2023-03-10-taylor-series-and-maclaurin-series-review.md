---
layout: post
title: Taylor Series and Maclaurin Series Review
category: numerical-methods-and-differential-equations
---

# Taylor Polynomial

Find the 4-th degree Taylor polynomial for $f(x) = ln(x)$ centered at $c = 1$ and use it to approximate $ln(1.1)$

$$
p_n(x) = f(c) + \frac{f'(c) (x-c)^1}{1!} + \frac{f''(c) (x-c)^2}{2!} + \frac{f^3(c) (x-c)^3}{3!} + \cdots
$$

Since:

$$
\begin{aligned}
    f(x) &= ln(x) \\
    f'(x) &= \frac{1}{x} \\
    f''(x) &= -\frac{1}{x^2} \\
    f^3(x) &= \frac{2}{x^3} \\
    f^4(x) &= -\frac{6}{x^4} \\
    p(x) &= ln(1) + \frac{f'(1) (x-1)^1}{1!} + \frac{f''(1) (x-1)^2}{2!} + \frac{f^3(1) (x-1)^3}{3!} + \frac{f^4(1) (x-1)^4}{4!} \\
    &= 0 + (x - 1) + \frac{-1 (x - 1)^2}{2!} + \frac{2 (x - 1)^3}{3!} + \frac{-6 (x - 1)^4}{4!} \\
\end{aligned}
$$

# Taylor Series

## Example 1

Find a Taylor series for the function $f(x) = ln(x)$ centered at $c = 1$.

$$
\begin{aligned}
    f(x) &= ln(x) \\
    f'(x) &= \frac{1}{x} \\
    f''(x) &= - \frac{1}{x^2} \\
    f^3(x) &= \frac{2}{x^3} \\
    f^4(x) &= - \frac{6}{x^4}
\end{aligned} \\
\begin{aligned}
    ln(x) &= ln(1) + 1 (x - 1)' - \frac{1 (x - 1)^2}{2!} + \frac{2 (x - 1)}{3!} - \frac{6 (x - 1)^4}{4!} + \cdots \\
    ln(x) &= \frac{(x - 1)^1}{1} - \frac{(x - 1)^2}{2} + \frac{(x - 1)^3}{3} - \frac{(x - 1)^4}{4} + \cdots \\
    &= \sum_{n = 0}^{\infty} \frac{(-1)^n (x - 1)^{n + 1}}{n + 1}
\end{aligned}
$$

## Example 2

Find the Taylor series for the function $f(x) = e^x$ centered at $c = 3$

$$
\begin{aligned}
    f'(x) &= f''(x) = f^3(x) = f^4(x) = e^x \\
    f(3) &= f'(3) = f''(3) = \cdots = e^3 \\
    f(x) = e^x &= f(c) + f'(c)(x - c)^1 + \frac{f''(c)(x - c)^2}{2!} + \frac{f^3(c)(x - c)^3}{3!} + \cdots \\
    &= e^3 + e^3(x-3)^1 + \frac{e^3 (x - 3)^2}{2!} + \frac{e^3 (x - 3)^3}{3!} + \cdots \\
    &= \sum_{n = 0}^{\infty} \frac{e^3 (x - 3)^n}{n!}
\end{aligned}
$$

# Maclaurin Series

Maclaurin series is the Taylor series centered at $c = 0$.

Find the Maclaurin series for the function $f(x) = sin(x)$

$$
\begin{aligned}
    f(x) &= sin(x) \\
    f'(x) &= cos(x) = f^5(x) \\
    f''(x) &= -sin(x) = f^6(x) \\
    f^3(x) &= -cos(x) = f^7(x) \\
    f^4(x) &= sin(x) = f^8(x)
\end{aligned}
$$

As $c = 0$

$$
\begin{aligned}
    f(0) &= sin(0) = 0 \\
    f'(0) &= cos(0) = 1 = f^5(0) \\
    f''(0) &= -sin(0) = 0 = f^6(0) \\
    f^3(0) &= -cos(0) = -1 = f^7(0) \\
    f^4(0) &= sin(0) = 0 = f^8(0)
\end{aligned} \\
\begin{aligned}
    f(x) &= f(0) + f'(0)(x)^1 + \frac{f''(0)x^2}{2!} + \frac{f^3(0)x^3}{3!} + \cdots \\
    f(x) &= 0 + 1x + 0 + \frac{-x^3}{3!} + 0 + \frac{1x^5}{5!} + 0 + \frac{1x^7}{7!} + \cdots \\
    &= \sum_{n = 0}^{\infty} \frac{(-1)^n x^{2n + 1}}{(2n + 1)!}
\end{aligned}
$$
