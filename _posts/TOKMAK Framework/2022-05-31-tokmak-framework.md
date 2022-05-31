---
layout: post
title: Introduction to TOKMAK Framework
category: tokmak-framework
---

# What Is TOKMAK Framework

TOKMAK Framework is a Unity development framework that provides advanced features to accelerate the development process. TF contains a set of packages that can be used in all kinds of projects.

Basic packages like TOKMAK-Universal-Events can greatly decouple your project, providing easy-to-use global/local event system management. TOKMAK-UI-Stack provides a well-organized UI lifecycle with async animation handler. TOKMAK-Timeline-System provides a high-performance agent to make animation extendable. Packages like TOKMAK-Skill-System and TOKMAK-Weapon-System are optimized for MOBA games or FPS/TPS games.

Simply put, TOKMAK Framework can be a generalized Unity framework to help you better organize your project.

# TOKMAK Framework Support Packages

## com.fintokmak.universaleventsystem

[**Documentation**](https://fangjun-zhou.github.io/TOKMAK-Universal-Event/)

[GitHub repository](https://github.com/Fangjun-Zhou/TOKMAK-Universal-Event)

[NPM Registry](https://www.npmjs.com/package/com.fintokmak.universaleventsystem)

Package Manager Supported GitHub URL: https://github.com/Fangjun-Zhou/TOKMAK-Universal-Event-Release.git

## com.fintokmak.tokmakuistack

[**Documentation**](https://fangjun-zhou.github.io/TOKMAK-UI-Stack/)

[GitHub repository](https://github.com/Fangjun-Zhou/TOKMAK-UI-Stack)

[NPM Registry](https://www.npmjs.com/package/com.fintokmak.tokmakuistack)

Package Manager Supported GitHub URL: https://github.com/Fangjun-Zhou/TOKMAK-UI-Stack-Release.git


## com.fintokmak.timelinesystem

[**Documentation**](https://fangjun-zhou.github.io/TOKMAK-Timeline-System/)

[GitHub repository](https://github.com/Fangjun-Zhou/TOKMAK-Timeline-System)

[NPM Registry](https://www.npmjs.com/package/com.fintokmak.timelinesystem)

Package Manager Supported GitHub URL: https://github.com/Fangjun-Zhou/TOKMAK-Timeline-System-Release.git

# How to Install TOKMAK Framework

## NPM Registry (Recommended)

The easiest way to install TOKMAK-Framework in your project is using the npm registry. Unity has its own npm package resolution implementation (upm), and this standard fully supports the public npm registry. Which can help resolve the package dependency.

### Setup Unity Package Manager (UPM) Custom Registry

Add following registry to UPM `manifest.json` config file:

```
{
    "name": "FinTOKMAK",
    "url": "https://registry.npmjs.org",
    "scopes": [
        "com.fintokmak",
        "com.hextantstudios",
        "com.dbrizov",
        "net.wraithavengames"
    ]
}
```

Your `scopedRegistries` field will looks like this:

![picture 1](/Blog/images/2022-05-31-02-19-16-scoped-registries.png)  

### Add Packages

Add new package from your package manager:

![picture 2](/Blog/images/2022-05-31-02-21-36-package-manager-add-npm.png)  

Find the package name in the supported packages list above and add the package.

![picture 3](/Blog/images/2022-05-31-02-23-21-add-package-name.png)  

When package is successfully added, you can see it in `My Registry` list:

![picture 4](/Blog/images/2022-05-31-02-24-34-npm-add-successful.png)  

For more usage instruction, read [Unity package manager instruction](https://docs.unity3d.com/Manual/Packages.html)

## Install Through GitHub URL

Another way to install TOKMAK Framework is install through GitHub URL directly. However, this requires you to resolve dependencies manually. Follow the dependency resolution instruction inside each package carefully to install.