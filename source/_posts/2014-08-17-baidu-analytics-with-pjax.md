title: 让百度统计支持 PJAX
date: 2014-08-17 15:07:51
categories:
- Note
tags:
- Javascript
- Blog
---
最近把博客系统迁移到 Hexo 上了，作为一名前端工(zha)程(ma)师(nong)，不得不说 Hexo 的相性更好些。

重新做了套新皮肤，简单的做了下对 iPhone 访问的优化，同时使用了已不新鲜的 PJAX 技术。不过发现百度统计还没支持 PJAX，只能记录第一次打开的页面。没办法只能拿统计代码开刀了。

我使用的是百度统计的异步加载模式，整个过程分三步：执行插入页面的异步代码；执行异步加载的`hm.js`；GET 方式请求`hm.gif`传递统计信息。后两步肯定是没法改了，那就看看百度统计的异步代码吧。

```html 百度统计的异步代码
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?/* id here */";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

好吧突然发现这代码和两年前的一模一样，真稳定= =。代码很简单，新建一个`<script>`元素，设置`src`然后插到页面中第一个`<script>`元素前，剩下的就是`hm.js`的事了。因此要完成统计工作，实际上只要在每次通过 PJAX 加载后重新加载`hm.js`就好了。

```html 修改后的代码
<script id="bd-hm">
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?/* id here */";
        hm.onload = function() {
            // 清除百度统计的加载标识
            delete window["_bdhm_loaded_/* id here */"];
        };
        var s = document.getElementById('bd-hm');
        s.parentNode.insertBefore(hm, s);
    })();
</script>
```

然后在 layout 模板中把这段代码从`</head>`前移到合适的位置，在这套主题中，PJAX 请求完替换的是`div#main`的内容，因此放到它的`</div>`前。给`<script>`加`id="bd-hm"`是为了定位统计代码，总不能每次都还是像之前那样插到`<head>`里吧？你要不介意我也没话说= =。
