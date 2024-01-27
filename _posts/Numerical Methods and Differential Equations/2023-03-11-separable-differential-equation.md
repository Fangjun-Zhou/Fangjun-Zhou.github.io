---
layout: post
title: Separable Differential Equation
category: numerical-methods-and-differential-equations
---

# Example

Solve the separable first order equation: $\frac{dx}{dt} = x(1-x)$, with $x(0) = x_0$ and $0 < x_0 < 1$.

$$
\begin{aligned}
    \frac{1}{x (1 - x)}dx &= dt \\
    \int_{x_0}^{x} \frac{1}{x (1 - x)}dx &= \int_{0}^{t} dt \\
    \text{Since } \frac{1}{x (1 - x)} &= \frac{1}{x} + \frac{1}{1 - x} \\
    \int_{x_0}^{x} (\frac{1}{x} + \frac{1}{1 - x}) dx &= (ln(x) - ln(1 - x))\vert_{x_0}^{x} \\
    (ln(x) - ln(1 - x)) - (ln(x_0) - ln(1 - x_0)) &= t \\
    ln(\frac{x (1 - x_0)}{x_0 (1 - x)}) &= t \\
    \frac{x (1 - x_0)}{x_0 (1 - x)} &= e^t \\
    \frac{x}{1 - x} &= \frac{x_0 e^t}{1 - x_0} \\
    \text{Add one to both sides:} \\
    \frac{1}{1 - x} &= \frac{x_0 e^t + 1 - x_0}{1 - x_0} \\
    1 - x &= \frac{1 - x_0}{(1 - x_0) + x_0 e^t} \\
    x &= 1 - \frac{1 - x_0}{(1 - x_0) + x_0 e^t}
\end{aligned}
$$
