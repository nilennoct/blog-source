---
author: nilennoct
comments: true
date: 2012-07-14 23:36:26
layout: post
slug: ios-l2tp-no-secret-key
title: iOS免密钥连接L2TP协议VPN
wordpress_id: 96
categories:
- iOS
post_format:
- 日志
---

学校里使用的VPN采用的是不需要密钥验证的L2TP协议，而iOS系统中连接L2TP的VPN时必须输入密钥，否则无法保存VPN设置。碰到这种情况可以用iFile或者iTools在 /etc/ppp/ 目录中新建一名为"options"的文本文件，打开输入以下内容：

```
plugin L2TP.ppp
l2tpnoipsec
```

即可实现免密钥连接L2TP协议的VPN了（若不行请重启SpringBoard）。
