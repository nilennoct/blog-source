---
author: nilennoct
comments: true
date: 2013-03-02 00:22:43
layout: post
slug: raspberrypi-install-lamp
title: 在RaspberryPi上安装LAMP
wordpress_id: 145
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

既然已经在RaspberryPi上安装了Linux系统，很自然的我们可以想到在其上安装LAMP，使其变为随身服务器。

本文设备环境：

- Raspberry Pi B板

- 系统镜像：2012-12-16-wheezy-raspbian.img[[下载](http://pan.baidu.com/share/link?shareid=318970&uk=3842409107)]

**图文攻略：**

**使用putty连接并登陆Raspberry**

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301214608.png)

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301214644.png)
<!-- more -->

**更新软件源**

``` bash
sudo apt-get update
```

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301215805.png)

**安装LAMP**

``` bash
sudo apt-get install apache2 php5 mysql-server
```

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301220037.png)

**安装完成，开始配置LAMP**

- 设置MySQL的root账户的密码；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301220725.png)

- 重复一遍刚刚设置的root的密码；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301220736.png)

- 其余的按默认配置自动设置；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301221327.png)

**为了方便管理MySQL，接下来安装phpMyAdmin；**

``` bash
sudo apt-get install phpmyadmin
```

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301221522.png)

- 选择apache2，高亮后按空格选中，回车；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301221641.png)

- 使用默认配置即可，选择Yes；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301221936.png)

- 输入之前设置的MySQL的root账户密码；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301221955.png)

- 设置用于phpMyAdmin在数据库中注册所用的密码，之后有重复输入验证；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301222013.png)

**设置/var/www/目录的所有者和权限；**

``` bash
cd /var/
id pi
sudo chown -R pi:pi www/
sudo chmod -R 755 www/
```

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301223345.png)

**在/var/www/目录中新建一个index.php文件；**

``` bash
vi index.php
```

文件内容如下：

``` php
<?php
 phpinfo();
?>
```

在浏览器中打开 http://IP/index.php （IP即你的Raspberry的IP），可看到如下图所示的页面。至此，RaspberryPi上LAMP的搭建就基本结束了。

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301224143.png)

打开地址 http://IP/phpmyadmin/ 可以打开phpMyAdmin，如下图所示；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301222509.png)

用MySQL的root账户登录，即可很方便的对MySQL进行管理了。

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301222539.png)

**附加内容**

要管理RaspberryPi上的服务器，可以使用filezilla等软件通过SSH登录，类似于FTP管理。

这里以WinSCP为例。

- 打开WinSCP，点击右上角的新建按钮，填入服务器信息；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301234118.png)

- 输入完毕后点击保存，（可以选择保存密码），选择刚刚新建的会话，点击登录；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301222639.png)

- 在文件浏览器中定位到/var/www/目录，上传网页文件即可。

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301222723.png)

如下图，是我用Raspberry Pi运行之前做的数据库大程的截图。

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301224540.png)

至此本文就结束啦，Enjoy it!

若文中存在错误，欢迎斧正^_^
