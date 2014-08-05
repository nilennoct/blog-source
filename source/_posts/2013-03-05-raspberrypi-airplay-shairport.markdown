---
author: nilennoct
comments: true
date: 2013-03-05 22:56:35
layout: post
slug: raspberrypi-airplay-shairport
title: 在RaspberryPi上启用AirPlay
wordpress_id: 214
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程


**准备工作**

- 连入局域网的Raspberry Pi（有线或无线均可）
- 迷你音箱一个
- 连入相同局域网内的iOS设备

**更改缺省的音频输出端口**

将缺省的音频输出端口指向标准耳机端口而非原先的HDMI。

``` bash
sudo amixer cset numid=3 1
```

**安装shairport所需的包**

``` bash
sudo apt-get install git libao-dev libssl-dev libcrypt-openssl-rsa-perl libio-socket-inet6-perl libwww-perl avahi-utils libmodule-build-perl
```
<!-- more -->

**安装Perl Net-SDP，主要用于兼容iOS6**

``` bash
git clone https://github.com/njh/perl-net-sdp.git perl-net-sdp
cd perl-net-sdp
perl Build.PL
sudo ./Build
sudo ./Build test
sudo ./Build install
```

![Task_08_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_08_01.png)

**安装shairport并启动服务**

``` bash
git clone https://github.com/hendrikw82/shairport.git
cd shairport
sudo make
```

![Task_08_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_08_02.png)

**在RPi上开启shairport**

``` bash
./shairport.pl -a NeoAir
```

其中NeoAi为Airport的服务名称，可以更具需要自行设置。

![Task_08_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_08_03.png)

**测试**

打开iPad，在播放音乐时选择NeoAir，声音即在RPi上播放出来了。

![Task_08_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_08_04.png)

实际使用过程中，初次播放时有比较大的噪音。断开重新连接AirPlay后声音恢复正常。

> 本文内容参考 [Hacking a Raspberry Pi into a wireless airplay speaker](http://jordanburgess.com/post/38986434391/raspberry-pi-airplay)
