---
author: nilennoct
comments: true
date: 2013-03-19 13:37:56
layout: post
slug: raspberrypi-ramdisk
title: 在RaspberryPi上使用Ramdisk
wordpress_id: 256
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

> RAM盘是通过使用软件将RAM模拟当做硬盘来使用的一种技术。相对于传统的硬盘文件访问来说，这种技术可以极大的提高在其上进行的文件访问的速度。新版B版的RPi内存达到了512MB，对于Raspbian来说是绰绰有余了。所以可以考虑把一部分RAM模拟成硬盘来加快存取速度。
Raspbian默认已经支持了Ramdisk，我们只需要格式化一个RamDisk，并将其mount到某一个目录上就可以了。

**查看所有可用的ramdisk**

``` bash
ls -al /dev/ram*
```

![Task_25_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_25_01.png)

**创建Ramdisk**

一般是使用ext2文件系统格式化Ramdisk。而在此之前，即使/dev/目录中有ram*设备文件，他们也是不占空间，必须进行格式化之后才能使用。因为Ramdisk是临时性的，所以没有必要使用带日志的文件系统，所以一般用ext2格式化就可以了。

``` bash
sudo mke2fs /dev/ram0
```
<!-- more -->

如下图所示，ram0已经成功被格式化了。

![Task_25_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_25_02.png)

**挂载Ramdisk，查看结果**

``` bash
sudo mount /dev/ram0 /var
mount | grep ram
df -h | grep ram
```

如下图所示，ram0已经成功挂载在了/var目录上，大小为3.9M。

![Task_25_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_25_03.png)

除此之外，也可以创建一个Ramdisk挂载在/tmp上，这样可以大大提高系统运行速度，而且每次重启都会自动清理/tmp目录，可谓一举两得了。
