---
layout: post
title: Quaternion Algebra 2
category: quaternions
---

# Quaternion Products

## Pure Quaternion Products

$$
\begin{aligned}
    q_a &= [0, \textbf{a}] \\
    q_b &= [0, \textbf{b}] \\
    q_a \cdot q_b &= [-\textbf{a} \cdot \textbf{b}, \textbf{a} \times \textbf{b}]
\end{aligned}
$$

## Product of Two Unit-Norm Quaternions

Given:

$$
\begin{aligned}
    q_a &= [s_a, \textbf{a}] \\
    q_b &= [s_b, \textbf{b}]
\end{aligned}
$$

And $\vert q_a \vert = \vert q_b \vert = 1$, their product $q_c = q_a \cdot q_b$ is another unit-norm quaternion, where $\vert q_c \vert = 1$

### Proof

$$
\begin{aligned}
    q_c = [s_c, \textbf{c}] &= [s_a, \textbf{a}][s_b, \textbf{b}] \\
    &= [s_a s_b - \textbf{a} \cdot \textbf{b}, s_a \textbf{b} + s_b \textbf{a} + \textbf{a} \times \textbf{b}]
\end{aligned}
$$

Assuming the angle between $\textbf{a}$ and $\textbf{b}$ is $\theta$, $s_c = s_a s_b - ab \cos \theta$, while $\textbf{c} = s_a a \hat{\textbf{a}} + s_b b \hat{\textbf{b}} + ab \sin \theta (\hat{\textbf{a}} \times \hat{\textbf{b}})$

$$
\begin{aligned}
    s_c^2 &= (s_a s_b - ab \cos \theta)^2 \\
    &= s_a^2 s_b^2 - 2 s_a s_b a b \cos \theta + a^2 b^2 \cos^2 \theta
\end{aligned}
$$

Now, it is a little bit difficult to find $\textbf{c}^2$, but we can utilize the following diagram to find the answer:

![picture 1](/Blog/images/2022-06-14-17-45-24-unit-norm-quaternion-find-vector-c.png)  

In the above picture, $\textbf{d} = s_a a \hat{\textbf{a}} + s_b b \hat{\textbf{b}}$, and the vertical vector is $\textbf{a} \times \textbf{b}$

To find $\textbf{c}^2$ we first need to find $\textbf{d}^2$:

$$
\begin{aligned}
    \textbf{d}^2 &= \vert s_b a \hat{\textbf{a}} \vert ^2 + \vert s_a b \hat{\textbf{b}} \vert ^2 - 2 \vert s_b a \hat{\textbf{a}} \vert \vert s_a b \hat{\textbf{b}} \vert \cos (\pi - \theta) \\
    &= s_b^2 a^2 + s_a^2 b^2 - 2 s_a s_b a b \cos (\pi - \theta) \\
    &= s_b^2 a^2 + s_a^2 b^2 + 2 s_a s_b a b \cos \theta
\end{aligned}
$$

Then, 
$$
\begin{aligned}
    \textbf{c}^2 &= \textbf{d}^2 + a^2 b^2 \sin^2 \theta \\
    &= s_b^2 a^2 + s_a^2 b^2 + 2 s_a s_b a b \cos \theta + a^2 b^2 \sin^2 \theta
\end{aligned}
$$

Remember, $\vert q_a \vert = \vert q_b \vert = 1$, so $s_a^2 + a^2 = s_b^2 + b^2 = 1$

$$
\begin{aligned}
    \vert q_c \vert &= s_c^2 + c^2 \\
    &= s_a^2 s_b^2 - 2 s_a s_b a b \cos \theta + a^2 b^2 \cos^2 \theta + s_b^2 a^2 + s_a^2 b^2 + 2 s_a s_b a b \cos \theta + a^2 b^2 \sin^2 \theta \\
    &= s_a^2 s_b^2 + a^2 b^2 + s_b^2 a^2 + s_a^2 b^2 \\
    &= s_a^2 (s_b^2 + b^2) + a^2 (s_b^2 + b^2) \\ 
    &= s_a^2 + a^2 \\
    &= 1
\end{aligned}
$$