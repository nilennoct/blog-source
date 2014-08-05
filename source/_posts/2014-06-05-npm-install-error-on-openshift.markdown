---
layout: post
title: "解决 OpenShift 部署 node 应用不能自动重启"
date: 2014-06-05 10:42:34 +0800
comments: true
categories: 
- Note
---
最近在做一个 node.js  的小项目，用来管理 blog 中使用的图片，部署在 openshift 上，但是一直有一个奇怪的问题，就是每次用 git push 完代码以后，应用都是一直处于 building 状态而不会自动重启。查看日志以后发现是 npm 在安装 package 的时候找不到有效的版本：

> remote: npm ERR! Error: No compatible version found: body-parser@'^1.2.0'

但在给出的 Valid install targets 中却明明包含了 `body-parser 1.2.0`。因为这个问题，每次部署完都得手动重启应用，实在是让人觉得有些麻烦。

既然本地运行没有问题，说明应该是服务器的 npm 或 node.js 的版本问题。可以在本地安装好所需要的 package 后，使用 `npm shrinkwrap` 锁定已安装的 package 的版本，此次目录下会生成一个 `npm-shrinkwrap.json` 文件，重新 push 到服务器部署就不会再出现原来的问题了。只是这样 package 的安装、更新等管理工作就需要放在本地了。

> **npm shrinkwrap**
	
> This command locks down the versions of a package's dependencies so that you can control exactly which versions of each dependency will be used when your package is installed. The "package.json" file is still required if you want to use "npm install".
	
> [More about npm shrinkwrap](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html)
