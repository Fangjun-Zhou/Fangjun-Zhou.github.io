---
layout: post
title: Logistic Regression
category: machine-learning
---

# Perception Algorithm

In perception algorithms, the goal is to find a function that best predicts the output base on features.

The input $x_i$ is a vector of dimensions $j$ and the output $y_i$ is a number related to the feature.

Linear function $f$ uses weight vector $w$ and bias $b$ to predict the output $y_i$:

$$
y_i = f(x_i) = w^T x_i + b
$$

Where activation function $a_i$ can transform $f(x_i)$ to 1 or 0:

$$
a_i = \mathbb{1} (f(x_i))
$$

When updating the weights and bias, the error between the output predicted by activation function $a_i$ and the real output $y_i$ is multiplied by the learning rate $\alpha$:

$$
\begin{aligned}
    w &= w - \alpha \cdot (a_i - y_i) x_i \\
    b &= b - \alpha \cdot (a_i - y_i)
\end{aligned}
$$

# Loss Function

When describing the prediction of the output, the loss function is used to measure the error.

In the example of perception algorithm, the loss function is just the number of unmatched outputs:$\sum_{i=1}^{n} \mathbb{1}_{f(x_i) \ne y_i}$.

What we were doing was to find the function that minimize the error.

$$
\hat{f} = argmin \sum_{i=1}^{n} \mathbb{1}_{f(x_i) \ne y_i}
$$

The problem with the loss function above is that it is only able to measure the number of errors.

So the square loss function is used to better measure the overall correctness of the prediction.

The square loss function sum the square of the error and divide by 2:

$$
\frac{1}{2} \sum_{i=1}^{n} (f(x_i) - y_i)^2
$$

# Overfitting

When we have the loss function to measure the error, and try to find the function that best predict the output, the overfitting problem is raised.

To solve this problem, we should limited the available functions in a hypothesis space.

While we cannot chose any function that match the output, the limited choice falls into the original linear function.

## Problems with Linear Function

1. When using linear function the range is $[-\infty, \infty]$. Since the lable is usually 0 or 1, most results will have a very high error.
2. When predicting using the input vector, the result is smooth so that it is not suitable to classify the data into groups.

## Activation Function

Activation function is used to transform the output of the linear function to value range from 0 to 1.

In the example of perception algorithm, the activation function $g$ is the $\mathbb{1}$ function:

$$
g(x) = \mathbb{1} \{ x \ge 0 \}
$$

Another type of non-linear activation function is the sigmoid function:

$$
g(x) = \frac{1}{1 + e^{-x}}
$$

This $g$ is also called the logistic function.

# Cross Entropy Loss Function

With sigmoid activation function, a new loss function called log cost function is used:

$$
C(f) = -\sum_{i=1}^{n} y_i \log(f(x_i)) - (1 - y_i) \log(1 - f(x_i))
$$

Note that the $f(x_i)$ here is actually the output of the activation function $g$.

In other words, the overall logistic regression problem can be summarized as:

$$
(\hat{w}, \hat{b}) = argmin -\sum_{i=1}^{n} y_i \log(a_i) - (1 - y_i) \log(1 - a_i)
$$

Where

$$
a_i = \frac{1}{1+e^{-z_i}}
$$

And

$$
z_i = w^T x_i + b
$$

# Gradient Descent

To find where $-\sum_{i=1}^{n} y_i \log(a_i) - (1 - y_i) \log(1 - a_i)$ is minimized, we can take the derivative (gradient) of the loss function:

The gradient of $C$ with respect to $w$ is:

$$
\begin{aligned}
    \frac{\partial C}{\partial w} = \frac{\partial C}{\partial a_i} \frac{\partial a_i}{\partial w} \\
\end{aligned}
$$

To find $\frac{\partial a_i}{\partial w}$, we can first find $\frac{\partial a_i}{\partial z_i}$, and multiply it by $\frac{\partial z_i}{\partial w}$:

$$
\begin{aligned}
    \frac{\partial a_i}{\partial z_i} &= (\frac{1}{1+e^{-z_i}})' \\
    &= -\frac{(1+e^{-z_i})'}{(1+e^{-z_i})^2} \\
    &= \frac{e^{-z_i}}{(1+e^{-z_i})^2} \\
    &= a_i (1-a_i)
\end{aligned}
$$

$$
\begin{aligned}
    \frac{\partial z_i}{\partial w} &= \frac{\partial (w^{T}x_i + b)}{\partial w} \\
    &= x_i
\end{aligned}
$$

So the gradient of $C$ with respect to $w$ is:

$$
\begin{aligned}
    \frac{\partial C}{\partial a_i} &= y_i \frac{1}{a_i} - (1-y_i) \frac{1}{1-a_i} \\
    &= \frac{y_i(1-a_i)-(1-y_i)a_i}{a_i(1-a_i)} \\
    &= \frac{y_i-a_i}{a_i(1-a_i)} \cdot a_i(1-a_i) x_i \\
    &= (y_i-a_i)x_i
\end{aligned}
$$

For logistic regression, the gradient decent algorithm is:

$$
\begin{aligned}
    w &= w - \alpha \sum_{i=1}^{n} (a_i - y_i) x_i \\
    b &= b - \alpha \sum_{i=1}^{n} (a_i - y_i) \\
    a_i &= g(w^T x_i + b) \\
    g(x) &= \frac{1}{1+e^{-x}} \\
\end{aligned}
$$
