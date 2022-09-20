---
layout: post
title: Discrete Review
category: algorithms
header-includes:
  - \usepackage[ruled]{algorithm2e}
---

# Answer Sheet

[Answer Sheet](/Blog/documents/Assignment1_solution.pdf)

# Writing Assignment

## 3d

$$
\{ (x, y): x = y \}
$$

reflexive, symmetric, antisymmetric, transitive

- reflexive: $x = x$
- symmetric: $x = y \implies y = x$
- antisymmetric: $x = y \land y = x \implies x = y$
- transitive: $x = y \land y = z \implies x = z$

![Injective, Surjective, Bijective](https://homework.study.com/cimages/multimages/16/jections702083845367077364.png)

## 16a

<pre id="hello-world-code" style="display:hidden;">
    \begin{algorithmic}
    \PRINT \texttt{'hello world'}
    \end{algorithmic}
</pre>

$$
\begin{algorithm}[H]
    \DontPrintSemicolon
    \KwIn{$a$: A non-empty array of integers (indexed starting at 1)}
    \KwOut{The smallest element in the array}
    \Begin{
        $min \gets \infty$\;
        \For{$i \gets 1$ \KwTo len($a$)}{
        \If{$a[i] < min$} {
            $min \gets a[i]$\;
        }
        }
        \Return{$min$}\;
    }
    \caption{findMin}
\end{algorithm}
$$
