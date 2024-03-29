---
author: nilennoct
comments: true
date: 2013-03-02 14:14:26
layout: post
slug: mstsc-remote-desktop-access-raspberrypi
title: 远程桌面访问RaspberryPi
wordpress_id: 172
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

既然说Raspberry Pi是一款基于Linux系统的个人电脑，那么GUI也必不可少。下面说说如何使用Windows自带的远程桌面连接登陆RPi。

**借助vnc远程访问**

Wheezy raspbian镜像中默认已经安装了TightVNC服务端，所以我们只需要简单的运行即可。

- 用SSH登录RPi（具体方法就不赘述了），运行TightVNC服务端；

``` bash
tightvncserver
```

按提示设置好连接密码即可。最后会询问是否需要设置一个只能查看的密码，因为是自己使用我就没有设置，各位可按照自己的需要选择是否设置，如下图；

![Task_04_08](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_08.png)
<!-- more -->

此时vnc服务器会自动生成一个:1桌面。

- 打开vnc客户端；

推荐使用RealVNC公司出品的VNC-Viewer，这是一款免费的VNC客户端，提供了Windows/MacOS/Linux多个版本，可以在 http://www.realvnc.com/download/viewer/ 下载使用（下载前需要填写姓名和邮箱等信息，但不进行验证）。

运行VNC Viewer，填写VNC Server的地址。注意到之前自动生成的桌面是:1，所以这里要填写IP:1，如下图。

![Task_04_10](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_10.png)

点击Connect后会弹出下图所示的警告，直接Continue即可。

![Task_04_11](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_11.png)

随后输入密码，即之前运行tightvncserver时设置的密码，就可以看到RPi的桌面了。

![Task_04_12](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_12.png)

查看连接信息可以发现默认的分辨率为1024*768，若是感觉看着别扭可以结束当前桌面并重建一个。

``` bash
vncserver -kill :1
vncserver :1 -geometry 1366x768 -depth 24
```

注意第二行命令中的“1366x768”中间是字母‘x’而非符号‘*’。

![Task_04_13](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_13.png)

重新连接就可以看到分辨率已经改为1366*768了。

![Task_04_14](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_14.png)

**借助xrdp用Windows远程桌面访问**

- 用SSH登录RPi，安装xrdp；

``` bash
sudo apt-get install xrdp
```

![Task_04_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_01.png)

- 打开远程桌面连接，填写RPi的IP地址和登陆用户名pi；

![Task_04_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_02.png)

- 点击连接，填写登录密码（若是在自己的电脑上可以勾选“记住我的凭证”）；

![Task_04_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_03.png)

- 稍等片刻，就可以看到RPi的桌面了（如下图）；

![Task_04_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_04.png)

可以使用桌面上的Midori浏览器浏览互联网（因为CPU主频只有700MHz所以感觉速度略卡）；

![Task_04_05](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_05.png)

浏览本地服务器上的页面也没有任何问题。

![Task_04_06](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_06.png)

通过浏览RPi的“开始菜单”，我们可以发现wheezy-raspbian已经预装了不少使用软件，比如Midori、xpdf、python、scratch等，基本可以满足日常需要。

![Task_04_07](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_04_07.png)
