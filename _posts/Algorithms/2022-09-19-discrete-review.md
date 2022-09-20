---
layout: post
title: Discrete Review
category: algorithms
header-includes:
  - \usepackage[ruled]{algorithm2e}
---

<script
    src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
    type="text/javascript"
></script>
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.js"></script>

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
\begin{algorithm}
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
</pre>

<script>
    pseudocode.renderElement(document.getElementById("hello-world-code"));
</script>
