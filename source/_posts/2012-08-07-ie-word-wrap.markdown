---
author: nilennoct
comments: true
date: 2012-08-07 15:46:07
layout: post
slug: ie-word-wrap
title: 关于ie6、ie7折行问题
wordpress_id: 110
categories:
- Web
- CSS
---

HTML结构及CSS样式如下：

``` css
li {float:left; margin-right:10px; }
```

``` html
<ul>
	<li><a href=”#">文本1</a></li>
	<li><a href=”#">文本2</a></li>
	<li><a href=”#">文本3</a></li>
</ul>
```

这个时候，在ie6、ie7中文字很可能出现断行（暂没发现其他浏览器出现这个问题）

解决问题方法：

1. 如果文本中没有空格，用word-break属性的keep-all参数可解决这个问题。
2. 如果文本中有空格，用white-space属性的nowrap参数可解决问题。
<!-- more -->

细节解释：

1. 在CSS中关于换行的属于有两个分别是word-break以及white-space，其中word-break是IE的专有属性，由于这个折行问题只在IE下会出现，所以先试一下word-break。

	word-break有三个参数：normal、break-all、keep-all

	* normal : 依照亚洲语言和非亚洲语言的文本规则，允许在字内换行
	* break-all : 该行为与亚洲语言的normal相同。也允许非亚洲语言文本行的任意字内断开。该值适合包含一些非亚洲文本的亚洲文本
	* keep-all : 与所有非亚洲语言的normal相同。对于中文，韩文，日文，不允许字断开。适合包含少量亚洲文本的非亚洲文本

	由于是要不允许文本字间断行，所以使用第三个参数keep-all，当文字中有空格的时候，依然会出现折行的现象

2. white-space则是检索对象的空格处理方式的，同样有三个参数：normal、pre、nowrap

	* normal : 默认处理方式
	* pre : 用等宽字体显示预先格式化的文本。不合并字间的空白距离和进行两端对齐。参阅pre对象
	* nowrap : 强制在同一行内显示所有文本，直到文本结束或者遭遇br对象。参阅td，div等对象的nowrap属性（特性）

	所以当文本对象中存在空格，导致文本显示折行的话，可以使用white-space:nowrap，解决文本折行的问题。


