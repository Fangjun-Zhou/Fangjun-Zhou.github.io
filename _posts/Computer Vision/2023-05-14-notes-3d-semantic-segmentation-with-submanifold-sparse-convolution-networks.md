---
layout: post
title: Notes - 3D Semantic 
category: computer-vision
---

# Notes: 3D Semantic Segmentation with Submanifold Sparse Convolutional Networks

## Original Paper

[3D Semantic Segmentation with Submanifold Sparse Convolutional Networks](https://arxiv.org/abs/1711.10275)

## Introduction

CNNs are widely used to solve many computer vision tasks, while the number of points on the grid grows exponentially with its dimensionality.

Traditional neural networks are optimized for dense data. Therefore, the negative impact on performance may manifest when sparse data are processed (3D point cloud data for example).

To solve this problem, Submanifold Sparse Convolutional Network (SSCN) is proposed in this paper.

## Related Work

Previous studies about sparse convolutional networks have been done in [Vote3Deep: Fast Object Detection in 3D Point Clouds Using Efficient Convolutional Neural Networks](https://arxiv.org/abs/1609.06666), [Sparse 3D convolutional neural networks](https://arxiv.org/abs/1505.02890), and [OctNet: Learning Deep 3D Representations at High Resolutions](https://arxiv.org/abs/1611.05009).

Vote3Deep achieves greater sparsity after convolution with ReLUs and a special loss function.

Sparse 3D CNN considered all the sites with at least one active input as active. This will lead to an decrease in sparsity after each convolutional layer. This behavior will be discussed later in this note.

OctNet uses oct-trees to handle sparse data, which is a common trick in computer graphics.

## Spacial Sparsity for ConvNets

A d-dimensional CNN is a network that takes (d+1)-dimensional tensors as input:
These tensors contain d spacial dimensions and 1 feature space dimension.

For example, a traditional 2D CNN accept a 3D tensor as the input. 2 dimensions correspond to the coordinates of each pixel. While an extra dimension stores the color channels as features.

"The input corresponds to a d-dimensional grid of sites, each of which is associated with a feature vector." Here, a site is defined as a point in the spacial dimension.

A site is active if any element in the feature vector is not in its *ground state*, e.g., if it is non-zero.

**Note that a site corresponds to one feature vector, and this feature vector may contains multiple features.** The site will be defined active when at least one of the feature is not in ground state. The authors describe this behavior as d-dimensional activity in (d+1)-dimension tensors.

In the paper that introduced Sparse 3D CNN, a site in hidden layer will be activate if any of the sites in the layer that it takes as input is active. In this case, the activity structure of each hidden layer can be calculated from the previous layer.

This implementation also leads to an decrease in sparsity as data propagating through the network. With 3x3 convolution layers in a d-dimensional network, a layer with $1$ active site will contribute to $(1+2n)^d$ active sites after n layers. The advantage of handling sparse data will soon be compromised after several convolution layers. And this problem is harmful in some structures such as U-Net, as most sites may be active in low resolution layers after convolutions and polling.

This issue is less severe when the input data is relative dense. But the aforementioned data dilation issue is problematic in cases incorporate d-dimensional structures in (d+1)-dimensional input (a 2d surface in 3d space). A classical example is 3D point-cloud data, which often represents 2d surfaces.

The author refer to this problem as "submanifold dilation problem".
