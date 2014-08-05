---
author: nilennoct
comments: true
date: 2013-03-07 18:00:55
layout: post
slug: raspberrypi-nas-chinese-encode-samba-sftp-dlna-nfs
title: RaspberryPi搭建NAS之中文兼容性检测
wordpress_id: 221
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程





> 在RPi上搭建NAS的过程详见《[在RaspberryPi上搭建NAS](http://www.nilennoct.com/raspberrypi-nas-samba-sftp/)》



NAS已经搭建好了，接下来我们要测试一下各种方式对中文路径名、文件名的兼容情况。

**Samba**

如下图所示，是Win8下访问通过Samba方式访问RPi的效果。我们可以发现不需要多余的设置，中文已经很完美的显示了。

![Task_09_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_09_01.png)
<!-- more -->

同样的，在iPad上可以正常显示。

![2013-03-07 10.32.53](http://img.nilennoct.com/wp-content/uploads/2013/03/2013-03-07-10.32.53.png)

---

**SFTP**

打开WinSCP，使用默认设置连接RPi，会发现中文全都变成了乱码，如下图。

![Task_09_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_09_02.png)

解决的方法很简单，打开WinSCP的登录界面，若是已经存储了会话，先读取。点击左侧的“环境”，将右侧的“文件名UTF-8编码”改为开启，如下图所示。

![Task_09_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_09_03.png)

重新连接，可以看到这下中文正常显示了（若是使用其他客户端，请寻找类似选项做类似的修改）。

![Task_09_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_09_04.png)

---

**DLNA**

在RPi上启动minidlna，在iPad上打开AcePlayer，选择Media Servers，会自动搜索局域网内的DLNA服务器。如下图所示。

![2013-03-07 11.33.35](http://img.nilennoct.com/wp-content/uploads/2013/03/2013-03-07-11.33.35.png)

选择raspberry:minidlna，即可查看各种媒体文件，如下图。可以看到中文也正常显示了。

![2013-03-07 11.08.22](http://img.nilennoct.com/wp-content/uploads/2013/03/2013-03-07-11.08.22.png)

---

**NFS（之前的文章未提到该方法，在此作补充）**

首先安装NFS

``` bash
sudo apt-get install nfs-kernel-server
```

编辑/etc/exports文件，在最后添加以下内容。

```
/media/NAS *(rw,sync,no_root_squash)
```

启动rpcbind。

``` bash
sudo update-rc.d rpcbind enable && update-rc.d nfs-common enable
sudo service rpcbind start
```

重启nfs-kernel-server

``` bash
sudo service nfs-kernel-server restart
```

![Task_09_05](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_09_05.png)

进入ubuntu，打开终端，输入以下命令。

``` bash
cd ~
mkdir nfs
sudo mount 192.168.0.4:/media/NAS /home/neo/nfs
```

![Task_09_06](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_09_06.png)

可以看到通过NFS方式访问RPi也能正常的显示中文。

若出现如下错误提示

```
mount: wrong fs type, bad option, bad superblock on fs2:/data3,
missing codepage or helper program, or other error
(for several filesystems (e.g. nfs, cifs) you might
need a /sbin/mount. helper program)
In some cases useful info is found in syslog - try
dmesg | tail or so
```

请执行如下命令：

``` bash
sudo apt-get install nfs-common
```
