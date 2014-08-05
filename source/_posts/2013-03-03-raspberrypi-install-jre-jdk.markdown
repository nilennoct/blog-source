---
author: nilennoct
comments: true
date: 2013-03-03 23:32:16
layout: post
slug: raspberrypi-install-jre-jdk
title: RaspberryPi安装JRE&JDK
wordpress_id: 200
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程



一开始我参考的是Oracle官网上的《[Getting Started with Java® SE Embedded on the Raspberry Pi](http://www.oracle.com/technetwork/articles/java/raspberrypi-1704896.html)》，从Oracle的网站上下载了ejre-7u10-fcs-b18-linux-arm-vfp-client_headless-28_nov_2012.tar.gz并进行了安装，方法如下。

- 上传ejre-7u10-fcs-b18-linux-arm-vfp-client_headless-28_nov_2012.tar.gz文件到RPi的/home/pi/文件夹。

- 安装EJRE。

``` bash
sudo mkdir /opt/java
sudo mv ~/ejre-7u10-fcs-b18-linux-arm-vfp-client_headless-28_nov_2012.tar.gz /opt/java
sudo tar -zxvf ejre-7u10-fcs-b18-linux-arm-vfp-client_headless-28_nov_2012.tar.gz
```
<!-- more -->

但是却出现了如下图所示的问题。

![Task_03_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_03_03.png)

即使通过以下命令在/usr/lib/目录下建立libjli.so的链接也依然无法解决。

``` bash
sudo ln -s /opt/java/ejre1.7.0_10/lib/arm/jli/libjli.so /usr/lib/
```

经 [@adoal](http://weibo.com/adoal) 提醒：

> Raspberry Pi可以用armel（软浮点）或者armhf（硬浮点）的Debian，但Oracle官方JRE只有软浮点的。

在之前提到的Oracle文档中也提到

> NOTE: These instructions are for Debian Squeeze. Other Linux implementations for the Raspberry Pi might work, but they must have been built for the ARM chip's software floating point. Images linked from the Raspberry Pi website might have been built for hardware floating point; they will not work with Java SE for Embedded.

而我使用的Raspbian确是armhf的，所以无法使用JRE。

既然无法安装JRE，那我们不妨换一个思路。于是我想到了安装JDK 8 (with JavaFX) for ARM预览版。

查看官网提供的文档 （[点击这里](http://jdk8.java.net/fxarmpreview/javafx-arm-developer-preview.html)） ，可以看到这个jdk版本已经在hardfloat Raspbian上测试通过了。

> **Download the SD card OS image.**
JavaFX was tested with the hardfloat Raspbian "wheezy" distributions of 2012-09-18 and 2012-10-28. Before deciding which version to download, see RT-26973 in the Known Issues section.

从 [http://jdk8.java.net/fxarmpreview/](http://jdk8.java.net/fxarmpreview/) 下载到Oracle JDK 8 (with JavaFX) for ARM Early Access（jdk-8-ea-b36e-linux-arm-hflt-29_nov_2012.tar.gz），用同样的方法上传到RPi，进行安装。

``` bash
sudo mv ~/jdk-8-ea-b36e-linux-arm-hflt-29_nov_2012.tar.gz /opt/java
sudo tar -zxvf jdk-8-ea-b36e-linux-arm-hflt-29_nov_2012.tar.gz
```

没有悬念，这次Java成功运行了，如下图所示。

![Task_03_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_03_04.png)

接下来就好办了，添加环境变量。

``` bash
sudo vi /etc/profile
```

在最后添加以下内容：

```
export JAVA_HOME=/opt/java/jdk1.8.0
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
```

最后执行以下命令更新并查看环境变量，如下图，可以看到JAVA的环境变量已经设置好了。

``` bash
source /etc/profile & env
```

赶紧写一个java程序测试一下吧！

![Task_03_06](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_03_06.png)
