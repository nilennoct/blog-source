---
author: nilennoct
comments: true
date: 2013-04-19 10:21:55
layout: post
slug: shortest-ie-version-detect
title: 最短的 IE 版本判断
wordpress_id: 264
categories:
- Javascript
---

网上看到的一段很酷的代码，留着备用。

``` js
    // ----------------------------------------------------------
    // A short snippet for detecting versions of IE in JavaScript
    // without resorting to user-agent sniffing
    // ----------------------------------------------------------
    // If you're not in IE (or IE version is less than 5) then:
    //     ie === undefined
    // If you're in IE (>=5) then you can determine which version:
    //     ie === 7; // IE7
    // Thus, to detect IE:
    //     if (ie) {}
    // And to detect the version:
    //     ie === 6 // IE6
    //     ie > 7 // IE8, IE9 ...
    //     ie < 9 // Anything less than IE9
    // ----------------------------------------------------------

    // UPDATE: Now using Live NodeList idea from @jdalton

    var ie = (function(){

        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');

        while (
            div.innerHTML = '',
            all[0]
        );

        return v > 4 ? v : undef;

    }());
```
