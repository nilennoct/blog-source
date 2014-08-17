---
author: nilennoct
comments: true
date: 2012-08-09 15:38:09
layout: post
slug: ie6-position-fixed-bug
title: 完美解决IE6不支持position:fixed的bug
wordpress_id: 120
categories:
- CSS
---

最近在写前端的时候发现IE6下存在不支持position:fixed的bug。通过查找资料找到了较完美的的解决方法。代码如下：

``` css
/* 除IE6浏览器的通用方法 */
.ie6fixedTL{position:fixed;left:0;top:0}
.ie6fixedBR{position:fixed;right:0;bottom:0}
/* IE6浏览器的特有方法 */
/* 修正IE6振动bug */
* html,* html body{background-image:url(about:blank);background-attachment:fixed}
* html .ie6fixedTL{position:absolute;left:expression(eval(document.documentElement.scrollLeft));top:expression(eval(document.documentElement.scrollTop))}
* html .ie6fixedBR{position:absolute;left:expression(eval(document.documentElement.scrollLeft+document.documentElement.clientWidth-this.offsetWidth)-(parseInt(this.currentStyle.marginLeft,10)||0)-(parseInt(this.currentStyle.marginRight,10)||0));top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)))}
```
<!-- more -->

说明：

``` css
* html,* html body{background-image:url(about:blank);background-attachment:fixed}
```

用于解决悬浮的元素出现振动的bug。因为IE有一个多步的渲染进程。当你滚动或调整你的浏览器大小的时候，它将重置所有内容并重画页面，这个时候它就会重新处理css表达式。这会引起一个丑陋的“振动”bug，在此处固定位置的元素需要调整以跟上你的(页面的)滚动，于是就会“跳动”。

解决此问题的技巧就是使用background-attachment:fixed为body或html元素添加一个background-image。这就会强制页面在重画之前先处理CSS。因为是在重画之前处理CSS，它也就会同样在重画之前首先处理你的CSS表达式。从而实现完美的平滑的固定位置元素。
