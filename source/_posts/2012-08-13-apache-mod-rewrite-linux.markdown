---
author: nilennoct
comments: true
date: 2012-08-13 00:39:14
layout: post
slug: apache-mod-rewrite-linux
title: Apache开启mod_rewrite
wordpress_id: 123
categories:
- Note
post_format:
- 日志
---

连接SSH或打开终端

``` bash
sudo a2enmod rewrite
sudo vim /etc/apache2/sites-available/default # 按需求把AllowOverride None 改成 AllowOverride All
sudo service apache2 restart # 或者 sudo /etc/init.d/apache2 restart
```

此时网页目录中的.htaccess文件即可生效。
