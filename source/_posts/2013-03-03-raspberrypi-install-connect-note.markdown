---
author: nilennoct
comments: true
date: 2013-03-03 22:19:13
layout: post
slug: raspberrypi-install-connect-note
title: RaspberryPi安装、连接小记
wordpress_id: 187
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

树莓派（Raspberry Pi），是一款基于Linux系统的只有一张信用卡大小的单板机计算机。它由英国的树莓派基金会所开发，目的是以低价硬件及自由软件刺激在学校的基本的电脑科学教育。

树莓派配备一枚700MHz博通出产的ARM架构BCM2835处理器，256MB内存（B型已升级到512MB内存），使用SD卡当作储存媒体，且拥有一个Ethernet，两个USB接口，以及HDMI(支持声音输出)和RCA接口输出支持。Raspberry Pi只有一张信用卡大小，体积大概是一个火柴盒大小，可以执行像雷神之锤III竞技场的游戏和进行1080p影片的播放。操作系统采用开源的Linux系统，比如Debian、ArchLinux，自带的Iceweasel、KOffice等软件能够满足基本的网络浏览，文字处理以及计算机学习的需要，分A,B两种型号，其中售价分别是A型25美元，B型35美元。

树莓派基金会提供了基于ARM的Debian和Arch Linux的发行版供大众下载。还计划提供支持 Python 作为主要编程语言, 支持BBC BASIC , (通过 RISC OS 映像或者Linux的"Brandy Basic"克隆), C，和 Perl等编程语言。

下面让我们来一步步走入RPi的美妙世界。
**准备工作**

- PC一台
- Raspberry Pi B型板
- 2012-12-16-wheezy-raspbian.img镜像 [[下载]](http://pan.baidu.com/share/link?shareid=321044&uk=3842409107)
- 输出电流700mA以上的电源一个（移动电源、充电器均可），我选用了iPad的充电器，输出电流2A
- Micro USB数据线一条，用于供电
- 8G SD卡一张
- USB-Serial数据线一条
- 网线一条
- 折腾的精神

<!-- more -->
**向SD卡中写入系统镜像**

RPi上没有硬盘，而是使用了一个SD卡槽，以SD卡完成了硬盘的作用。要使用RPi，首先要在SD卡上写入RPi的系统镜像。

这里我们使用了2012-12-16-wheezy-raspbian.img这个镜像。

写img镜像很简单，Windows用户可以使用Win32 Disk Imager或是RawWrite，MacOS/Linux用户可以使用dd命令。

以Win32 Disk Imager为例。

到 [http://sourceforge.net/projects/win32diskimager/](http://sourceforge.net/projects/win32diskimager/) 下载Win32 Disk Imager，打开后找到下载的2012-12-16-wheezy-raspbian.img镜像，Device选择SD卡，点击Write，等待程序完成。

![Lab_01_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_01.png)

**连接RPi**

- 通过USB-Serial连接

安装PL2303驱动。Win8下安装PL2303_Win_1_7_0.zip会出现“设备无法启动 代码10”错误，这是因为新版的驱动不再对山寨芯片(= =)提供支持，所以需要使用旧版驱动，推荐1.5.0（测试可用）。需要注意的是安装了1.5.0驱动后，Win8识别到PL2303芯片后会自动更新驱动使之失效，需要回滚驱动程序，确保驱动程序日期是2011/10/7。

![Lab_01_05](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_05.png)

连接串口线。如下图，将串口线上的黑线连接到Ground口（上左3），白线连接到GPIO 14（上左4），绿线连接到GPIO 15（上左5），红线不连接。

![Lab_01_GPIO](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_GPIO.png)

连接好如下图所示。

![RPi_small](http://img.nilennoct.com/wp-content/uploads/2013/03/RPi_small.jpg)

使用putty连接RPi。打开putty，按下图填写连接信息。Serial line需要根据实际情况填写，可以从设备管理器中查到。

![Lab_01_06](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_06.png)

点击Open按钮，给RPi上点，会看到putty中飞快的闪过启动引导是输出的信息，稍等片刻，待出现“raspberrypi login”后用pi账号登录，初始密码为raspberry。此时若看到如下图所示的样子，说明你已经成功连接上RPi啦！

![Lab_01_08](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_08.png)

- 通过局域网连接RPi

RPi上有一个Ethernet接口，可以通过它将RPi与路由器接连，然后把电脑接入同一个局域网通过ssh连接RPi。RPi的IP地址可以从路由器的DHCP列表中查到。如下图中的192.168.0.4即为我们的RPi的IP（RPi的MAC地址以b8:27:eb开始，据此可以很方便的找到）。

![Task_06_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_06_01.png)

再次打开putty，按下图填写连接信息（IP地址请根据实际情况填写）。

![Lab_01_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_02.png)

点击Open按钮，用密码raspberry登录即可。如下图。

![Lab_01_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_03.png)

此时已经成功通过SSH连接上了RPi。

**RPi设置**

第一次启动RPi需要运行raspi-config进行一些设置。在已经连接上RPi的putty执行如下命令，可以看到如下图界面。

``` bash
sudo raspi-config
```

![Lab_01_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_04.png)

首先选择第二项“expand_rootfs”。因为刚写好的镜像只能使用SD卡上2G的内容，执行这一项后可以扩展文件系统以充分利用SD卡的容量。

第二次选择“change_timezone”修改系统的时区，选择“Asia”->“Shanghai”即可。

**开始折腾吧**

到此为止，RPi已经完全掌握在你的手中了，开始折腾吧>_<

比如写个Hello World就不错。

![Lab_01_09](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_01_09.png)
