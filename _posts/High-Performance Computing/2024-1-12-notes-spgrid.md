---
layout: post
title: Notes - SPGrid - A Sparse Paged Grid structure applied to adaptive smoke simulation
category: high-performance-computing
---

## Original Paper

[SPGrid: A Sparse Paged Grid structure applied to adaptive smoke simulation](https://dl.acm.org/doi/10.1145/2661229.2661269)

## Introduction and Related Works

In fluid simulations, sparse data structures are widely used for spacial adaptations.
Previous solutions include CSR grids, oct-trees, and [H-RLE level set](https://doi.org/10.1145/1122501.1122508).
Some more recent studies also used [OpenVDB](https://dl.acm.org/doi/10.1145/2487228.2487235), a B+ tree-like data structure.

Methods such as SCR grids and oct-trees may suffer from low cache hit rate and therefore experience lower computational bandwidth than the theoretical one.

SPGrid also stores the sparse data with minimal memory footprint while maintains a relatively high memory throughput for both sequential and stencil access.
The most important contribution in this work is the hardware acceleration for sparse uniform grids. Each geometric block occupies one memory page. Therefore, the accessed blocks can be cached in TLB.

SPGrid can be compared with another sparse data structure: OpenVDB. According to the authors, “Both SPGrid and VDB seek to accelerate sequential and stencil access. SPGrid places even higher emphasis on optimizing throughput, especially in a multithreaded setting, to levels directly comparable with dense uniform grids.”
This shows that the hardware TLB cache may be faster than the software caches OpenVDB uses in terms of memory throughput.

The comparison between SPGrid and OpenVDB is shown in Table 1.

![Table 1](/images/2024-01-20-22-52-11.png)

For SPGrid, the maximum grid size is limited. However, 16Kx32Kx32K resolution should be far exceeded normal sparse computation requirement. Moreover, similar to OpenVDB, a hash map of SPGrids may be used to support larger sparse structure.

## SPGrid Implementation Details

Two most essential access patterns of SPGrid are sequential access and stencil access. As mentioned in the paper, truly random sparse grid access is uncommon. Therefore, this paper mainly aimed to solve two aforementioned access patterns.
