---
layout: post
title: DOTS 0.50.0 Setup in Unity 2020.3.32
which_category: unity-dots 
---

# Unity Requirement

The new DOTS 0.50.0 needs newer versions of Unity. However, since Unity 2021 and 2022 has some compatible issues with DOTS, the recommended Unity version is Unity 2020.3.30 and higher.

To use DOTS 0.50.0, I updated my Unity to 2020.3.32. Although, this needs me to again re-configure my CICD environments. But that's another story. Maybe later in the future, I may spend some time writing about CICD workflow.

# Install Shortcut

The most efficient way to install the DOTS framework is to install the hybrid renderer package since it includes other DOTS packages like Entities and Jobs. 

However, it's worth mentioning that the hybrid renderer will not install any DOTS physics package. So to use the new Unity Physics or Havok Physics, you need to install it manually.

The hybrid render package url: `com.unity.rendering.hybrid`

# Other DOTS Packages

Unity Physics: `com.unity.physics`

Havok Physics: `com.havok.physics`

DOTS Netcode: `com.unity.netcode`