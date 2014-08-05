---
author: nilennoct
comments: true
date: 2012-08-27 17:42:50
layout: post
slug: js-jquery-countdown-millsecond
title: JS实现倒计时的一种方法
wordpress_id: 129
categories:
- Web
- Javascript
---

最近因为需要试着用Javascript写了一个带毫秒倒计时的小程序，代码如下：

``` html
<span class="min"></span>:<span class="sec"></span>.<span class="millisec"></span>
```

``` js
var inter;
var countdown = function(min) {
	var date = new Date();
	var endTime = date.getTime() + parseInt(min) * 60 * 1000;
	var $min = $('.min');
    clearInterval(inter);
	inter = setInterval(function() {
		var st = new Date();
		var startTime = st.getTime();
		var leftTime = Math.floor((endTime - startTime) / 100);
		if (leftTime <= 0) {
			clearInterval(inter);
			inter = null;
			$.each($min, function(i, t) {
				$(t).text('0').next().text('0').next().text('0');
			});
			return;
		}
		$.each($min, function(i, t) {
			$(t).text(Math.floor(leftTime / 600)).next().text(Math.floor(leftTime / 10) % 60).next().text(leftTime % 10);
		});
	}, 100);
};
```

使用countdown(1)可实现一分钟的倒计时.
