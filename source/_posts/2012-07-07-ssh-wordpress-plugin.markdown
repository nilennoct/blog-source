---
author: nilennoct
comments: true
date: 2012-07-07 17:03:58
layout: post
slug: ssh-wordpress-plugin
title: SF通过SSH安装Wordpress插件
wordpress_id: 17
categories:
- Note
tags:
- Blog
---

Putty登录SourceForge的SSH：

1. Session

host name: shell.sourceforge.net, port: 22, SSH

2. Connection->Data

Login detail Auto-login username: user,project-name

3. Connection->SSH

Remote command: create (必填，否则会闪退)

安装插件：

**进入Wordpress插件目录**

``` bash
cd /home/project-web/项目名称/htdocs/blog/wp-content/pluginswget
```

**下载插件包**

在[http://wordpress.org/extend/plugins/](http://wordpress.org/extend/plugins/)找到链接地址(http://downloads.wordpress.org/plugin/syntaxhighlighter.zip)，用wget命令下载

``` bash
wget http://downloads.wordpress.org/plugin/syntaxhighlighter.zip
```

**解压**

``` bash
unzip syntaxhighlighter.zip
```

**进入wordpress后台启用插件**
