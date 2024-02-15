---
layout: post
title: Dot Product of Vector with its Derivative
category: miscellaneous
---

# Theorem to Proof

Given $f(x) = \sum_{k=0}^{n} f_k(x) \vec{e}_k$ is a differentiable vector.

$$
f(x) \cdot \frac{d f(x)}{dx} = \vert f(x) \vert \frac{d \vert f(x) \vert}{dx}
$$

Where $\vert f(x) \vert$ is the mod of $f(x)$, $\frac{d f(x)}{dx}$ is the derivative of $f(x)$, and $\frac{d \vert f(x) \vert}{dx}$ is the derivative of $\vert f(x) \vert$.

# Why This Theorem is NOT Obvious

Consider $f(x)$ is a vector, $\frac{d f(x)}{dx}$ is the derivative of the vector, which is another vector.

$f(x) \cdot \frac{d f(x)}{dx}$ is the dot product between two vectors. The result should be a value.

$\frac{d \vert f(x) \vert}{dx}$ is the derivative of the mod of the vector, which is a value. $\vert f(x) \vert \frac{d \vert f(x) \vert}{dx}$ is another value.

We need further proof to show that this theorem is true.

# Proof

Consider $f(x) = \sum_{k=0}^{n} f_k(x) \vec{e}_k$, $\frac{d f(x)}{dx} = \sum_{k=0}^{n} \frac{d f_k(x)}{dx} \vec{e}_k$

Thus,

$$
\begin{aligned}
    f(x) \cdot \frac{d f(x)}{dx} &= f(x) \cdot \sum_{k=0}^{n} \frac{d f_k(x)}{dx} \vec{e}_k \\
    &= \sum_{k=0}^{n} f_k(x) \frac{d f_k(x)}{dx}
\end{aligned}
$$

Then, let's expand $\frac{d \vert f(x) \vert}{dx}$:

$$
\begin{aligned}
    \frac{d \vert f(x) \vert}{dx} &= \frac{d}{dx} \sqrt{\sum_{k=0}^{n} (f_k(x))^2} \\
    &= \frac{d}{dx} (\sum_{k=0}^{n} (f_k(x))^2)^{\frac{1}{2}}
\end{aligned}
$$

When the chain rule is applied:

$$
\begin{aligned}
    \frac{d \vert f(x) \vert}{dx} &= \frac{d}{dx} (\sum_{k=0}^{n} (f_k(x))^2)^{\frac{1}{2}} \\
    &= \frac{1}{2 \sqrt{(\sum_{k=0}^{n} (f_k(x))^2)}} \frac{d}{dx} \sum_{k=0}^{n} (f_k(x))^2 \\
    &= \frac{1}{2 \vert f(x) \vert} \sum_{k=0}^{n} \frac{d}{dx} ((f_k(x))^2) \\
    &= \frac{1}{2 \vert f(x) \vert} \sum_{k=0}^{n} 2 f_k(x) \frac{d}{dx} f_k(x) \\
    &= \frac{1}{\vert f(x) \vert} \sum_{k=0}^{n} f_k(x) \frac{d}{dx} f_k(x) \\
\end{aligned}
$$

Remember that $f(x) \cdot \frac{d f(x)}{dx} = \sum_{k=0}^{n} f_k(x) \frac{d f_k(x)}{dx}$,

$$
\begin{aligned}
    \frac{d \vert f(x) \vert}{dx} &= \frac{1}{\vert f(x) \vert} \sum_{k=0}^{n} f_k(x) \frac{d}{dx} f_k(x) \\
    &= \frac{1}{\vert f(x) \vert} f(x) \cdot \frac{d f(x)}{dx}
\end{aligned}
$$

Thus,

$$
\vert f(x) \vert \frac{d \vert f(x) \vert}{dx} = f(x) \cdot \frac{d f(x)}{dx}
$$
