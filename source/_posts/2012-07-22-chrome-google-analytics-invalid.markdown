---
author: nilennoct
comments: true
date: 2012-07-22 13:21:34
layout: post
slug: chrome-google-analytics-invalid
title: Chrome中Google Analytics无法跟踪
wordpress_id: 103
categories:
- Note
---

之前给博客加上Google Analytics后遇到了一个问题，就是用Chrome时Google Analytics无法获取到访问记录，但是用IE、Firefox却可以记录。通过Chrome的开发者工具中的Network工具，我发现是因为Google Analytics用来提交数据的__utm.gif文件载入失败。

![](http://img.nilennoct.com/wp-content/uploads/2012/07/Network1.jpg)

检查了Chrome、杀毒软件的设置后，均未发现可能造成该问题的选项。

今天在给虚拟机中的Mac安装Chrome时，Chrome自动同步安装了AdBlock，在选择AdBlock的过滤清单时突然看到最后有一个“EasyPrivacy (隐私保护)”清单。

![](http://img.nilennoct.com/wp-content/uploads/2012/07/filter-list.jpg)

看到这个顿时明白问题的原因了。回到Win7的Chrome，打开AdBlock设置一看，果然是打着勾的。去掉以后刷新，Google Analytics就能正常统计了。
